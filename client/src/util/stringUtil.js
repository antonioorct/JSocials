export function toSentenceCase(str) {
  let newStr = str.charAt(0).toUpperCase();

  for (let i = 1; i < str.length; i++) {
    if (/[A-Z]/g.test(str.charAt(i)))
      newStr += " " + str.charAt(i).toLowerCase();
    else newStr += str.charAt(i);
  }

  return newStr;
}

export function toCamelCase(str) {
  return (
    str.charAt(0).toLowerCase() +
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("")
      .slice(1)
  );
  // for (let i = 1; i < str.length; i++) {
  //   if (/[A-Z]/g.test(str.charAt(i)))
  //     newStr += " " + str.charAt(i).toLowerCase();
  //   else newStr += str.charAt(i);
  // }

  // return newStr;
}
