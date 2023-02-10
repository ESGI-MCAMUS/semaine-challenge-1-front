export const validateEmail = async (_rule, value) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  if (value === "") {
    return Promise.reject("Veuillez saisir votre adresse mail");
  } else if (!regex.test(value)) {
    return Promise.reject("Veuillez saisir une adresse mail valide");
  } else {
    return Promise.resolve();
  }
};
