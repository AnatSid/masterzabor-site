export function getDistrictPrepositional(cityName: string) {
  const name = cityName.trim();

  if (name === "Горки") {
    return "Горецком";
  }

  if (name.endsWith("ино")) {
    return `${name.slice(0, -1)}ском`;
  }

  if (name.endsWith("чно") || name.endsWith("дно")) {
    return `${name.slice(0, -2)}ненском`;
  }

  if (name.endsWith("ое")) {
    return `${name.slice(0, -2)}ском`;
  }

  if (name.endsWith("ёза")) {
    return `${name.slice(0, -1)}овском`;
  }

  if (name.endsWith("инка")) {
    return `${name.slice(0, -1)}овском`;
  }

  if (name.endsWith("ша")) {
    return `${name.slice(0, -1)}анском`;
  }

  if (name.endsWith("ица")) {
    return `${name.slice(0, -1)}ком`;
  }

  if (name.endsWith("да")) {
    return `${name.slice(0, -1)}ском`;
  }

  if (name.endsWith("и")) {
    return `${name.slice(0, -1)}ском`;
  }

  if (name.endsWith("ок")) {
    return `${name.slice(0, -2)}ском`;
  }

  if (name.endsWith("ыск")) {
    return `${name.slice(0, -1)}ском`;
  }

  if (name.endsWith("ск") || name.endsWith("цк")) {
    return `${name}ом`;
  }

  if (name.endsWith("ырь") || name.endsWith("онь")) {
    return `${name.slice(0, -1)}ском`;
  }

  return `${name}ском`;
}
