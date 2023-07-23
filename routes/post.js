const express = require ("express");
const Post = require('../server/schema/Post');
const router = express.Router();

router.get('/', (req, res) =>{
    res.render("create-post", {
        header: "Create a new post",
        script: "js/post.js"
    });
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
            script: "js/post.js"
        });
    } catch(error){
        console.log(error);
    }
   
});

module.exports = router;