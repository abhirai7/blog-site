const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");



mongoose.connect("mongodb://localhost:27017/blogDB");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const postSchema = new mongoose.Schema({
  titleData : {
    type : String,
    required : true
  },
  postData : {
    type : String,
    required : true
  }
})

const posts = mongoose.model("post",postSchema); 

app.get("/",function(req,res){
  async function displayUnits(){
    const postAll = await posts.find();
    res.render("home",{content:homeStartingContent,posts_:postAll})
  }
  displayUnits();

})


app.get("/contact",function(req,res){
  res.render("contact",{contactData : contactContent})
})

app.get("/about",function(req,res){
  res.render("about",{aboutData : aboutContent})
})

app.get("/compose",function(req,res){
  let npost = {
    titleData : "",
    postData : ""
  }
  res.render("compose",{post :npost})
})

function trim11 (str) {
  str = str.replace(/^\s+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
      if (/\S/.test(str.charAt(i))) {
          str = str.substring(0, i + 1);
          break;
      }
  }
  return str;
}

app.post("/compose",function(req,res){
  let blogTitle = trim11(req.body.title);

  let blogData = trim11(req.body.post);
  let blogId = req.body.postId;
  if(blogId != ''){
    async function updatedBlog(){
      await posts.findByIdAndUpdate(blogId,{
        titleData : blogTitle,
        postData : blogData
      })
    }
    updatedBlog();
  }
  else{
    const composeData  = new posts({
      titleData : blogTitle,
      postData : blogData
    });
    composeData.save();
  }
  res.redirect("/");
})

// Update post
app.post("/delete",function(req,res){
  async function deleteBlog(){
    let postId = req.body.blgDel;
    await posts.findByIdAndDelete(postId);
    res.redirect("/");
  }
  deleteBlog();
})

app.post("/update",function(req,res){
  let postId = req.body.update;
  const fpost = posts.findById(postId);
  fpost.then(element => {
    res.render("compose",{post : element});
  })
})
app.get("/posts/:title",function(req,res){
    async function displayUnits(){
      let element = await posts.find({titleData : req.params.title});
      if(lodash.lowerCase(element[0].titleData) == lodash.lowerCase(req.params.title)){
        res.render("post",{post : element[0]})
      }
      else{
        res.redirect("/");
      }
    }
    displayUnits();
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
