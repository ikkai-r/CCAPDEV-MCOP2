const express = require ("express");
const Account = require('../server/schema/Account');
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Comment = require('../server/schema/Comment');
const router = express.Router();


router.get("/:name", async (req, res)=>{
    const getName = req.params.name;
    const maxTextLength = 50;

    try{
        const user = await Account.findOne({ "username" : { $regex : new RegExp(getName, "i") } });

        if (!user) {
            // Handle the case when the user is not found
            return res.status(404).send("User not found.");
        }

        const listofposts = await Post.find().where("username").equals(user._id).populate({
            path:'username',
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

        const listofcomments = await Comment.find().where("username").equals(user._id).populate({
            path: 'post_commented',
            select: 'post_id tags post_title',
            populate: {
              path: 'tags',
              select: 'tag_name',
            },
          }).populate({
            path:'username',
            select: 'username'
        }).lean();


          listofcomments.forEach((comment) => {

            if (comment.post_title && comment.comment_content.length > maxTextLength) {
              comment.comment_content = comment.comment_content.substring(0, maxTextLength) + '...';
            }
            
            if (comment.post_commented && comment.post_commented.tags && comment.post_commented.tags.length > 3) {
              comment.post_commented.tags = comment.post_commented.tags.slice(0, 3);
            }
          });

          const subscribedTags = user.subscribed_tags;
          const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();

        res.render("user", {
            "username": user.username,
            "profile_desc": user.profile_desc,
            "profile_pic": user.profile_pic,
            user_posts: listofposts,
            user_comments: listofcomments,
            sub_tags: listofTags,
            script: "js/profile.js",
            add_script: "js/index.js"
        });
        
    } catch(error){
        console.log(error);
    }
})

router.get("/", (req, res)=>{
    res.redirect('/');
});

module.exports = router;