const loginForm = document.querySelector("form")
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// Traer users del localStorge
const users = JSON.parse(localStorage.getItem("users")) || [];

//Guarda el usuario activo en sessionStorage
const saveToSessionStorage = (user) => {
  sessionStorage.setItem("activeUser", JSON.stringify(user));
};

// Valida input vacio
const isEmpty = (input) => {
  return !input.value.trim().length;
};

// Valida si el mail ya existe
const isExistingEmail = (input) => {
  return users.some((user) => user.email === input.value.trim());
};

// Valida si el mail coincide con la contrasena
const isMatchingPassword = (input) => {
  const user = users.find((user) => user.email === emailInput.value.trim());
  return user.password === input.value.trim();
};

//Mostrar error
const showError = (message) => {
    errorMessage.textContent = message;
};


const isValidAccount = () => {
  let valid = false;

  if (isEmpty(emailInput)) {
    showError("Por favor, complete los campos.");
    return;
  }
  if (!isExistingEmail(emailInput)) {
    showError("El email ingresado es no es valido.");
    return;
  }
  if (isEmpty(passwordInput)) {
    showError("Por favor, complete los campos.");
    return;
  }
  if (!isMatchingPassword(passwordInput)) {
    showError("Los datos ingresados son incorrectos.");
    loginForm.reset();
    return;
  }
  valid = true;
  errorMessage.textContent = "";
  //   loginForm.reset();
  return valid;
};

// Función para loguear al usuario

const login = (e) => {
  e.preventDefault();
  if (isValidAccount()) {
    const user = users.find((user) => user.email === emailInput.value.trim());
    saveToSessionStorage(user);
    window.location.href = "index.html";
  }
};

const init = () => {
  loginForm.addEventListener("submit", login);
};

init();