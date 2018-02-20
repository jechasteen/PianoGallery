# BHA Piano Center
*Piano Gallery and Blog*

### Design
Both the Gallery and the Blog use complete RESTful routing.

#### The Piano Gallery
In the case of the Piano Gallery, I decided to add a few additional routes.
Namely, the imgadd and imgchg routes.
My thought process is that it may prove useful to separate the creation of a piano from the addition of images.
Besides, it turned out to be super difficult and a little beyond the scope of my current abilities.
So, rather than let this little annoyance halt development, I settled on the routing as it stands now.

#### The Blog
The blog is an absolutely dead simple RESTful blog, primarily intended for use as promotional copy.
In other words, the blog posts should be referenced on the index page, not accessed from the /blog route.

#### The Stack
This server has the following dependencies:
```javascript
"dependencies": {
  "body-parser": "^1.15.0",
  "bootstrap": "^4.0.0",
  "cookie-parser": "^1.4.0",
  "debug": "^2.2.0",        // Visual Studio, I assume
  "ejs": "^2.5.7",
  "express": "^4.14.0",
  "express-session": "^1.15.6",
  "faker": "^4.1.0",              // Used to seed the DB with BS
  "formidable": "^1.1.1",
  "fs": "0.0.1-security",
  "jquery": "^3.3.1",
  "method-override": "^2.3.10",
  "moment": "^2.20.1",
  "mongoose": "^4.13.10",
  "morgan": "^1.7.0",
  "passport": "^0.4.0",
  "passport-local": "^1.0.0",
  "passport-local-mongoose": "^4.4.0",
  "popper.js": "^1.12.9",
  "prompt": "^1.0.0",
  "request": "^2.83.0",
  "serve-favicon": "^2.3.0",
  "terminal-menu": "^2.1.1"   // Used in a proposed CL admin setup
}
```

I suppose you might call this a MEN stack. 

### Live Demo
The live demo is hosted at Heroku: http://bha.skidstack.com

Give the Admin route a try too! navigate to /admin and login using:
```
username: demo
password: password
```
And don't worry about messing with stuff, it's created randomly!

###### The BHA Brand is copyright BHA Piano Center, LLC. Dayton, OH


