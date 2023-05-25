export const isNumberWithoutDecimal = (value) => {
  if (typeof value === "number") {
    value = value.toString();
  }
  return /^\d+$/.test(value);
};
