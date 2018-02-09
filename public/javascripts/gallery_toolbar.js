//
//  Handle Category Filtering
var categorySelection = [];

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
  $('#selections').val(arrToStr(categorySelection));
});

$('#cat-clear').on("click", function () {
  $('#selections').val("All");
});