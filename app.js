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
app.use('/post', express.static(__dirname + "/public"));

const accountAuthRouter = require('./routes/account-auth');
app.use('/', accountAuthRouter);

connecttoDB();

app.use(express.static(__dirname + "/public"));
app.engine("hbs", exphbs.engine({
    extname:'hbs',
    helpers: {
        each_upto: (n, block) => 
        {
            var x = '';
            for(var i = 0; i < n; i++)
                x+= block.fn(i)
            return x;
        }
    }
    }
));
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
        }).populate({
            path:'tags',
            select: 'tag_name'
        }).sort({date: 'desc'}).lean();

        listofposts.forEach((post) => {

            if (post.post_title && post.post_title.length > maxTextLength) {
              post.post_title = post.post_title.substring(0, maxTextLength) + '...';
            }

            if (post.tags && post.tags.length > 3) {
                post.tags = post.tags.slice(0, 3);
              }
        });

        const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

        const tagCounts = await Post.aggregate([
            {
              $unwind: '$tags' 
            },
            {
              $group: {
                _id: '$tags', 
                count: { $sum: 1 } 
              }
            }
          ]).sort({count: 'desc'}).limit(6);

          
          const getPopularTags = [];

        for (var i = 0; i < tagCounts.length; i++){
            var newTag = await Tag.findById(tagCounts[i]._id).lean();
            console.log(tagCounts[i].count);
            var tag = ({
                tag_name: newTag.tag_name,
                count: tagCounts[i].count
            });
           getPopularTags.push(tag);

        }
            console.log(getPopularTags);



        res.render("index", {
        header: "Hot Posts",
        script: 'js/index.js',
        posts: listofposts,
        posts_latest: latest_posts,
        tags: getPopularTags
        });
    } catch(error){
        console.log(error);
    }
});

app.all('*', (req, res) => {
    res.status(404);
    res.render("404")
});

