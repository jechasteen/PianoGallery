// Script for route: /gallery/:id/addimg

window.onload = function () {
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
          var span = document.createElement('div');

          span.classList.add("col-sm-4");

          span.innerHTML = ['<figure class="text-center"><img class="img-thumbnail" src="', e.target.result,
            '" title="', escape(theFile.name), '"/><figcaption>',
            theFile.name, '</figcaption></figure>'].join('');

          document.getElementById('list').insertBefore(span, null);

          // --->>>  imageTable(evt.target.files);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
    }
  }

  document.getElementById('images').addEventListener('change', handleFileSelect, false);
}