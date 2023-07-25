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
        const taglist = await Tag.find().lean();

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
        ]).sort({count: 'desc'});

        const tagListWithCount = [];

        for (var i = 0; i < tagCounts.length; i++){
            var newTag = await Tag.findById(tagCounts[i]._id).lean();
            var tag = ({
                tag_name: newTag.tag_name,
                count: tagCounts[i].count
            });
            tagListWithCount.push(tag);
        }

        res.render("tag", {
            header: "View tags",
            tag: tagListWithCount,
            script: "js/tag.js",
            navbar: 'logged-navbar'
        });
    }catch(error){
        console.log(error);
    }
    

});



module.exports = router;