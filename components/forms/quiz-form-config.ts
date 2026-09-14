export const QUIZ_STEPS = [
  { id: "fenceType", fields: ["fenceType"] },
  { id: "length", fields: ["length"] },
  { id: "height", fields: ["height"] },
  { id: "gateType", fields: ["gateType"] },
  { id: "wicket", fields: ["wicket"] },
  { id: "paymentMethod", fields: ["paymentMethod"] },
  { id: "contact", fields: ["name", "phone"] },
] as const;

export const QUIZ_TOTAL_STEPS = QUIZ_STEPS.length;

export const PAYMENT_METHODS = [
  "Собственные средства",
  "Рассрочка или кредит",
  "Пока не решил",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
