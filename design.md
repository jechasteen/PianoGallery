# BHA Piano Gallery

## Gallery RESTful Routing

### INDEX
Path: /gallery

Verb: GET

Purpose: List all pianos, also allow sorting and refinement via query strings

Mongoose Method: Piano.find()

### NEW
Path: /gallery/new

Verb: GET

Purpose: Show new piano form, if logged in as admin

Mongoose Method: N/A

### CREATE
Path: /gallery

Verb: POST

Purpose: Create a new piano, then redirect to /gallery

Mongoose Method: Piano.create()

### SHOW
Path: /gallery/:id

Verb: GET

Purpose: Show detail page for ONE piano

Mongoose Method: Piano.findById()

### EDIT
Path: /gallery/:id/edit

Verb: GET

Purpose: Show edit form for selected piano if logged in as admin

Mongoose Method: Piano.findById()

### UPDATE
Path: /gallery/:id

Verb: PUT

Purpose: Update data for selected Piano, then redirect back to piano show page

Mongoose Method: Piano.findByIdAndUpdate()

### DESTROY
Path: /gallery/:id

Verb: DELETE

Purpose: Remove selected Piano from the DB

Mongoose Method: Piano.findByIdAndRemove()

## Blog RESTful Routing

### INDEX
Path: /blog

Verb: GET

Purpose: show all blog post sorted by recent

Mongoose Method: Post.find()

### NEW
Path: /blog/new

Verb: GET

Purpose: show new blog post form if logged in as admin

Mongoose Method: N/A
### CREATE
Path: /blog

Verb: POST

Purpose: Create a new post, then redirect to /blog

Mongoose Method: Post.create()
### SHOW
Path: /blog/:id

Verb: GET

Purpose: Show post detail page

Mongoose Method: Post.findById()
### EDIT
Path: /blog/:id/edit

Verb: GET

Purpose: Show edit post form if logged in as admin, then redirect to /blog

Mongoose Verb: Post.findById()
### UPDATE
Path: /blog/:id

Verb: PUT

Purpose: Update info for a single blog post

Mongoose Method: Post.findByIdAndUpdate()
### DESTROY
Path: /blog/:id

Verb: DELETE

Purpose: Remove a blog post from the DB, then redirect to /blog

Mongoose Method: Post.findByIdAndRemove()

## Folder Structure and Modularity

### Folder Structure
```
BHA_piano					-- Base folder
-> node_modules		-- Node modules, untracked by git
-> public					-- Serve files
	-> images
		-> piano
		-> etc
	-> javascripts
	-> stylesheets
-> routes					-- routes root folder contains root route
	-> blog.js			-- folder contains 2 sub-route files
	-> gallery.js
-> views
	-> partials
	-> blog
	-> gallery
```