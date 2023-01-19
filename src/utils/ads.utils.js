export const formatPrice = (price) => {
  return price !== undefined
    ? price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : 0;
};
