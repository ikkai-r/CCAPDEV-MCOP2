const express = require ("express");
const router = express.Router();
const Account = require('../server/schema/Account');
const Tag = require('../server/schema/Tag');
const Post = require('../server/schema/Post');

router.get("/:tagname", async (req, res)=>{
    
    try {
        const getTagName = req.params.tagname;

        const user1 = await Account.find({ "username" : "helpvirus" } );
        const subscribedTagsLogged = user1[0].subscribed_tags;

        const listofTagsLogged = await Tag.find({ _id: { $in: subscribedTagsLogged } }).lean();

        const getTag = await Tag.find({
            tag_name: getTagName
        }).lean();
        const postList = await Post.find({
            tags: {$in: getTag}
        }).populate({
            path: 'username'
        }).populate({
            path: 'tags',
            select: 'tag_name _id'
        }).lean();
        
        const postListLength = postList.length;

        res.render("tag-posts", {
            tag_name: getTagName,
            tag_id: getTag[0]._id,
            post_cnt: postListLength, 
            post:postList,
            sub_tags: listofTagsLogged,
            script: "js/tag.js"
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
            tag: taglist,
            script: "js/tag.js"
        });
    }catch(error){
        console.log(error);
    }
    

});



module.exports = router;