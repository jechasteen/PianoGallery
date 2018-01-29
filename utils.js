var utils = {
  getFileExt: function (filename) {
    var ext = ''
    for (var i = 0; i < filename.length; i++) {
      if (filename[i] === '.') {
        for (var j = i + 1; j < filename.length; j++) {
          ext += filename[j];
        }
      }
    }
    return ext;
  },

  spaceToUnderscore: function (string) {
    var result = '';
    for (var i = 0; i < string.length; i++) {
      if (string[i] === ' ') {
        result += '_';
      } else {
        result += string[i];
      }
    }
    return result;
  }
}

module.exports = utils;