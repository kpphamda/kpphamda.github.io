import { doc, writeBatch } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth, db, firebaseIsConfigured } from "./firebaseInit.js";
import { describeError, showError, showSpinner, showSuccess } from "./feedback.js";

const DATA_URL = "js/cropData.json";

const uploadButton = document.getElementById("uploadButton");
const uploadStatus = document.getElementById("uploadStatus");

// only lets a signed in user run the upload, because the rules require it
function startSeedPage() {
  if (!firebaseIsConfigured) {
    showError(uploadStatus, "Firebase is not set up yet. Add your keys to js/firebaseConfig.js.");
    return;
  }

  uploadButton.addEventListener("click", uploadCropData);

  onAuthStateChanged(auth, (user) => {
    uploadButton.disabled = !user;
    if (!user) {
      showError(uploadStatus, "Log in on the Home page first, then come back to this page.");
    }
  });
}

// copies every country and crop out of the json file and into firestore
async function uploadCropData() {
  showSpinner(uploadStatus, "Uploading crop data to Firestore...");
  try {
    const cropData = await readCropData();
    const batch = writeBatch(db);
    let cropCount = 0;

    cropData.countries.forEach((country, countryIndex) => {
      const countryRef = doc(db, "countries", country.id);
      batch.set(countryRef, { name: country.name, order: countryIndex });

      country.crops.forEach((crop, cropIndex) => {
        const cropRef = doc(db, "countries", country.id, "crops", crop.id);
        batch.set(cropRef, { ...crop, order: cropIndex });
        cropCount += 1;
      });
    });

    await batch.commit();
    showSuccess(uploadStatus, `Done. Uploaded ${cropData.countries.length} countries and ${cropCount} crops.`);
  } catch (error) {
    showError(uploadStatus, describeError(error));
  }
}

// reads the json file that holds the data collected in the last stage
async function readCropData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL} (status ${response.status})`);
  }
  return response.json();
}

startSeedPage();
