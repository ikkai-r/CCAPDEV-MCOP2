const express = require ("express");
const router = express.Router();
const Tag = require('../server/schema/Tag');
const Post = require('../server/schema/Post');

router.get("/:tagname", async (req, res)=>{
    
    try {
        const getTagName = req.params.tagname;
        const getTag = await Tag.find({
            tag_name: getTagName
        }).lean();
        const postList = await Post.find({
            tags: {$in: getTag}
        }).populate({
            path: 'username'
        }).populate({
            path: 'tags',
            select: 'tag_name'
        }).lean();
        
        const postListLength = postList.length;

        res.render("tag-posts", {
            tag_name: getTagName,
            post_cnt: postListLength, 
            post:postList
        })
    } catch (error){
        console.log(error);
    }
})


router.get("/", async  (req, res)=>{
    try{
        const taglist = await Tag.find().lean();

        res.render("tag", {
            header: "View tags",
            tag: taglist
        });
    }catch(error){
        console.log(error);
    }
    

});



module.exports = router;