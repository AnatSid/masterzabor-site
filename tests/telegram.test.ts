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
  name: "Олег",
  phone: "+375298257195",
  city: "а/г Снитово Ивановский район Брестская область",
  source: "home-quiz",
  fenceType: "Профнастил",
  length: "60 м",
  height: "1.7 м",
  gateType: "Распашные",
  wicket: "Да, нужна",
  paymentMethod: "Рассрочка или кредит",
};

test("Quiz lead uses the new semantic blocks", () => {
  const message = formatLeadMessage(baseLead);

  assert.match(message, /🔔 Новая заявка с masterzabor\.by/);
  assert.match(message, /👤 КЛИЕНТ\nИмя: Олег\nТелефон: \+375298257195/);
  assert.match(message, /🏗 ЗАБОР\nТип: Профнастил\nДлина: 60 м/);
  assert.match(message, /💳 ОПЛАТА\nРассрочка или кредит/);
  assert.match(message, /💰 ОРИЕНТИР ДЛЯ МЕНЕДЖЕРА/);
  assert.match(message, /Источник: home-quiz/);
});

test("field rows no longer use the old per-field emoji", () => {
  const message = formatLeadMessage(baseLead);

  assert.doesNotMatch(message, /📞|📍|📏|📐|🚪|🚶|📄|⏰/);
});

test("comment block is present only for a non-empty comment", () => {
  const withComment = formatLeadMessage({
    ...baseLead,
    comment: "Позвонить после 18:00",
  });
  const withoutComment = formatLeadMessage({
    ...baseLead,
    comment: "   ",
  });

  assert.match(
    withComment,
    /💬 КОММЕНТАРИЙ КЛИЕНТА\nПозвонить после 18:00/,
  );
  assert.doesNotMatch(withoutComment, /КОММЕНТАРИЙ КЛИЕНТА/);
});

test("regular payment method uses the standard payment block", () => {
  const message = formatLeadMessage(baseLead);

  assert.match(message, /💳 ОПЛАТА\nРассрочка или кредит/);
  assert.doesNotMatch(message, /<b>Рассрочка или кредит<\/b>/);
});

test("own funds use the emphasized payment block", () => {
  const message = formatLeadMessage({
    ...baseLead,
    paymentMethod: "Собственные средства",
  });

  assert.match(message, /💵 ОПЛАТА\n<b>СОБСТВЕННЫЕ СРЕДСТВА<\/b>/);
  assert.doesNotMatch(message, /💳 ОПЛАТА/);
});

test("regular height is repeated in the manager estimate", () => {
  const message = formatLeadMessage(baseLead);

  assert.match(
    message,
    /Забор: 60 м \(Профнастил, 1\.7 м\) × 135 BYN\/м\.п\. = 8100 BYN/,
  );
  assert.doesNotMatch(message, /Для расчёта принята высота/);
});

test("consultation height keeps the answer and explains the 1.7 m estimate", () => {
  const message = formatLeadMessage({
    ...baseLead,
    height: "Не знаю, нужна консультация",
  });

  assert.match(message, /Высота: Не знаю, нужна консультация/);
  assert.match(
    message,
    /Забор: 60 м \(Профнастил, высоту клиент не знает\) × 135 BYN\/м\.п\. = 8100 BYN/,
  );
  assert.match(message, /Для расчёта принята высота 1\.7 м/);
});

test("gate and wicket answers are repeated with their prices", () => {
  const message = formatLeadMessage(baseLead);

  assert.match(message, /Ворота: Распашные — 1400 BYN/);
  assert.match(message, /Калитка: Да, нужна — 1200 BYN/);
  assert.match(message, /<b>ИТОГО: ≈ 10700 BYN<\/b>/);
});

test("user HTML is escaped while trusted bold markup remains active", () => {
  const message = formatLeadMessage({
    ...baseLead,
    name: "<b>Олег</b>",
    city: "<i>Снитово</i>",
    comment: "<script>alert('x')</script>",
    source: "<u>home-quiz</u>",
    paymentMethod: "Собственные средства",
  });

  assert.doesNotMatch(message, /<b>Олег<\/b>|<i>Снитово<\/i>|<script>|<u>/);
  assert.match(message, /&lt;b&gt;Олег&lt;\/b&gt;/);
  assert.match(message, /&lt;i&gt;Снитово&lt;\/i&gt;/);
  assert.match(message, /&lt;script&gt;alert\('x'\)&lt;\/script&gt;/);
  assert.match(message, /&lt;u&gt;home-quiz&lt;\/u&gt;/);
  assert.match(message, /<b>СОБСТВЕННЫЕ СРЕДСТВА<\/b>/);
  assert.match(message, /<b>ИТОГО: ≈ 10700 BYN<\/b>/);
});

test("generic LeadForm omits unavailable Quiz sections and estimate", () => {
  const message = formatLeadMessage({
    name: "Анна",
    phone: "+375291112233",
    source: "contacts-form",
  });

  assert.match(message, /👤 КЛИЕНТ\nИмя: Анна\nТелефон: \+375291112233/);
  assert.doesNotMatch(message, /🏗 ЗАБОР|ОПЛАТА|ОРИЕНТИР ДЛЯ МЕНЕДЖЕРА/);
  assert.match(message, /Источник: contacts-form/);
});
