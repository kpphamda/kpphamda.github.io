const FIREBASE_ERROR_MESSAGES = {
  "auth/invalid-email": "That email address does not look right.",
  "auth/missing-password": "Please enter a password.",
  "auth/weak-password": "Passwords need to be at least 6 characters.",
  "auth/email-already-in-use": "That email already has an account. Try logging in instead.",
  "auth/invalid-credential": "That email and password do not match an account.",
  "auth/user-not-found": "No account uses that email address.",
  "auth/wrong-password": "That password is not correct.",
  "auth/too-many-requests": "Too many tries. Please wait a minute and try again.",
  "auth/network-request-failed": "No network connection. Check your internet and try again.",
  "auth/requires-recent-login": "For safety, log out and log back in before changing your password.",
  "permission-denied": "The database refused that request. Check the Firestore rules in the console.",
  "unavailable": "Cannot reach the database right now. Check your internet and try again."
};

// shows a spinner with a message while a firebase request is running
export function showSpinner(element, message) {
  element.className = "status status-working";
  element.replaceChildren(createSpinner(), document.createTextNode(message));
}

// shows a red message when something went wrong
export function showError(element, message) {
  element.className = "status status-error";
  element.textContent = message;
}

// shows a green message when something worked
export function showSuccess(element, message) {
  element.className = "status status-success";
  element.textContent = message;
}

// empties a status area so an old message does not stay on screen
export function clearStatus(element) {
  element.className = "status";
  element.replaceChildren();
}

// turns a firebase error into a sentence a person can actually act on
export function describeError(error) {
  if (FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }
  // this one arrives with the whole sentence stuck onto the code, so it needs a loose match
  if (String(error.code).startsWith("auth/api-key-not-valid")) {
    return "The Firebase keys in js/firebaseConfig.js are not valid for this project.";
  }
  return "Something went wrong. Please try again.";
}

// builds the spinning circle shown next to a working message
function createSpinner() {
  const spinner = document.createElement("span");
  spinner.className = "spinner";
  spinner.setAttribute("aria-hidden", "true");
  return spinner;
}
