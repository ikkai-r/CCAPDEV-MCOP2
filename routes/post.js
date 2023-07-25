const express = require ("express");
const handlebars = require('handlebars');
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const Comment = require('../server/schema/Comment');
const Vote = require('../server/schema/Vote');
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
const { getRounds } = require("bcryptjs");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 === v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});


router.get('/', async (req, res) =>{

     // start for side-container content

     const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

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
       ]).sort({count: 'desc'}).limit(6);

       
       const user = await Account.find({ "username" : "helpvirus" });

       const subscribedTags = user[0].subscribed_tags;
       const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();

       
       const getPopularTags = [];

     for (var i = 0; i < tagCounts.length; i++){
         var newTag = await Tag.findById(tagCounts[i]._id).lean();
         var tag = ({
             tag_name: newTag.tag_name,
             tag_id: newTag._id,
             count: tagCounts[i].count
         });
        getPopularTags.push(tag);

     }

    res.render("create-post", {
        header: "Create a new post",
        title: "Create a new post",
        script: "js/post.js",
        post_username: "helpvirus",
        post_date: new Date(),
        posts_latest: latest_posts,
        popular_tags: getPopularTags,
        sub_tags: listofTags,
        button_type: "create-post-btn",
        navbar: 'logged-navbar'
    });
});


// add viewing of page for a specific post
router.get('/edit-:id', async (req, res) =>{
    const getId = req.params.id;

    const getPost = await Post.findOne({_id: getId});
    const getUser = await Account.findOne({_id: getPost.username});
    const getTags = await Tag.find({ _id: { $in: getPost.tags } }).lean();
    let post_attachment = "";

    if(getPost.post_attachment) {
        post_attachment = getPost.post_attachment.replace("img/", "");
    }

    // start for side-container content

    const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

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
      ]).sort({count: 'desc'}).limit(6);

      const user = await Account.find({ "username" : "helpvirus" });

      const subscribedTags = user[0].subscribed_tags;
      const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();

      const getPopularTags = [];

    for (var i = 0; i < tagCounts.length; i++){
        var newTag = await Tag.findById(tagCounts[i]._id).lean();
        var tag = ({
            tag_name: newTag.tag_name,
            tag_id: newTag._id,
            count: tagCounts[i].count
        });
       getPopularTags.push(tag);

    }
 
    try{
        res.render("create-post", {
            title: "Edit post",
            header: "Edit post",
            script: "js/post.js",
            post_title: getPost.post_title,
            post_content:  getPost.post_content,
            post_date:  getPost.post_date,
            post_username: getUser.username,
            post_attachment: post_attachment,
            tags: getTags,
            posts_latest: latest_posts,
            sub_tags: listofTags,
            popular_tags: getPopularTags,
            id: getId,
            button_type: "edit-post-btn",
            navbar: 'logged-navbar'
        });
    } catch(error){
        console.log(error);
    }
   
});

