// read the data from the json file
async function getBoardingData() {
  const response = await fetch("js/boardingData.json");
  return await response.json();
}

// change the text and the background image
function updatePage(data) {
  document.title = data.title;
  document.getElementById("styleName").textContent = data.header;
  document.getElementById("heroTitle").textContent = data.hero.headline;
  document.getElementById("heroDesc").textContent = data.hero.description;
  document.getElementById("heroSection").style.setProperty("--hero-img", `url('${data.hero.image}')`);

  document.getElementById("sec1Title").textContent = data.sections.overview.title;
  document.getElementById("sec1Subtitle").textContent = data.sections.overview.subtitle;
  document.getElementById("sec2Title").textContent = data.sections.equipment.title;
  document.getElementById("sec2Subtitle").textContent = data.sections.equipment.subtitle;

  updateCards("sec1Grid", data.sections.overview.cards);
  updateCards("sec2Grid", data.sections.equipment.cards);
}

// change the h3 and p text inside each card
function updateCards(gridId, cards) {
  document.querySelectorAll(`#${gridId} .card`).forEach((card, i) => {
    card.querySelector("h3").textContent = cards[i].title;
    card.querySelector("p").textContent = cards[i].description;
  });
}

// run it when the change button is clicked
document.getElementById("changeThemeBtn").addEventListener("click", async () => {
  const data = await getBoardingData();
  updatePage(data);
});