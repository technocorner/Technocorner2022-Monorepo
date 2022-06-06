export function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value};`;
}

export function getCookie(name: string) {
  return (
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || ""
  );
}

export function deleteCookie(name: string) {
  document.cookie = name + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
