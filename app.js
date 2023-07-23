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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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

//for register
app.post('/', async (req, res) =>{
    try {
        const { username, email_reg, password_reg } = req.body;
    
        //Check if the user already exists 
        //will make frontend for this
        const existingUser = await Account.findOne({ email_reg });
        if (existingUser) {
          return res.status(400).send('User already exists');
        }
    
        // Create a new account document
        const newAccount = new Account({
          username: username,
          email: email_reg,
          password: password_reg
        });
    
        newAccount.save()
            .then(savedAccount => {
                console.log('New Account created:', savedAccount);
                return res.json({ message: 'Successfully registered! You will be redirected shortly.', username: username });
            })
            .catch(error => {
                console.error('Error creating Account:', error);
            });
                } catch (error) {
                    
                    console.error('Error registering user:', error);
                    return res.status(500).send('Error registering user.');
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
