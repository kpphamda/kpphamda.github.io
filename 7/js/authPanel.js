import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, firebaseIsConfigured } from "./firebaseInit.js";
import { clearStatus, describeError, showError, showSpinner, showSuccess } from "./feedback.js";

const signedOutPanel = document.getElementById("signedOutPanel");
const signedInPanel = document.getElementById("signedInPanel");
const accountStatus = document.getElementById("accountStatus");
const signedInEmail = document.getElementById("signedInEmail");

// hooks up every account form once the page knows whether firebase is set up
function startAccountPanel() {
  if (!firebaseIsConfigured) {
    showError(accountStatus, "Firebase is not set up yet. Add your keys to js/firebaseConfig.js.");
    signedOutPanel.hidden = true;
    return;
  }

  document.getElementById("signUpForm").addEventListener("submit", handleSignUp);
  document.getElementById("logInForm").addEventListener("submit", handleLogIn);
  document.getElementById("changePasswordForm").addEventListener("submit", handleChangePassword);
  document.getElementById("logOutButton").addEventListener("click", handleLogOut);

  onAuthStateChanged(auth, showWhoIsSignedIn);
}

// creates a brand new account from the sign up form
async function handleSignUp(event) {
  event.preventDefault();
  const form = event.target;
  showSpinner(accountStatus, "Creating your account...");
  try {
    await createUserWithEmailAndPassword(auth, form.email.value, form.password.value);
    form.reset();
    showSuccess(accountStatus, "Account created. You are now signed in.");
  } catch (error) {
    showError(accountStatus, describeError(error));
  }
}

// signs in an account that already exists
async function handleLogIn(event) {
  event.preventDefault();
  const form = event.target;
  showSpinner(accountStatus, "Signing you in...");
  try {
    await signInWithEmailAndPassword(auth, form.email.value, form.password.value);
    form.reset();
    showSuccess(accountStatus, "You are signed in.");
  } catch (error) {
    showError(accountStatus, describeError(error));
  }
}

// changes the password of the account that is signed in right now
async function handleChangePassword(event) {
  event.preventDefault();
  const form = event.target;
  showSpinner(accountStatus, "Updating your password...");
  try {
    await updatePassword(auth.currentUser, form.newPassword.value);
    form.reset();
    showSuccess(accountStatus, "Your password has been changed.");
  } catch (error) {
    showError(accountStatus, describeError(error));
  }
}

// signs the user out and sends them back to the signed out forms
async function handleLogOut() {
  showSpinner(accountStatus, "Signing you out...");
  try {
    await signOut(auth);
    showSuccess(accountStatus, "You are signed out.");
  } catch (error) {
    showError(accountStatus, describeError(error));
  }
}

// swaps which panel is visible whenever the sign in state changes
function showWhoIsSignedIn(user) {
  const isSignedIn = Boolean(user);
  signedOutPanel.hidden = isSignedIn;
  signedInPanel.hidden = !isSignedIn;
  if (isSignedIn) {
    signedInEmail.textContent = user.email;
  } else if (accountStatus.className === "status") {
    clearStatus(accountStatus);
  }
}

startAccountPanel();
