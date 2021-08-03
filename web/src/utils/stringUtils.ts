export const toSentenceCase = (value: string): string => {
  const result = value.replace(/([A-Z])/g, " $1");

  const final = result.charAt(0).toUpperCase() + result.slice(1);

  return final;
};
