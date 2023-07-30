const express = require ("express");
const router = express.Router();
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const Postschema = require('../server/schema/Post');
const Vote = require("../server/schema/Vote");

router.get("/:tagname", async (req, res)=>{
    
    try {
        //gets the list of posts that contains tag
        const getTagName = req.params.tagname;

        const user1 = await Account.find({ "username" : "helpvirus" } );
        const subscribedTagsLogged = user1[0].subscribed_tags;

        const listofTagsLogged = await Tag.find({ _id: { $in: subscribedTagsLogged } }).lean();

        const getTag = await Tag.find({
            tag_name: getTagName
        }).lean();
        
        //list of posts under that tag
        const postList =  await Postschema.find({
            tags: {$in: getTag}
        }).populate({
            path: 'username'
        }).populate({
            path: 'tags',
            select: 'tag_name _id'
        }).lean();

        const postListLength = postList.length;

        //how many users are subscribed to a tag
        const accountList = Account.find({
            subscribed_tags: {$in: getTag}
        }).lean();

        let accountListLength = (await accountList).length;
        if (accountListLength == null){
            accountListLength = 0;
        }

        //get netvotecount for each post
        let postWithNetVote = [];

        //sums up how many posts are under every tag into an array
        for (i = 0; i < postListLength; i++){
            let currPostID = postList[i]._id;

            var isUpvoted = await Vote.findOne({post_comment: currPostID, username: '64b7e12123b197fa3cd7539b', up_downvote: 'up'});
            var isDownvoted = await Vote.findOne({post_comment: currPostID, username: '64b7e12123b197fa3cd7539b', up_downvote: 'down'});
            

            if (isUpvoted)
                isUpvoted = true;
            else
                isUpvoted = false;
            if(isDownvoted)
                isDownvoted = true;
            else
                isDownvoted = false;
            //getting votes
            const upvoteList = await Vote.find({ 
                post_comment: currPostID,
                up_downvote: 'up'
            });
            const downvoteList = await Vote.find({ 
                post_comment: currPostID,
                up_downvote: 'down'
            });
            console.log("up " + isUpvoted);
            console.log("down " + isDownvoted);
            //add curent info + new info
            const postData = ({
                _id: postList[i]._id,
                username: postList[i].username,
                post_title: postList[i].post_title,
                post_content: postList[i].post_content,
                post_edited: postList[i].post_edited,
                post_date: postList[i].post_date,
                post_date_modified: postList[i].post_date_modified,
                comments: postList[i].comments,
                tags: postList[i].tags,
                upvoted: isUpvoted,
                downvoted: isDownvoted,
                net_vote_count: upvoteList.length - downvoteList.length
            })
            postWithNetVote.push(postData);
        }

        res.render("tag-posts", {
            title: "Tag | "+getTagName,
            tag_name: getTagName,
            tag_id: getTag[0]._id,
            post_cnt: postListLength, 
            subscribers: accountListLength,
            post:postWithNetVote,
            sub_tags: listofTagsLogged,
            script: "js/tag.js",
            navbar: 'logged-navbar'
        })
    } catch (error){
        console.log(error);
    }
})


router.get("/", async  (req, res)=>{
    try{
        //sums up how many posts are under every tag into an array
        const tagCounts = await Postschema.aggregate([
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

        //making an object that contains tagname and count
        for (var i = 0; i < tagCounts.length; i++){
            var newTag = await Tag.findById(tagCounts[i]._id).lean();
            var tag = ({
                tag_name: newTag.tag_name,
                photo: newTag.photo,
                count: tagCounts[i].count
            });
            tagListWithCount.push(tag);
        }
        res.render("tag", {
            title: "View tags",
            header: "View tags",
            tag: tagListWithCount,
            script: "js/tag.js",
            navbar: 'logged-navbar'
        });
    }catch(error){
        console.log(error);
    }
    

});

router.post("/up/:post_id", async (req, res)=>{
    const getId = req.params.post_id;
  
    try{
        var isUpvoted = await Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'up'});
        var isDownvoted = await  Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'down'});
        if (!isUpvoted && !isDownvoted){
            const newUpvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'up'});
            await newUpvote.save();
            return res.json({message:"User upvoted successfully"});
        }
        else if (isUpvoted){
            await Vote.findByIdAndDelete(isUpvoted._id);
            return res.json({message:"User already upvoted, removing upvote"});
        }
        else if (isDownvoted){
            await Vote.findByIdAndDelete(isDownvoted._id);
            const editedUpvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'up'});
            await editedUpvote.save();
            return res.json({message:"User previously downvoted, removing downvote for upvote"});
        } 
    } catch(error){
        console.log(error);
    }
});

router.post("/down/:post_id", async (req, res)=>{
    const getId = req.params.post_id;
  
    try{
        var isUpvoted = await Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'up'});
        var isDownvoted = await  Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'down'});
        if (!isUpvoted && !isDownvoted){
            const newDownvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'down'});
            await newDownvote.save();
            return res.json({message:"User downvoted successfully"});
        }
        else if (isDownvoted){
            await Vote.findByIdAndDelete(isDownvoted._id);
            return res.json({message:"User already downvoted, removing downvote"});
        }
        else if(isUpvoted){
            await Vote.findOneAndDelete(isUpvoted._id);
            const editedDownvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'down'});
           await editedDownvote.save();
           return res.json({message: "User previously upvoted, removing upvote for downvote"});
        }
    } catch(error){
        console.log(error);
    }
});



module.exports = router;