var express = require('express');
var router = express.Router();
const userModel = require("./users.js");
const postModel = require("./posts.js")
const passport = require("passport");
const mongoose = require("mongoose");
const localStrategy = require("passport-local");
const { console } = require('inspector');
const upload = require("./multer.js");

passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.get('/feed', function(req, res, next) {
  res.render('feed', { title: 'Express' });
});

router.post('/upload',isLoggedIn, upload.single('file'),async function(req, res, next) {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    // Create a new post
    const newPost = await postModel.create({
      image: `/images/uploads/${req.file.filename}`,
      caption: req.body.caption,
      user: req.user._id // make sure user is logged in via passport
    });

    // Push the post to the user's posts array
    const user = await userModel.findOne({username: req.session.passport.user}); ;
    user.posts.push(newPost._id);
    await user.save();

    res.redirect(`/upload/${newPost._id}`); // success
  } catch (err) {
    console.error("Upload error:", err); // helpful log
    res.status(500).send("Something went wrong while uploading");
  }
});

router.get('/upload/:postid', isLoggedIn, async function (req, res) {
  try {
    const post = await postModel.findById(req.params.postid).populate('user');
    if (!post) return res.status(404).send("Post not found");
    res.render('singlepost', { post: post });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading post");
  }
});


router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
  
});

router.post('/delete-post/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    // Assuming you are using Mongoose:
    await postModel.findByIdAndDelete(postId);
    res.redirect('/profile'); // or wherever your post list is shown
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting post');
  }
});


router.get('/profile',isLoggedIn,async function(req, res, next) {
  const user = await userModel.findOne({username:req.session.passport.user}).populate('posts');
  // console.log(user);
  res.render('profile', { user });
})

router.post("/register", function(req,res){
  const {username, email, fullname,password}= req.body;
  const userData = new userModel({
    username,
    email,
    fullname,
    
  })

  
  userModel.register(userData, req.body.password, function(err, user){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile")
    })
  })
}) 

router.post("/login",passport.authenticate("local", {successRedirect:"/profile", failureRedirect:"/login",
  failureFlash: true}),function(req,res){
  res.redirect("/profile")

})

// router.post('/logout', function(req, res, next) {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.redirect('/login');
//   });
// });
// router.get('/logout', function(req, res, next) {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.redirect('/login');
//   });
// });
// POST logout
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);

    req.session.destroy(function(err) {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // adjust cookie name if different
      res.redirect('/login');
    });
  });
});

// GET logout
router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) return next(err);

    req.session.destroy(function(err) {
      if (err) return next(err);
      res.clearCookie('connect.sid'); // adjust cookie name if different
      res.redirect('/login');
    });
  });
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
