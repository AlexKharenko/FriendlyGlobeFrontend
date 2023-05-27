export const isNumberWithoutDecimal = (value) => {
  if (typeof value === "number") {
    value = value.toString();
  }
  // eslint-disable-next-line prettier/prettier
  return (/^\d+$/).test(value);
};
