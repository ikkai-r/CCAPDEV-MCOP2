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

// ----------------------------------------------------

/*
const posts = [
    {
        profile_pic: "img/sansfangirlxoxo.png",
        post_title: "undertale sans is so cool",
        username: "sansfangirlxoxo",
        post_content: "omg pls be my boyfriend like look at him, why is he so cool???? i can't exist without him...",
        post_date: "May 1, 2023",
        tags: ["#sans", "#undertale", "#brainrot", "#mybrainisdying"],
        upvotes: 0,
        downvotes: 23,
        comments_cont: 1
    }, 
    {
        profile_pic: "img/profile.png",
        post_title: "help my computer is dying",
        username: "helpvirus",
        post_content: "Help i think i madea  mistake, I downloaded this 'free cool toolbar' extension and uploade...",
        post_date: "May 25, 2023",
        tags: ["#virus", "#ohgosh", "#aaa"],
        upvotes: 0,
        downvotes: 3,
        comments_cont: 2
    },
    {
        profile_pic: "img/sherlockholmes.png",
        post_title: "A POST",
        username: "SherlockHolmes",
        post_content: "Posting a text.",
        post_date: "May 20, 2023",
        tags: ["#minds", "#consulting", "#detective"],
        upvotes: 100,
        downvotes: 12,
        comments_cont: 1
    },
    {
        profile_pic: "img/redqueen.png",
        post_title: "OFF WITH THEIR HEADS!!!",
        username: "RedQueen",
        post_content: "OFF WITH YOUR HEAAAAD!!! maaaaaad",
        post_date: "May 15, 2023",
        tags: ["#immad", "#gonemad", "#mad", "#maaaaaad"],
        upvotes: 3,
        downvotes: 45,
        comments_cont: 1
    },
    {
        profile_pic: "img/deeznuts.jpg",
        post_title: "Get Coconut'd",
        username: "DeezNuts",
        post_content: "Da Coconut Nut Song...",
        post_date: "May 10, 2023",
        tags: ["#coconut", "#morenuts", "#deeznuts"],
        upvotes: 3,
        downvotes: 0,
        comments_cont: 0
    }, 
    {
        profile_pic: "img/coolbeans.png",
        post_title: "RIP Telltale",
        username: "coolbeans",
        post_content: "Da Coconut Nut Song...",
        post_date: "May 5, 2023",
        tags: ["#mc", "#minecraft", "#miss", "#lukas", "#iloveyou"],
        upvotes: 42,
        downvotes: 4,
        comments_cont: 1
    }
];*/


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
