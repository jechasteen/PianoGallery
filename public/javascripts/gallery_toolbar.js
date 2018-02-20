//
//  Handle Category Filtering
var categorySelection = [];
var selectedCategories = [];

$(document).ready(function () {
  selectedCategories = $(".category:checked");

  for (var i = 0; i < selectedCategories.length; i++) {
    categorySelection.push(selectedCategories[i].defaultValue);
  }
});

function arrToStr(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    if (i === arr.length - 1) {
      result += arr[i];
    } else {
      result += arr[i] + ",";
    }
  }
  return result;
}

$('.category').on("change", function (e) {
  var value = e.target.value;
  var idx = $.inArray(value, categorySelection);
  if (idx != -1) {
    categorySelection.splice(idx, 1);
  } else {
    categorySelection.push(value);
  }
  if (categorySelection.length === 0) {
    $('#selections').val("All");
  }
  $('#selections').val(categorySelection.join(","));
});

$('#cat-clear').on("click", function () {
  $('#selections').val("All");
});