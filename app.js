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

const homeRouter = require('./routes/home');
app.use('/home', homeRouter);

const subscribeRouter = require('./routes/subscribe');
app.use('/subscribe', subscribeRouter);

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

app.all('*', (req, res) => {
    res.status(404);
    res.render("404")
});


