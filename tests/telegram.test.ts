import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";
import { pathToFileURL } from "node:url";

const projectRootUrl = pathToFileURL(`${process.cwd()}\\`);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(
        new URL(`${specifier.slice(2)}.ts`, projectRootUrl).href,
        context,
      );
    }

    return nextResolve(specifier, context);
  },
});

// @ts-expect-error Node's type-stripping loader requires the explicit extension.
const { formatLeadMessage } = await import("../lib/telegram.ts");

const baseLead = {
  name: "Иван",
  phone: "+375 29 123-45-67",
  source: "Квиз",
  fenceType: "Профнастил",
  length: "40 м",
  gateType: "Не нужны",
  wicket: "Нет, не нужна",
};

for (const height of ["1.5 м", "1.7 м", "2.0 м"]) {
  test(`${height} keeps the estimate without a fallback note`, () => {
    const message = formatLeadMessage({ ...baseLead, height });

    assert.match(message, /💰 Ориентир \(для менеджера\):/);
    assert.doesNotMatch(
      message,
      /Для ориентира использована высота 1\.7 м/,
    );
  });
}

test("consultation height keeps the answer and explains the 1.7 m estimate", () => {
  const message = formatLeadMessage({
    ...baseLead,
    height: "Не знаю, нужна консультация",
  });

  assert.match(message, /📐 Высота: Не знаю, нужна консультация/);
  assert.match(message, /40м × 135 BYN\/м\.п\. = 5400 BYN/);
  assert.match(message, /Для ориентира использована высота 1\.7 м/);
});

test("formatter keeps Telegram HTML escaped", () => {
  const message = formatLeadMessage({
    ...baseLead,
    name: "<b>Иван</b>",
    height: "1.7 м",
  });

  assert.doesNotMatch(message, /<b>Иван<\/b>/);
  assert.match(message, /&lt;b&gt;Иван&lt;\/b&gt;/);
});
