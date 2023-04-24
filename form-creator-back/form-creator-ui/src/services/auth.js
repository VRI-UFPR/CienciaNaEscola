export const TOKEN = "token";

export function isAuthenticated() {
  return localStorage.getItem(TOKEN) !== null ? true : false;
}

export function getToken() {
  return localStorage.getItem(TOKEN);
}
