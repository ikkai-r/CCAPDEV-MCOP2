const express = require ("express");
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const router = express.Router();

const multer  = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/', (req, res) =>{
    res.render("create-post", {
        header: "Create a new post",
        script: "js/post.js",
        post_username: "helpvirus",
        post_date: new Date(),
        button_type: "create-post-btn"
    });
});


router.post('/', upload.single('post_attachment'), async (req, res) => {
    try {
        const { action } = req.body;
        var post_attachment = "";

        if(req.file) {
            post_attachment = "img/"+req.file.originalname;
        }

        if (action === 'post-act') {
            const { post_title, post_content, tags } = req.body;

            
            const date = new Date();
            const monthNames = [
                "January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"
              ];
            
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
        
            // Format the date
            let formattedDate = monthNames[month] + " " + day + ", " + year;
            
            const post_date = formattedDate;

            const tagNames = tags.split(',').map(tag => tag.trim());
            const tagIds = [];

            for (const tagName of tagNames) {
                let tag = await Tag.findOne({ tag_name: tagName });

                if (!tag) {
                    // Create a new tag if it doesn't exist
                    tag = new Tag({ tag_name: tagName });
                    await tag.save();
                }

                tagIds.push(tag._id);
            }

            console.log(tagIds);

            // Create a new post document
            const newPost = new Post({
                username: '64b7e12123b197fa3cd7539b',
                post_title: post_title,
                post_content: post_content,
                post_date: post_date,
                post_attachment: post_attachment,
                tags: tagIds
            });

            // Save the new post to the database
            const savedPost = await newPost.save();
            console.log('New Post created:', savedPost);
            return res.json({ message: 'Successfully posted! You will be redirected shortly.', id: savedPost._id });
        }

    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).send('Error creating post.');
    }
});


// add viewing of page for a specific post
router.get('/edit-:id', async (req, res) =>{
    const getId = req.params.id;

    console.log(getId);

    // const getPost = await Post.findOne({_id: getId}).populate({
    //     path: "username"
    // }).populate({
    //     path: 'tags'
    // }).lean();

    const getPost = await Post.findOne({_id: getId});
    const getUser = await Account.findOne({_id: getPost.username});

    console.log(getPost);
    console.log(getUser);
    try{
        res.render("create-post", {
            header: "Edit post",
            script: "js/post.js",
            post_title: getPost.post_title,
            post_content:  getPost.post_content,
            post_date:  getPost.post_date,
            post_username: getUser.username,
            post_attachment: getPost.post_attachment,
            button_type: "edit-post-btn"
        });
    } catch(error){
        console.log(error);
    }
   
}).post('/edit-:id', async (req, res) =>{



});




// add viewing of page for a specific post
router.get('/:id', async (req, res) =>{
    const getName = req.params.id;
    try{
        const getPost = await Post.findOne({_id: getName}).populate({
            path: "username"
        }).populate({
            path: 'tags'
        }).lean();
        console.log(getPost);
        // stuck here again
        res.render("view-post", {
            post_title: getPost.post_title,
            post_content: getPost.post_content,
            username: getPost.username,
            post_date: getPost.post_date,
            tags_post: getPost.tags,
            script: "js/view-post.js"
        });
    } catch(error){
        console.log(error);
    }
   
});

module.exports = router;