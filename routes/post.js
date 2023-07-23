const express = require ("express");
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.get('/', (req, res) =>{
    res.render("create-post", {
        header: "Create a new post",
        script: "js/post.js"
    });
});


router.post('/', async (req, res) => {
    try {
        const { action } = req.body;

        if (action === 'post-act') {
            const { post_title, post_content, post_attachment, tags } = req.body;

            
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
router.get('/:id', async (req, res) =>{
    const getName = req.params.id;
    try{
        const getPost = await Post.find({_id: getName});
        console.log(getPost);[
        ]
        // stuck here again
        res.render("view-post", {
            post_content: getPost.post_content,
            script: "js/view-post.js"
        });
    } catch(error){
        console.log(error);
    }
   
});

module.exports = router;