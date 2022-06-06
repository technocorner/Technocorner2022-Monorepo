export function verifyUri(uri: string) {
  const regex =
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=\*]*)/;
  const match = uri.match(regex);
  if (match && match[0] === uri) {
    return true;
  }
  return false;
}

export function verifyCustomUri(uri: string) {
  const regex = /[-a-zA-Z0-9_]*/;
  const match = uri.match(regex);
  if (match && match[0] === uri) {
    return true;
  }
  return false;
}
