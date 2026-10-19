// tells the user that accounts are not finished yet when the button is clicked
function showAccountNotice() {
  document.getElementById("accountNotice").hidden = false;
}

document.getElementById("accountButton").addEventListener("click", showAccountNotice);
