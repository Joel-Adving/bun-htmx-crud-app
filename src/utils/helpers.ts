export function toBoolean(number: 0 | 1) {
  return number === 1
}

export function fromBoolean(boolean: boolean) {
  return boolean ? 1 : 0
}