//delete comment
router.delete('/:id', async (req, res) =>{
    const postId = req.params.id;
    try {

        const result = await Comment.findByIdAndDelete(postId);

        if (result) {
          res.status(200).json({ message: 'Successfully deleted.' });
        } else {
          res.status(404).json({ message: 'Document not found.' });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
});


//delete post
router.delete('/edit-:id', async (req, res) =>{
    const postId = req.params.id;
    try {

        const getPost = await Post.findOne({_id: postId});
        const getTags = await Tag.find({ _id: { $in: getPost.tags } }).lean();

        for (const originalTag of getTags) {
                const postCountWithCurrentTag = await Post.countDocuments({ tags: originalTag._id });
                if (postCountWithCurrentTag === 0) {
                    //delete the tag
                    await Tag.findByIdAndDelete({ _id: originalTag._id });
                  }
        }

        const result = await Post.findByIdAndDelete(postId);

        if (result) {
          res.status(200).json({ message: 'Successfully deleted.' });
        } else {
          res.status(404).json({ message: 'Document not found.' });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Internal server error.' });
      }
});

//comment
router.post('/comment', async (req, res) =>{

    try {

        const {comment_textarea, id} = req.body;

        if(comment_textarea != "") {

            
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
        
        const comment_date = formattedDate;
    
        //add comment in collection
            const newComment = new Comment({
                username: '64b7e12123b197fa3cd7539b',
                post_commented: id,
                comment_content: comment_textarea,
                comment_date: comment_date
            });

            // Save the new comment to the database
            const savedComment = await newComment.save();
            
            console.log('New Comment created:', savedComment._id);
            console.log('New Comment created:', savedComment);

            //update post
            const updatedPost = await Post.findOneAndUpdate(
                { _id: id },
                { $push: { comments: savedComment._id } });

            console.log('Saved', updatedPost);

            return res.json({ message: 'Successfully commented!'});
        }

    } catch(error) {
        console.error('Error creating comment:', error);
        return res.status(500).send('Error creating comment.');
    }



});

//reply
router.post('/reply', async (req, res) =>{

    try {

        const {parent_comment_id, reply_content} = req.body;

        if(reply_content != "") {

            
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
        
        const comment_date = formattedDate;
        //find the comment using the comment id
        const getComment = await Comment.findOne({_id: parent_comment_id});

        console.log(getComment);
        //const getPost = await Post.find({ parent_comment_id: { $in: listOfcomments } }).lean();

        //add comment in collection
            const newComment = new Comment({
                username: '64b7e12123b197fa3cd7539b',
                post_commented: getComment.post_commented,
                comment_content: reply_content,
                comment_date: comment_date,
                parent_comment_id: parent_comment_id
            });

            // Save the new comment to the database
            const savedComment = await newComment.save();
            
            console.log('New Comment created:', savedComment._id);
            console.log('New Comment created:', savedComment);

            //update post
            const updatedPost = await Post.findOneAndUpdate(
                { _id: getComment.post_commented },
                { $push: { comments: savedComment._id } });

         //update comment with replies

        const updatedComment = await Comment.findOneAndUpdate(
            { _id: getComment._id },
            { $push: { replies: savedComment._id } });

             console.log('Saved', updatedPost);
             console.log('Saved', updatedComment);
            return res.json({ message: 'Successfully commented!'});
        }

    } catch(error) {
        console.error('Error creating comment:', error);
        return res.status(500).send('Error creating comment.');
    }



});

router.post('/edit-:id', upload.single('post_attachment'), async (req, res) =>{
    const getId = req.params.id;

    console.log("HERE");
    try {
        var post_attachment = "";

        if(req.file) {
            post_attachment = "img/"+req.file.originalname;
        }
            const { post_title, post_content, tags } = req.body;
            
            const getPost = await Post.findOne({_id: getId});
            const unchangedTags = [];

            //get the names of the tags
            const getTags = await Tag.find({ _id: { $in: getPost.tags } }).lean();
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

                const isUnchanged = getPost.tags.some((originalTag) => originalTag.equals(tag._id));
                if (isUnchanged) {
                  unchangedTags.push(tag);
                }
            }

            for (const originalTag of getTags) {
                const isUnused = !tagNames.includes(originalTag.tag_name);
                if (isUnused) {
                    const postCountWithCurrentTag = await Post.countDocuments({ tags: originalTag._id });
                    if (postCountWithCurrentTag === 0) {
                        //delete the tag
                        await Tag.findByIdAndDelete({ _id: originalTag._id });
                      }
                }
            }

            //update post
            //post title
            getPost.post_title = post_title;
            //post content
            getPost.post_content = post_content;
            //post attachment
            if(post_attachment != "") {
                getPost.post_attachment = post_attachment;
            }
            //post edited
            getPost.post_edited = true;
            //tags
            getPost.tags = tagIds;

            
           const savedPost = await getPost.save();
           ('Post updated:', savedPost);
          
            return res.json({ message: 'Successfully updated! You will be redirected shortly.', id: getId});
       

    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).send('Error creating post.');
    }

});

router.get('/editc-:id', async (req, res) =>{
    const getId = req.params.id;

    const getComment = await Comment.findOne({_id: getId}).populate({
        path: "username",
    }).lean();

     // start for side-container content

     const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

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
       ]).sort({count: 'desc'}).limit(6);

       
       const user = await Account.find({ "username" : "helpvirus" });

       const subscribedTags = user[0].subscribed_tags;
       const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();

       
       const getPopularTags = [];

     for (var i = 0; i < tagCounts.length; i++){
         var newTag = await Tag.findById(tagCounts[i]._id).lean();
         var tag = ({
             tag_name: newTag.tag_name,
             tag_id: newTag._id,
             count: tagCounts[i].count
         });
        getPopularTags.push(tag);

     }


    res.render("edit-comment", {
        title: "Edit comment",
        header: "Edit comment",
        script: "js/post.js",
        username: getComment.username.username,
        comment_date: getComment.comment_date,
        comment_content: getComment.comment_content,
        posts_latest: latest_posts,
        popular_tags: getPopularTags,
        sub_tags: listofTags,
        id: getComment._id,
        button_type: 'edit-comment-btn',
        navbar: 'logged-navbar'

    });
});


