const express = require ("express");
const router = express.Router();
const Tag = require('../server/schema/Tag');
const Post = require('../server/schema/Post');
const Account = require('../server/schema/Account');

router.get("/:tagname", async (req, res)=>{
    
    try {
        //gets the list of posts that contains tag
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

        //list of accounts
        const accountsList = await Account.find().lean();
        
        const postListLength = postList.length;

        res.render("tag-posts", {
            tag_name: getTagName,
            post_cnt: postListLength, 
            post:postList,
            upvotes:'0'
        })
    } catch (error){
        console.log(error);
    }
})


router.get("/", async  (req, res)=>{
    try{
        const tagList = await Tag.find().lean();
        
        tagList.forEach((tag) =>{
            try{
                //TODO: create a field that will accept the postList.length
                
                tag.postCnt = 0;
                
                const postList = Post.find({
                    tags: {$in: tag},
                });

                tag.postCnt = postList.length;

                // console.log(tag);
                // console.log(postList.length);
                console.log(tag.postCnt);
            }catch(error){
                console.log(error);
            }
        });



        res.render("tag", {
            header: "View tags",
            tag: tagList
        });
    }catch(error){
        console.log(error);
    }
    

});



module.exports = router;