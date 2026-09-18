import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's type-stripping loader requires the explicit extension.
import { calculateManagerEstimate } from "../lib/lead-pricing.ts";

const baseInput = {
  fenceType: "Профнастил",
  length: "40 м",
  height: "1.7 м",
  gateType: "Не нужны",
  wicket: "Нет, не нужна",
};

const priceCases = [
  ["Сетка-рабица", "1.5 м", 65],
  ["Сетка-рабица", "1.7 м", 70],
  ["Сетка-рабица", "2.0 м", 75],
  ["Профнастил", "1.5 м", 130],
  ["Профнастил", "1.7 м", 135],
  ["Профнастил", "2.0 м", 140],
  ["Евроштакетник", "1.5 м", 155],
  ["Евроштакетник", "1.7 м", 165],
  ["Евроштакетник", "2.0 м", 180],
] as const;

for (const [fenceType, height, pricePerMeter] of priceCases) {
  test(`${fenceType}, ${height}: ${pricePerMeter} BYN/м.п.`, () => {
    const estimate = calculateManagerEstimate({
      ...baseInput,
      fenceType,
      height,
      length: "10",
    });

    assert.equal(estimate.status, "calculated");
    assert.equal(estimate.pricePerMeter, pricePerMeter);
    assert.equal(estimate.fenceSubtotal, pricePerMeter * 10);
  });
}

test("Example A: fence without gates or wicket", () => {
  const estimate = calculateManagerEstimate(baseInput);

  assert.equal(estimate.status, "calculated");
  assert.equal(estimate.fenceSubtotal, 5400);
  assert.equal(estimate.total, 5400);
});

test("Example B: swing gates and wicket", () => {
  const estimate = calculateManagerEstimate({
    ...baseInput,
    gateType: "Распашные",
    wicket: "Да, нужна",
  });

  assert.equal(estimate.status, "calculated");
  assert.equal(estimate.gatePrice, 1400);
  assert.equal(estimate.wicketPrice, 1200);
  assert.equal(estimate.total, 8000);
});

test("Example C: chain-link fence with sliding gates", () => {
  const estimate = calculateManagerEstimate({
    ...baseInput,
    fenceType: "Сетка-рабица",
    length: "100 м",
    height: "2.0 м",
    gateType: "Откатные",
  });

  assert.equal(estimate.status, "calculated");
  assert.equal(estimate.fenceSubtotal, 7500);
  assert.equal(estimate.gatePrice, 4500);
  assert.equal(estimate.total, 12000);
});

test("Example D: picket fence with wicket", () => {
  const estimate = calculateManagerEstimate({
    ...baseInput,
    fenceType: "Евроштакетник",
    length: "20",
    height: "1.5 м",
    wicket: "Да, нужна",
  });

  assert.equal(estimate.status, "calculated");
  assert.equal(estimate.fenceSubtotal, 3100);
  assert.equal(estimate.wicketPrice, 1200);
  assert.equal(estimate.total, 4300);
});

test("Example E: consultation height uses 1.7 m without replacing request", () => {
  const requestedHeight = "Не знаю, нужна консультация";
  const estimate = calculateManagerEstimate({
    ...baseInput,
    height: requestedHeight,
  });

  assert.equal(estimate.status, "calculated");
  assert.equal(estimate.requestedHeight, requestedHeight);
  assert.equal(estimate.calculationHeight, "1.7 м");
  assert.equal(estimate.heightFallbackUsed, true);
  assert.equal(estimate.total, 5400);
});

test("consultation height assumption remains explicit when another field is unsupported", () => {
  const estimate = calculateManagerEstimate({
    ...baseInput,
    height: "Не знаю, нужна консультация",
    gateType: "Гаражные",
  });

  assert.equal(estimate.status, "manual_required");
  assert.equal(estimate.calculationHeight, "1.7 м");
  assert.equal(estimate.heightFallbackUsed, true);
  assert.equal(estimate.total, null);
});

test("length parser supports plain, unit, comma decimal, and surrounding text", () => {
  const values = [
    ["40", 40],
    ["40 м", 40],
    ["40,5 м", 40.5],
    ["около 40 м", 40],
  ] as const;

  for (const [length, expected] of values) {
    const estimate = calculateManagerEstimate({ ...baseInput, length });
    assert.equal(estimate.status, "calculated");
    assert.equal(estimate.lengthMeters, expected);
  }
});

test("invalid and non-positive lengths require manual calculation", () => {
  for (const length of ["", "abc", "0", "-40 м"]) {
    const estimate = calculateManagerEstimate({ ...baseInput, length });
    assert.equal(estimate.status, "manual_required");
    assert.equal(estimate.reason, "invalid_length");
    assert.equal(estimate.total, null);
  }
});

const unsupportedCases = [
  ["fenceType", "Деревянный", "unsupported_fence_type"],
  ["height", "1.8 м", "unsupported_height"],
  ["gateType", "Гаражные", "unsupported_gate_type"],
  ["wicket", "Калитка с замком", "unsupported_wicket"],
] as const;

for (const [field, value, reason] of unsupportedCases) {
  test(`unsupported ${field} does not use a hidden fallback`, () => {
    const estimate = calculateManagerEstimate({
      ...baseInput,
      [field]: value,
    });

    assert.equal(estimate.status, "manual_required");
    assert.equal(estimate.reason, reason);
    assert.equal(estimate.total, null);
  });
}

test("payment method and city do not affect price", () => {
  const ownFunds = calculateManagerEstimate({
    ...baseInput,
    paymentMethod: "Собственные средства",
    city: "Гомель",
  });
  const installment = calculateManagerEstimate({
    ...baseInput,
    paymentMethod: "Рассрочка или кредит",
    city: "Минск",
  });

  assert.equal(ownFunds.status, "calculated");
  assert.equal(installment.status, "calculated");
  assert.equal(ownFunds.total, installment.total);
  assert.equal(ownFunds.total, 5400);
});
