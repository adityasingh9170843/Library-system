const KEY = 'lib_auth';

export function setAuth(_token, user){
  // token is stored in httpOnly cookie; we only persist user info
  localStorage.setItem(KEY, JSON.stringify({ user }));
}
export function logout(){
  localStorage.removeItem(KEY);
}
export function getToken(){
  return null; // we no longer use in-app tokens; cookie is used
}
export function getUser(){
  try { return JSON.parse(localStorage.getItem(KEY))?.user || null } catch { return null }
}
