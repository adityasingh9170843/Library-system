const KEY = 'lib_auth';

export function setAuth(_token, user){
  
  localStorage.setItem(KEY, JSON.stringify({ user }));
}
export function logout(){
  localStorage.removeItem(KEY);
}
export function getToken(){
  return null; 
}
export function getUser(){
  try { return JSON.parse(localStorage.getItem(KEY))?.user || null } catch { return null }
}
