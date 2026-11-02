import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db } from "./firebaseInit.js";
import { guardPage } from "./pageGuard.js";
import { describeError, showError, showSpinner, showSuccess } from "./feedback.js";

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

// saves one suggestion in firestore and tells the user it arrived
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.target;
  showSpinner(contactStatus, "Sending your suggestion...");
  try {
    const saved = await addDoc(collection(db, "messages"), {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      submittedBy: auth.currentUser.uid,
      submittedAt: serverTimestamp()
    });
    form.reset();
    showSuccess(contactStatus, `Thank you. Your suggestion was saved as ${saved.id}.`);
  } catch (error) {
    showError(contactStatus, describeError(error));
  }
}

// the listener is attached once, and the guard decides whether the form is reachable at all
contactForm.addEventListener("submit", handleContactSubmit);
guardPage();
