export type ManagerEstimateInput = {
  fenceType?: string;
  length?: string;
  height?: string;
  gateType?: string;
  wicket?: string;
  paymentMethod?: string;
  city?: string;
};

export type ManagerEstimateFailureReason =
  | "invalid_length"
  | "unsupported_fence_type"
  | "unsupported_height"
  | "unsupported_gate_type"
  | "unsupported_wicket";

type FenceType = keyof typeof PRICE_PER_METER;
type CalculationHeight = keyof (typeof PRICE_PER_METER)[FenceType];

type ManagerEstimateContext = {
  lengthMeters: number | null;
  fenceType: string;
  requestedHeight: string;
  heightFallbackUsed: boolean;
  gateType: string;
  wicket: string;
};

export type ManagerEstimateResult =
  | (ManagerEstimateContext & {
      status: "calculated";
      reason: null;
      calculationHeight: CalculationHeight;
      pricePerMeter: number;
      fenceSubtotal: number;
      gatePrice: number;
      wicketPrice: number;
      total: number;
    })
  | (ManagerEstimateContext & {
      status: "manual_required";
      reason: ManagerEstimateFailureReason;
      calculationHeight: CalculationHeight | null;
      pricePerMeter: null;
      fenceSubtotal: null;
      gatePrice: null;
      wicketPrice: null;
      total: null;
    });

const CONSULTATION_HEIGHT = "Не знаю, нужна консультация";
const CONSULTATION_CALCULATION_HEIGHT = "1.7 м" as const;

const PRICE_PER_METER = {
  "Сетка-рабица": {
    "1.5 м": 65,
    "1.7 м": 70,
    "2.0 м": 75,
  },
  Профнастил: {
    "1.5 м": 130,
    "1.7 м": 135,
    "2.0 м": 140,
  },
  Евроштакетник: {
    "1.5 м": 155,
    "1.7 м": 165,
    "2.0 м": 180,
  },
} as const;

const GATE_PRICE = {
  Распашные: 1400,
  Откатные: 4500,
  "Не нужны": 0,
} as const;

const WICKET_PRICE = {
  "Да, нужна": 1200,
  "Нет, не нужна": 0,
} as const;

function hasOwn<T extends object>(value: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function parseLengthMeters(length?: string) {
  if (!length) {
    return null;
  }

  const match = length.match(/[+-]?\d+(?:[.,]\d+)?/);

  if (!match) {
    return null;
  }

  const numeric = Number(match[0].replace(",", "."));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function manualEstimate(
  input: ManagerEstimateContext & {
    calculationHeight: CalculationHeight | null;
  },
  reason: ManagerEstimateFailureReason,
): ManagerEstimateResult {
  return {
    status: "manual_required",
    reason,
    ...input,
    pricePerMeter: null,
    fenceSubtotal: null,
    gatePrice: null,
    wicketPrice: null,
    total: null,
  };
}

export function calculateManagerEstimate(
  input: ManagerEstimateInput,
): ManagerEstimateResult {
  const lengthMeters = parseLengthMeters(input.length?.trim());
  const fenceType = input.fenceType?.trim() ?? "";
  const requestedHeight = input.height?.trim() ?? "";
  const gateType = input.gateType?.trim() ?? "";
  const wicket = input.wicket?.trim() ?? "";
  const heightFallbackUsed = requestedHeight === CONSULTATION_HEIGHT;
  const calculationHeightCandidate = heightFallbackUsed
    ? CONSULTATION_CALCULATION_HEIGHT
    : requestedHeight;
  const calculationHeight = hasOwn(
    PRICE_PER_METER.Профнастил,
    calculationHeightCandidate,
  )
    ? calculationHeightCandidate
    : null;
  const resultInput = {
    lengthMeters,
    fenceType,
    requestedHeight,
    calculationHeight,
    heightFallbackUsed,
    gateType,
    wicket,
  };

  if (lengthMeters === null) {
    return manualEstimate(resultInput, "invalid_length");
  }

  if (!hasOwn(PRICE_PER_METER, fenceType)) {
    return manualEstimate(resultInput, "unsupported_fence_type");
  }

  if (calculationHeight === null) {
    return manualEstimate(resultInput, "unsupported_height");
  }

  const pricesByHeight = PRICE_PER_METER[fenceType];

  if (!hasOwn(GATE_PRICE, gateType)) {
    return manualEstimate(resultInput, "unsupported_gate_type");
  }

  if (!hasOwn(WICKET_PRICE, wicket)) {
    return manualEstimate(resultInput, "unsupported_wicket");
  }

  const pricePerMeter = pricesByHeight[calculationHeight];
  const fenceSubtotal = roundCurrency(lengthMeters * pricePerMeter);
  const gatePrice = GATE_PRICE[gateType];
  const wicketPrice = WICKET_PRICE[wicket];

  return {
    status: "calculated",
    reason: null,
    ...resultInput,
    calculationHeight,
    heightFallbackUsed,
    pricePerMeter,
    fenceSubtotal,
    gatePrice,
    wicketPrice,
    total: roundCurrency(fenceSubtotal + gatePrice + wicketPrice),
  };
}
