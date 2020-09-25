// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authorityString = localStorage.getItem('control-authority');
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  return localStorage.setItem('control-authority', JSON.stringify(proAuthority));
}

export function removeAuthority() {
  return localStorage.removeItem('control-authority');
}
