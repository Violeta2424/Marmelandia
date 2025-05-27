export const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validatePhone = (phone) => {
  const re = /^\+?[0-9]{10,13}$/;
  return re.test(phone);
};

export const validateName = (name) => {
  return name.length >= 2;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validatePrice = (price) => {
  return !isNaN(price) && price >= 0;
};

export const validateQuantity = (quantity) => {
  return !isNaN(quantity) && quantity > 0 && Number.isInteger(Number(quantity));
};

export const validatePostalCode = (code) => {
  const re = /^[0-9]{5}$/;
  return re.test(code);
};

export const getValidationError = (field, value) => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Невірний формат електронної пошти' : '';
    case 'password':
      return !validatePassword(value) ? 'Пароль має бути не менше 6 символів' : '';
    case 'phone':
      return !validatePhone(value) ? 'Невірний формат номера телефону' : '';
    case 'name':
      return !validateName(value) ? 'Ім\'я має бути не менше 2 символів' : '';
    case 'price':
      return !validatePrice(value) ? 'Ціна має бути додатнім числом' : '';
    case 'quantity':
      return !validateQuantity(value) ? 'Кількість має бути цілим додатнім числом' : '';
    case 'postalCode':
      return !validatePostalCode(value) ? 'Невірний формат поштового індексу' : '';
    default:
      return !validateRequired(value) ? 'Це поле обов\'язкове' : '';
  }
}; 