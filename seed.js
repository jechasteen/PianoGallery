var faker = require("faker");
var Piano = require("./models/piano");
var mongoose = require("mongoose");
var fs = require("fs");

const imgDir = "C:\\Users\\jonat\\Documents\\Pianos\\";
const pubDir = "c:\\Users\\jonat\\source\\repos\\BHA_piano\\public\\images\\";

mongoose.connect(process.env.DBURL);

var brands = [
  "Yamaha", "Baldwin", "Wurlitzer", "Steinway & Sons",
  "Kawai", "Bechstein", "Bluthner", "Sauter",
  "Schimmel", "Grotrian"
];

var categories = [
  "Grand", "Upright",
  "Digital", "Player"
];

var discount = [
  0.95, 0.9, 0.85,
  0.75, 0.67, 0.5
];

var images = fs.readdirSync(imgDir);

function randint(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}



function moveImages(id, array) {
  var thisDir = pubDir + id + "\\";
  fs.mkdir(thisDir, function (err) {
    if (err) console.log("Error: " + err);
  });
  array.forEach(function (img) {
    var promise = new Promise(function (resolve, reject) {
      fs.copyFileSync(imgDir + img, thisDir + img, function (err) {
        if (err) reject("Error");
      });
      resolve("Moved" + img);
    });
    promise.then(function (message) {
      console.log(message);
    }).catch(function (message) {
      console.log(message);
    });
    /*
    fs.copyFile(imgDir + img, thisDir + img, function (err) {
      if (err) console.log("Error: " + err);
    });
    */
  });
}

var gen = {
  title: function () {
    var make = brands[randint(0, brands.length - 1)];
    var adj = faker.commerce.productAdjective();
    this.make = make;
    return [adj, make].join(' ');
  },
  make: "",
  model: function () {
    return faker.random.alphaNumeric();
  },
  year: function () {
    return String(randint(1970, 2018));
  },
  category: function () {
    return categories[randint(0, 3)];
  },
  desc: function () {
    return faker.lorem.sentences();
  },
  body: function () {
    return faker.lorem.paragraphs();
  },
  l_price: function () {
    var price = randint(800, 35000);
    this.a_price = price * discount[randint(0, 5)];
    return price;
  },
  a_price: "",   // created by gen.l_price
  images: function () {
    var num = randint(3, 6);
    var array = [];
    for (var i = 0; i < num; i++) {
      array.push(images[randint(0, images.length - 1)]);
    }
    this.main_image = array[randint(0, array.length - 1)];
    return array;
  },
  main_image: "",   // created by gen.images()
  date: function () {
    return randomDate(new Date(1970, 0, 1), new Date());
  }
}

function genPiano() {
  var newGen = gen;
  newPiano = new Piano({
    title: newGen.title(),
    make: newGen.make,
    model: newGen.model(),
    year: newGen.year(),
    category: newGen.category(),
    desc: newGen.desc(),
    body: newGen.body(),
    l_price: newGen.l_price(),
    a_price: newGen.a_price,
    yt_url: "youtube.com",
    images: newGen.images(),
    main_image: newGen.main_image,
    date: newGen.date() 
  });
  moveImages(newPiano._id, newPiano.images);
  Piano.create(newPiano, function (err, piano) {
    if (err) console.log("Error: " + err);
    else console.log("Piano Created: " + piano.title);
  });
}

var seed = function (num) {
  Piano.remove({}, function (err) {
    if (err) console.log("Error: " + err);
  });
  for (var i = 0; i < num; i++) {
    genPiano();
  }
}

module.exports = seed;