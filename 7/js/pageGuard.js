import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, firebaseIsConfigured } from "./firebaseInit.js";

const lockedNotice = document.getElementById("lockedNotice");
const protectedContent = document.getElementById("protectedContent");

// keeps the page hidden until firebase confirms somebody is signed in
export function guardPage(onSignedIn = null) {
  if (!firebaseIsConfigured) {
    lockedNotice.hidden = false;
    lockedNotice.textContent = "Firebase is not set up yet. Add your keys to js/firebaseConfig.js.";
    return;
  }

  onAuthStateChanged(auth, (user) => {
    const isSignedIn = Boolean(user);
    lockedNotice.hidden = isSignedIn;
    protectedContent.hidden = !isSignedIn;
    if (isSignedIn && onSignedIn) {
      onSignedIn(user);
    }
  });
}
