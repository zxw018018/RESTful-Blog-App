var express 	= require("express"),
	app 		= express(),
	methodOverride = require("method-override"),
	expressSanitizer = require("express-sanitizer"),
	bodyParser 	= require("body-parser"),
	mongoose 	= require("mongoose");

// app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());



// mongoose/model config
var blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	create: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Test Blog",
// 	image: "https://images.unsplash.com/photo-1498511897286-4f0782ab697d?auto=format&fit=crop&w=3310&q=80",
// 	body: "Hello this is a blog post"
// });


// restful routes
// index route
app.get("/", function(req, res){
	res.redirect("/blogs");
});

//new route
app.get("/blogs/new", function(req, res){
	res.render("new");
});

//create route
app.post("/blogs", function(req, res){
	// create blog
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else {
			//then, redirect to the index
			res.redirect("/blogs");
		}
	});
});

//show route
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("show", {blog: foundBlog});
		}
	})
});



app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log(err);
		} else {
			res.render("index", {blogs: blogs});
		}
	});
	
});
	
// edit route
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.render("edit", {blog: foundBlog});
		}
	})
});

// update route
app.put("/blogs/:id", function(req, res){
	req.body.blog.body = req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
});

// delete route
app.delete("/blogs/:id", function(req, res){
	// destory blog
	Blog.findByIdAndRemove(req.params.id, function(err){
		// redirect 
		if(err){
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs");
		}
	})
	
});

app.listen(3000, function(){
	console.log("Server is running");
});








