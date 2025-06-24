function uppercaseCheck(password) {
  return /[A-Z]/.test(password); // At least one uppercase character
}

function lowercaseCheck(password) {
  return /[a-z]/.test(password); // At least one lowercase character
}

function digitCheck(password) {
  return /[0-9]/.test(password); // At least one digit
}

function specialCharacterCheck(password) {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least one special character
}

function isValidEmail(email) {
  // Pola regex untuk memeriksa format email yang benar
  //const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function userInputPasswordCheck(password) {
  // At least 8 characters long with uppercase, lowercase, digit, and special character
  if (
    password.length >= 8 &&
    uppercaseCheck(password) &&
    lowercaseCheck(password) &&
    digitCheck(password) &&
    specialCharacterCheck(password)
  ) {
    return true;
  } else {
    return false;
  }
  /*
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!uppercaseCheck(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!lowercaseCheck(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }
  if (!digitCheck(password)) {
    errors.push("Password must contain at least one digit.");
  }
  if (!specialCharacterCheck(password)) {
    errors.push("Password must contain at least one special character.");
  }
    */
}

module.exports = {
  userInputPasswordCheck,
  isValidEmail,
};
