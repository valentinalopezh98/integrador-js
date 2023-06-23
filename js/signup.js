const signUpForm = document.getElementById("form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");


const users = JSON.parse(localStorage.getItem("users")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("users", JSON.stringify(users));
};

const isEmpty = (input) => {
  return !input.value.trim().length;
};

// valida si ya estaba registrado el email
const isExistingEmail = (input) => {
    return users.some((user) => user.email === input.value.trim());
  };

//valida email con regex
const isEmailValid = (input) => {
  const regex = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,4})+$/;
  return regex.test(input.value.trim());
};

//valida entre un minumo y un maximo
const isBetween = (input, min, max) => {
    return input.value.length >= min && input.value.length < max;
};

//valida que solo tenga letras
const isLetterOnly = (input) => {
    const regex = /^[A-Za-z\s]*$/;
    return regex.test(input.value.trim()); 
}

//valida que la contrasena tenga 8 caracteres minimo, numeros y alguna mayuscula
const isPasswordSecure = (input) => {
  const regex = /^(?=(?:.*\d))(?=.*[A-Z])(?=.*[a-z])(?=.*[.,*!?¿¡/#$%&])\S{8,}$/;
  return regex.test(input.value.trim());
};


const showError = (input, message) => {
  const inputContainer = input.parentElement;

  inputContainer.classList.remove("success");
  inputContainer.classList.add("error");

  const error = inputContainer.querySelector("small");

  error.style.display = "block";
  error.textContent = message;
};

const showSuccess = (input) => {
  const inputContainer = input.parentElement;

  inputContainer.classList.remove("error");
  inputContainer.classList.add("success");

  const error = inputContainer.querySelector("small");
  error.textContent = "";
};

const checkNameInput = (input) => {
  let valid = false;
  const minChar = 3;
  const maxChar = 20;

  if (isEmpty(input)) {
    showError(input, "Este campo es obligatorio");
    return;
  }
  if (!isBetween(input, minChar, maxChar)) {
    showError(
      input,
      `Este campo debe tener entre ${minChar} y ${maxChar} caracteres.`
    );
    return;
  }
  if (!isLetterOnly(input)){
    showError(input, "Solo puede ingresar letras");
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};


const checkEmail = (input) => {
  let valid = false;

  if (isEmpty(input)) {
    showError(input, "El mail es obligatorio");
    return;
  }

  if (!isEmailValid(input)) {
    showError(input, "El mail no es valido");
    return;
  }

  if (isExistingEmail(input)) {
    showError(input, "El mail ya se encuentra registrado");
    return;
  }

  showSuccess(input);
  valid = true;
  return valid;
};


const checkPassword = (input) => {
  let valid = false;

  if (isEmpty(input)) {
    showError(input, "La contraseña es obligatoria");
    return;
  }

  if (!isPasswordSecure(input)) {
    showError(
      input,
      "La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un simbolo"
    );
    return;
  }
  showSuccess(input);
  valid = true;
  return valid;
};


const validateForm = (e) => {
  e.preventDefault();

  let isNameValid = checkNameInput(nameInput);
  let isEmailValid = checkEmail(emailInput);
  let isPasswordValid = checkPassword(passwordInput);

  let isValidForm = isNameValid && isEmailValid && isPasswordValid;

  if (isValidForm) {
    users.push({
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    });
    saveToLocalStorage(users);
    alert("Ya estas registrado!");
    window.location.href = "login.html";
  }
};

const init = () => {
  signUpForm.addEventListener("submit", validateForm);
  nameInput.addEventListener("input", () => checkNameInput(nameInput));
  emailInput.addEventListener("input", () => checkEmail(emailInput));
  passwordInput.addEventListener("input", () => checkPassword(passwordInput));
};

init();