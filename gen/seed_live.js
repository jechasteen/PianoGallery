var faker = require("faker");
var Piano = require("../models/piano");
var mongoose = require("mongoose");
var shell = require("shelljs");

mongoose.connect(process.env.DBURL);

//
// Constants
const dirs = {
  Grand: "/home/ubuntu/workspace/gen/images/Grand/",
  Upright: "/home/ubuntu/workspace/gen/images/Upright/",
  Digital: "/home/ubuntu/workspace/gen/images/Digital/",
  publicDir: "/home/ubuntu/workspace/public/images/"
};

const categories = ["Grand", "Upright", "Digital"];

const brands = {
  Grand: [
    "Baldwin", "Brodmann", "Hailun", "Hallet Davis", "Kawai",
    "Knabe", "Kranich & Bach", "Steinway & Sons", "Weber",
    "Wurlitzer", "Yamaha", "Young Chang"
  ],
  Upright: [
    "Acrosonic", "Brodmann", "Baldwin", "Charles R. Walter",
    "Essex", "Hamilton", "Hobart Cable", "Kimball", "Yamaha",
    "Steinway & Sons"
  ],
  Digital: [
    "Casio", "Kurzweil", "Yamaha"
  ]
};

const sizes = {
  Grand: [    // Length
    60, 61, 62, 63, 64, 65, 67, 68, 69, 73, 74, 83
  ],
  Upright: [  // Height
    40, 42, 43, 44, 45, 46, 48
  ],
  Digital: [  // Number of keys...
    25, 49, 61, 76
  ]
};

const discount = [
  0.95, 0.9, 0.85,
  0.75, 0.67, 0.5
];

//
// Get Array of all image filenames in path
var images = {
    Grand: shell.ls("-A", dirs.Grand),
    Upright: shell.ls("-A", dirs.Upright),
    Digital: shell.ls("-A", dirs.Digital)
};

//
// Helper Functions
function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function flipCoin() {
  var r = randint(1, 1000);
  if (r % 2 === 0) {
    return false;
  } else {
    return true;
  }
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function moveImages(id, array, cat) {
  var thisDir = dirs.publicDir + id + "/";

  shell.mkdir("-p", thisDir);

  array.forEach(function (img) {
    shell.cp(dirs[cat] + img, thisDir + img);
  });
}

//
// Object that contains all of the generation functions
var gen = {
  title: function (cat) {
    var catBrands = brands[cat];
    var make = catBrands[randint(0, catBrands.length)];
    var adj = faker.company.catchPhraseAdjective();
    this.make = make;
    return [adj, make].join(' ');
  },
  subtitle: function () {
    return faker.lorem.words();
  },
  size: function (cat) {  // cat => category
    if (categories.includes(cat)) {
      var catSizes = sizes[cat];
      return catSizes[randint(0, catSizes.length)];
    } else {
      return undefined;
    }
  },
  make: "",   // Gen'd by gen.title
  model: function () {
    return faker.random.alphaNumeric(randint(3, 8));
  },
  year: function () {
    return String(randint(1970, 2018));
  },
  category: function () {
    return categories[randint(0, categories.length)];
  },
  desc: function () {
    return faker.lorem.sentences();
  },
  body: function () {
    return faker.lorem.paragraphs();
  },
  l_price: function () {
    var price = randint(800, 35000);
    if (flipCoin()) {
      this.a_price = Math.floor(price * discount[randint(0, 5)]);
    } else {
      this.a_price = undefined;
    }
    return price;
  },
  a_price: undefined,   // created by gen.l_price
  images: function (cat) {
    var num = randint(3, 6);
    var catImgs = images[cat];
    var array = [];
    for (var i = 0; i < num; i++) {
      var img = catImgs[randint(0, catImgs.length)];
      if (array.includes(img)) {
        continue;
      } else {
        array.push(img);
      }
    }
    this.main_image = array[randint(0, array.length)];
    return array;
  },
  main_image: "",   // created by gen.images()
  date: function () {
    return randomDate(new Date(1970, 0, 1), new Date());
  }
};

//
// Goes through all of the attributes and uses gen.* to create them
function genPiano() {
  var newGen = gen;
  var newPiano = new Piano({
    // make: newGen.make,
    model: newGen.model(),
    year: newGen.year(),
    category: newGen.category(),
    desc: newGen.desc(),
    body: newGen.body(),
    l_price: newGen.l_price(),
    // a_price: Math.floor(newGen.a_price),
    yt_url: "youtube.com",
    // main_image: newGen.main_image,
    date: newGen.date() 
  });
  newPiano.title = newGen.title(newPiano.category);
  newPiano.make = newGen.make;
  newPiano.size = newGen.size(newPiano.category);
  newPiano.images = newGen.images(newPiano.category);
  newPiano.main_image = newGen.main_image;
  newPiano.a_price = newGen.a_price;
  moveImages(newPiano._id, newPiano.images, newPiano.category);
  Piano.create(newPiano, function (err, piano) {
    if (err) console.log("Error (genPiano::Piano.create): " + err);
    else console.log("Piano Created: " + piano.title);
  });
}

//
// Exported Function
var seed = function (num) {
  Piano.remove({}, function (err) {
    if (err) console.log("Error (seed::Piano.remove): " + err);
  });
  for (var i = 0; i < num; i++) {
    genPiano();
    console.log("Piano Created...");
  }
};

module.exports = seed;