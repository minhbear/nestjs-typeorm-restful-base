export const randomSpecialChar = (): string => {
  const specialCharacters = '@$!%()*#?&^<>';
  const index = Math.floor((specialCharacters.length - 1) * Math.random());

  return specialCharacters.substring(index, index + 1);
};
