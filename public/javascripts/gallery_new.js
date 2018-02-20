// Script for route: /gallery/:id/addimg

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

window.onload = function () {

  //
  // Handles loading the thumbnail images of selected files
  function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function (theFile) {
        return function (e) {
          // Render thumbnail.
          var div = document.createElement('div');

          div.classList.add("col-sm-4");

          div.innerHTML = ['<figure class="text-center"><img class="img-thumbnail" src="', e.target.result,
            '" title="', escape(theFile.name), '"/> <figcaption>',
            '<input type="radio" id="main_image" name="main_image" value="', theFile.name,
            '"> ', theFile.name, '</figcaption></figure>'].join('');

          document.getElementById('list').insertBefore(div, null);

          // --->>>  imageTable(evt.target.files);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('images').addEventListener('change', handleFileSelect, false);
}