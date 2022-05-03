
export const setItem = (setName, val) => {
    if (typeof val === 'object') {
        localStorage.setItem(setName, JSON.stringify(val))
        return ;
    }
    localStorage.setItem(setName, val);
}
export const getItem = (getName) => {
  try {
  return  JSON.parse(localStorage.getItem(getName)) ;
  } catch (error) {
    console.log('error',error);
    return error;
  }
}