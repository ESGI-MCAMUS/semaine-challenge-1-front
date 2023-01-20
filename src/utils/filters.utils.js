export const buildQueryString = (obj) => {
  const queryString = Object.keys(obj)
    .map((key) => {
      return obj[key] !== undefined
        ? `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
        : null;
    })
    .join("&");
  return queryString.slice(-1) === "&" ? queryString.slice(0, -1) : queryString;
};
