// This file is intended to be run in the client


// Global Variables
var Pianos = {};


// Get the info from the Gallery main page

function extractPrice(str) {
  var l_price, a_price;
  if (str.includes("Call")) {
    l_price = "Call for Price"
  }
}

function getCols() {
  var cols = document.querySelectorAll(".vc_col-sm-3");

  columnData = {}

  cols.forEach(function (col) {
    columnData.name = col.children[3].outerText;
    columnData.link = col.children[5].children[0].href
  }); 
}