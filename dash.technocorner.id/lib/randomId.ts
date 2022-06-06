function randomId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const totalChar = characters.length;
  let result = "";
  for (let i = 0; i < length; ++i) {
    result += characters.charAt(Math.random() * totalChar);
  }
  return result;
}

export default randomId;
