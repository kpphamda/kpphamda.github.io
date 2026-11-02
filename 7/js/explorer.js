import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db } from "./firebaseInit.js";
import { guardPage } from "./pageGuard.js";
import { describeError, showError, showSpinner } from "./feedback.js";

const STEP_LABELS = {
  COUNTRY: "Step 1 of 2: pick a country.",
  CROP: "Step 2 of 2: pick a crop.",
  DETAIL: "Here is what that crop looks like in this country."
};

const explorerArea = document.getElementById("explorer");
const stepLabel = document.getElementById("stepLabel");

// step 1 - reads the countries out of firestore and shows one button for each
async function showCountryStep() {
  setStepLabel(STEP_LABELS.COUNTRY);
  showSpinner(explorerArea, "Loading countries...");
  try {
    const countries = await loadCountries();
    const buttons = countries.map((country) =>
      createChoiceButton(country.name, () => showCropStep(country))
    );
    replaceExplorer(buildChoiceList("Countries", buttons));
  } catch (error) {
    showError(explorerArea, describeError(error));
  }
}

// step 2 - reads only the crops that belong to the country picked in step 1
async function showCropStep(country) {
  setStepLabel(STEP_LABELS.CROP);
  showSpinner(explorerArea, `Loading crops grown in ${country.name}...`);
  try {
    const crops = await loadCrops(country.id);
    const buttons = crops.map((crop) =>
      createChoiceButton(crop.name, () => showCropDetail(country, crop))
    );
    buttons.push(createChoiceButton("Back to countries", showCountryStep));
    replaceExplorer(buildChoiceList(`Staple crops in ${country.name}`, buttons));
  } catch (error) {
    showError(explorerArea, describeError(error));
  }
}

// final view: shows the plant, the dish made from it, and the facts for the crop that was picked
function showCropDetail(country, crop) {
  setStepLabel(STEP_LABELS.DETAIL);

  const photos = document.createElement("div");
  photos.className = "photo-pair";
  photos.append(
    createPhotoFigure(crop.cropPhoto, crop.name),
    createPhotoFigure(crop.dishPhoto, `Made into ${crop.dish}`)
  );

  const facts = document.createElement("div");
  facts.className = "fact-card";
  facts.append(
    createFactParagraph("Where it is grown", crop.region),
    createFactParagraph("Production (2024)", crop.production),
    createFactParagraph("Popular dish", crop.dish)
  );

  const buttons = document.createElement("div");
  buttons.className = "choice-group";
  buttons.append(
    createChoiceButton(`Back to ${country.name}`, () => showCropStep(country)),
    createChoiceButton("Start over", showCountryStep)
  );

  const section = document.createElement("section");
  section.append(createHeading(`${crop.name} in ${country.name}`), photos, facts, buttons);
  replaceExplorer(section);
}

// asks firestore for the countries collection, sorted the way they should appear
async function loadCountries() {
  const countriesQuery = query(collection(db, "countries"), orderBy("order"));
  const snapshot = await getDocs(countriesQuery);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}

// asks firestore for the crops stored underneath one country
async function loadCrops(countryId) {
  const cropsQuery = query(collection(db, "countries", countryId, "crops"), orderBy("order"));
  const snapshot = await getDocs(cropsQuery);
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}

// wraps a heading and a group of choice buttons into one part
function buildChoiceList(headingText, buttons) {
  const section = document.createElement("section");
  const group = document.createElement("div");
  group.className = "choice-group";
  group.append(...buttons);
  section.append(createHeading(headingText), group);
  return section;
}

// creates one button the user can click for the next step
function createChoiceButton(label, handleClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button";
  button.textContent = label;
  button.addEventListener("click", handleClick);
  return button;
}

// creates one photo with a label over it and the photo credit under it
function createPhotoFigure(photo, labelText) {
  const figure = document.createElement("figure");

  const label = document.createElement("p");
  label.className = "photo-label";
  label.textContent = labelText;

  const image = document.createElement("img");
  image.src = photo.image;
  image.alt = photo.alt;
  image.loading = "lazy";

  // public domain photos have no license page to link to, so the name is plain text
  const license = photo.licenseUrl
    ? createLink(photo.licenseName, photo.licenseUrl)
    : photo.licenseName;

  const caption = document.createElement("figcaption");
  caption.append(
    `Photo: ${photo.photographer}, `,
    createLink("Wikimedia Commons", photo.sourceUrl),
    ", ",
    license
  );

  figure.append(label, image, caption);
  return figure;
}

// creates a paragraph like "Popular dish: Pho"
function createFactParagraph(label, value) {
  const paragraph = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;
  paragraph.append(strong, value);
  return paragraph;
}

// creates a heading for the current step
function createHeading(text) {
  const heading = document.createElement("h3");
  heading.textContent = text;
  return heading;
}

// creates a link that opens a outside page
function createLink(text, url) {
  const link = document.createElement("a");
  link.href = url;
  link.textContent = text;
  return link;
}

// puts the instructions for the current step above the choices
function setStepLabel(text) {
  stepLabel.textContent = text;
}

// replaces the explorer area and puts the new content in it
function replaceExplorer(content) {
  explorerArea.replaceChildren(content);
}

guardPage(showCountryStep);
