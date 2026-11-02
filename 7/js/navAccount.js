import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, firebaseIsConfigured } from "./firebaseInit.js";

const SIGNED_OUT_LABEL = "Log In / Sign Up";
const SIGNED_IN_LABEL = "Account";

// renames the last nav tab depending on whether somebody is signed in
function startAccountLink() {
  if (!firebaseIsConfigured) {
    return;
  }

  const accountLink = document.getElementById("accountLink");
  onAuthStateChanged(auth, (user) => {
    accountLink.textContent = user ? SIGNED_IN_LABEL : SIGNED_OUT_LABEL;
  });
}

startAccountLink();