router.post('/editc-:id', async (req, res) =>{

    try{
    const getId = req.params.id;
    

    const getComment = await Comment.findOne({_id: getId});

    const { comment_content } = req.body;

    if(comment_content != "") {
        getComment.comment_content = comment_content;
    }

    getComment.is_edited = true;
    
    console.log(getId);

    const saveComment = await getComment.save();
    console.log("Saved", saveComment);

    return res.redirect(`/post/${saveComment.post_commented}`);
} catch(error){
    console.log(error);
    return res.status(500).send('Error creating post.');

}
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

        // start for side-container content

        const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

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
          ]).sort({count: 'desc'}).limit(6);

          const user = await Account.find({ "username" : "helpvirus" });

          const subscribedTags = user[0].subscribed_tags;
          const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();

          const getPopularTags = [];

        for (var i = 0; i < tagCounts.length; i++){
            var newTag = await Tag.findById(tagCounts[i]._id).lean();
            var tag = ({
                tag_name: newTag.tag_name,
                tag_id: newTag._id,
                count: tagCounts[i].count
            });
           getPopularTags.push(tag);

        }

        let logged_in = "";

        if(getPost.username.username == "helpvirus") {
            logged_in = true;
        } else {
            logged_in = false;
        }

        var checkUpvote = await Vote.exists({post_comment: getName, username: '64b7e12123b197fa3cd7539b', up_downvote: 'up'});
        var checkDownvote = await  Vote.exists({post_comment: getName, username: '64b7e12123b197fa3cd7539b', up_downvote: 'down'});
        var upvoteC = await Vote.find().where({post_comment: getName, up_downvote: 'up'}).count();
        var downvoteC = await Vote.find().where({post_comment: getName, up_downvote: 'down'}).count();

        const listofcomments = await Comment.find({
            _id: { $in: getPost.comments },
          })
            .populate("username") // Populate the 'username' field with the 'Account' documents
            .populate({
            path: "replies", 
            model: 'Comment', 
            populate: {
              path: "username",
                }})
            .lean();
        
        const newlist = [];

        for(comment of listofcomments) {
            if(comment.parent_comment_id == null) {
                newlist.push(comment);
            }
        }

        console.log(newlist);

            const comment_amount = listofcomments.length;

            // //start
            // const populateRepliesRecursively = async (comment) => {
            //     if (comment.replies.length === 0) {
            //       return; // Base case: if the comment has no replies, return
            //     }
              
            //     // Populate the replies for the current comment
            //     comment.replies = await Comment.populate(comment.replies, {
            //       path: "replies",
            //       model: "Comment",
            //       populate: {
            //         path: "username",
            //       },
            //     });
              
            //     // Recursively populate replies for each nested reply
            //     for (const reply of comment.replies) {
            //       await populateRepliesRecursively(reply);
            //     }
            //   };

            //   const getCommentsWithReplies = async (commentIds) => {
            //     const comments = await Comment.find({ _id: { $in: commentIds } })
            //       .populate("username")
            //       .populate("replies") // Only populate immediate replies for the main comments
            //       .lean();
              
            //     // Recursively populate replies for each comment
            //     for (const comment of comments) {
            //       await populateRepliesRecursively(comment);
            //     }
              
            //     return comments;
            //   };

            // const commentIds = getPost.comments;
            // const commentsWithReplies = await getCommentsWithReplies(commentIds);
           
            // console.log(commentsWithReplies);
            //   //end

            // console.log(listofcomments);

        res.render("view-post", {
            title: "post | " + getPost.post_title,
            post_title: getPost.post_title,
            post_content: getPost.post_content,
            username: getPost.username,
            post_date: getPost.post_date,
            tags_post: getPost.tags,
            post_attachment:getPost.post_attachment,
            posts_latest: latest_posts,
            popular_tags: getPopularTags,
            post_edited: getPost.post_edited,
            sub_tags: listofTags,
            comment: newlist,
            comment_amount: comment_amount,
            id: getName,
            is_upvoted: checkUpvote,
            is_downvoted: checkDownvote,
            upvote_count: upvoteC,
            downvote_count: downvoteC,
            logged_in: logged_in,
            script: "js/view-post.js",
            navbar: 'logged-navbar'
        });
    } catch(error){
        console.log(error);
    }
   
});

router.post('/:id', async (req, res) =>{
    const getId = req.params.id;
  
    try{
        const getPost = await Post.findOne({_id: getId}).populate({
            path: "username"
        }).populate({
            path: 'tags'
        }).lean();

        const {action} = req.body;
        var isUpvoted = await Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'up'});
        var isDownvoted = await  Vote.findOne({post_comment: getId, username: '64b7e12123b197fa3cd7539b', up_downvote: 'down'});
        if (action === 'upvoted' && !isUpvoted && !isDownvoted){
            const newUpvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'up'});
            await newUpvote.save();
            return res.json({message:"User upvoted successfully"});
        }
        else if (action === 'upvoted' && isUpvoted){
            await Vote.findByIdAndDelete(isUpvoted._id);
            return res.json({message:"User already upvoted, removing upvote"});
        }
        else if (action === 'upvoted' && isDownvoted){
            await Vote.findByIdAndDelete(isDownvoted._id);
            const editedUpvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'up'});
            await editedUpvote.save();
            return res.json({message:"User previously downvoted, removing downvote for upvote"});
        }
        else if (action === 'downvoted' && !isUpvoted && !isDownvoted){
            const newDownvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'down'});
            await newDownvote.save();
            return res.json({message:"User downvoted successfully"});
        }
        else if (action === 'downvoted' && isDownvoted){
            await Vote.findByIdAndDelete(isDownvoted._id);
            return res.json({message:"User already downvoted, removing downvote"});
        }
        else if(action === 'downvoted' && isUpvoted){
            await Vote.findOneAndDelete(isUpvoted._id);
            const editedDownvote = new Vote({username: '64b7e12123b197fa3cd7539b', post_comment: getId, up_downvote: 'down'});
           await editedDownvote.save();
           return res.json({message: "User previously upvoted, removing upvote for downvote"});
        }
        
    } catch(error){
        console.log(error);
    }
   
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

module.exports = router;