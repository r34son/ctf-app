export const setData = data =>
  localStorage.setItem('authData', JSON.stringify(data));
export const getData = () => JSON.parse(localStorage.getItem('authData'));
