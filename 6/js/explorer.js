const DATA_URL = "js/cropData.json";

const STEP_LABELS = {
  COUNTRY: "Step 1 of 2: pick a country.",
  CROP: "Step 2 of 2: pick a crop.",
  DETAIL: "Here is what that crop looks like in this country."
};

// loads crop data when the page opens, and shows the first step
async function startCropExplorer() {
  showMessage("Loading crop data...");
  try {
    const cropData = await fetchCropData();
    showCountryStep(cropData);
  } catch (error) {
    showMessage("The crop data could not be loaded. Please refresh the page to try again.");
  }
}

// requests the json file,then returns it 
async function fetchCropData() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Could not load ${DATA_URL} (status ${response.status})`);
  }
  return response.json();
}

// step 1 -  shows a button for every country in the data
function showCountryStep(cropData) {
  setStepLabel(STEP_LABELS.COUNTRY);
  const buttons = cropData.countries.map((country) =>
    createChoiceButton(country.name, () => showCropStep(cropData, country))
  );
  replaceExplorer(buildChoiceList("Countries", buttons));
}

// step 2 - shows the crops that belong to the country picked in step 1
function showCropStep(cropData, country) {
  setStepLabel(STEP_LABELS.CROP);
  const buttons = country.crops.map((crop) =>
    createChoiceButton(crop.name, () => showCropDetail(cropData, country, crop))
  );
  buttons.push(createChoiceButton("Back to countries", () => showCountryStep(cropData)));
  replaceExplorer(buildChoiceList(`Staple crops in ${country.name}`, buttons));
}

// final view: shows details for the country and crop that was picked
function showCropDetail(cropData, country, crop) {
  setStepLabel(STEP_LABELS.DETAIL);
  const section = document.createElement("section");
  section.append(
    createHeading(`${crop.name} in ${country.name}`),
    createCropFigure(crop),
    createFactParagraph("Where it is grown", crop.region),
    createFactParagraph("Production (2024)", crop.production),
    createFactParagraph("Popular dish", crop.dish),
    createChoiceButton(`Back to ${country.name}`, () => showCropStep(cropData, country)),
    createChoiceButton("Start over", () => showCountryStep(cropData))
  );
  replaceExplorer(section);
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

// creates one button the user can click for th next step
function createChoiceButton(label, handleClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button";
  button.textContent = label;
  button.addEventListener("click", handleClick);
  return button;
}

// creates the crop image together with photo credit
function createCropFigure(crop) {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = crop.image;
  image.alt = crop.imageAlt;

  const caption = document.createElement("figcaption");
  caption.append(
    `Photo: ${crop.photographer}, `,
    createLink("Wikimedia Commons", crop.sourceUrl),
    ", ",
    createLink(crop.licenseName, crop.licenseUrl)
  );

  figure.append(image, caption);
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

// shows a plain message for when loading fails 
function showMessage(text) {
  setStepLabel("");
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  replaceExplorer(paragraph);
}

// puts the instructions for the current step above the choices
function setStepLabel(text) {
  document.getElementById("stepLabel").textContent = text;
}

// replaces  the explorer area and puts the new content in it
function replaceExplorer(content) {
  const explorer = document.getElementById("explorer");
  explorer.replaceChildren(content);
}

startCropExplorer();
