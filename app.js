require('dotenv').config();

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const mongoose = require("mongoose");

const PORT = 3000 || process.env.PORT;
const connecttoDB = require('./server/config/db');


const userRouter = require('./routes/user');
const Account = require('./server/schema/Account');
app.use('/user', userRouter);
app.use('/user', express.static(__dirname + "/public"));

const tagRouter = require('./routes/tag');
const Tag = require('./server/schema/Tag');
app.use('/tag', tagRouter);
app.use('/tag', express.static(__dirname + "/public"));

const searchRouter = require('./routes/search');
app.use('/search', searchRouter);
app.use('/search', express.static(__dirname + "/public"));

const postRouter = require('./routes/post');
const Post = require('./server/schema/Post');
app.use('/post', postRouter);
app.use('/user', express.static(__dirname + "/public"));

connecttoDB();

app.use(express.static(__dirname + "/public"));
app.engine("hbs", exphbs.engine({extname:'hbs'}));
app.set("view engine", "hbs");
app.set("views", "./views");

app.listen(PORT, () => {
    console.log("Server listening. Port: " + PORT);
});

app.get('/', (req, res) =>{
    res.redirect('/home');
});



app.get('/home', async (req, res) => {
    const maxTextLength = 100;

    try {
        // not finished, still figuring out how to do this
        const listofposts = await Post.find().populate({
            path: 'username',
            select: 'username'
        }).populate({
            path:'tags',
            select: 'tag_name'
        }).lean();

        listofposts.forEach((post) => {
            
            if (post.post_title && post.post_title.length > maxTextLength) {
              post.post_title = post.post_title.substring(0, maxTextLength) + '...';
            }

            if (post.tags && post.tags.length > 3) {
                post.tags = post.tags.slice(0, 3);
              }
        });

        res.render("index", {
        header: "Hot Posts",
        script: 'js/index.js',
        posts: listofposts,
        });
        console.log(listofposts);
    } catch(error){
        console.log(error);
    }
});

app.all('*', (req, res) => {
    res.status(404);
    res.render("404")
});

function limitPreview (string, limit = 0){
    string = string.replace(/&lt;br&gt;/g, ' ');
    return (string.substring(0, 50)).concat("...");
}
