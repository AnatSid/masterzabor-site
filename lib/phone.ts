const BELARUS_COUNTRY_CODE = "375";
const BELARUS_ALLOWED_OPERATOR_CODES = ["25", "29", "33", "44"] as const;

export const BELARUS_PHONE_PREFIX = `+${BELARUS_COUNTRY_CODE}`;

export function extractBelarusLocalDigits(value: string): string {
  const digits = value.replaceAll(/\D/g, "");

  if (digits.startsWith(BELARUS_COUNTRY_CODE)) {
    return digits.slice(BELARUS_COUNTRY_CODE.length, BELARUS_COUNTRY_CODE.length + 9);
  }

  return digits.slice(0, 9);
}

export function formatBelarusPhoneMask(localDigits: string): string {
  const digits = localDigits.slice(0, 9);

  const parts = [
    digits.slice(0, 2),
    digits.slice(2, 5),
    digits.slice(5, 7),
    digits.slice(7, 9),
  ].filter(Boolean);

  return parts.join("-");
}

export function buildBelarusPhone(localDigits: string): string {
  return `${BELARUS_PHONE_PREFIX}${localDigits.slice(0, 9)}`;
}

export function isValidBelarusPhone(phone: string): boolean {
  const localDigits = extractBelarusLocalDigits(phone);

  if (localDigits.length !== 9) {
    return false;
  }

  return BELARUS_ALLOWED_OPERATOR_CODES.some((operatorCode) =>
    localDigits.startsWith(operatorCode),
  );
}

export function normalizeBelarusPhone(phone: string): string {
  return buildBelarusPhone(extractBelarusLocalDigits(phone));
}
