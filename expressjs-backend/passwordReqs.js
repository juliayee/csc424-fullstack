// Function to check if the password meets minimum length requirement
function isLengthValid(password, minLength) {
    return password.length >= minLength;
  }
  
  // Function to check if the password contains at least one uppercase letter
  function hasUppercase(password) {
    return /[A-Z]/.test(password);
  }
  
  // Function to check if the password contains at least one lowercase letter
  function hasLowercase(password) {
    return /[a-z]/.test(password);
  }
  
  // Function to check if the password contains at least one digit
  function hasDigit(password) {
    return /\d/.test(password);
  }
  
  // Function to check if the password contains at least one special character
  function hasSpecialCharacter(password) {
    return /[!@#$%^&*()\-_=+\\|[\]{};:'",.<>/?]/.test(password);
  }
  
  // Function to validate password based on all requirements
  function isPasswordValid(password, minLength) {
      if (isLengthValid(password, minLength) &&
      hasUppercase(password) &&
      hasLowercase(password) &&
      hasDigit(password) &&
      hasSpecialCharacter(password)){
        return true;
      }
      else{
        return undefined;
      }
  }

  exports.isPasswordValid = isPasswordValid;