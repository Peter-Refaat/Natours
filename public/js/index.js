/* eslint-disable */
import { login, logout } from "./login.js";
import { signup } from "./signup.js";
import { displayMap } from "./leaflet.js";
import { updatePassword, updateUserData } from "./updateSettings.js";
import { bookTour } from "./payment.js";

// DOM ELEMENTS
const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const themeToggle = document.querySelector(".theme-toggle");
const bookBtn = document.querySelector(".btn--book-tour");

const applyTheme = (isDark) => {
  document.body.classList.toggle("dark-mode", isDark);
  document.documentElement.classList.toggle("dark-mode", isDark);
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", isDark);
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
    themeToggle.querySelector(".theme-toggle__label").textContent = isDark
      ? "Light mode"
      : "Dark mode";
  }
};

applyTheme(localStorage.getItem("natours-theme") === "dark");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    applyTheme(isDark);
    localStorage.setItem("natours-theme", isDark ? "dark" : "light");
  });
}

// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;
    signup(name, email, password, passwordConfirm);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await updateUserData(new FormData(userDataForm));
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    await updatePassword({ passwordCurrent, password, passwordConfirm });
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

if (bookBtn) {
  const resetBookTourButton = () => {
    bookBtn.textContent = "Book tour now!";
    bookBtn.disabled = false;
  };
  window.addEventListener("pageshow", resetBookTourButton);
  bookBtn.addEventListener("click", () => {
    const tourID = bookBtn.dataset.tourId;
    bookBtn.textContent = "Preparing checkout...";
    bookBtn.disabled = true;
    bookTour(tourID);
  });
}
