const express = require ("express");
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const Comment = require('../server/schema/Comment');
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

       
       const getPopularTags = [];

     for (var i = 0; i < tagCounts.length; i++){
         var newTag = await Tag.findById(tagCounts[i]._id).lean();
         console.log(tagCounts[i].count);
         var tag = ({
             tag_name: newTag.tag_name,
             count: tagCounts[i].count
         });
        getPopularTags.push(tag);

     }

    res.render("create-post", {
        header: "Create a new post",
        script: "js/post.js",
        post_username: "helpvirus",
        post_date: new Date(),
        posts_latest: latest_posts,
        popular_tags: getPopularTags,
        button_type: "create-post-btn"
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
 
    try{
        res.render("create-post", {
            header: "Edit post",
            script: "js/post.js",
            post_title: getPost.post_title,
            post_content:  getPost.post_content,
            post_date:  getPost.post_date,
            post_username: getUser.username,
            post_attachment: post_attachment,
            tags: getTags,
            id: getId,
            button_type: "edit-post-btn"
        });
    } catch(error){
        console.log(error);
    }
   
});


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


    res.render("edit-comment", {
        header: "Edit comment",
        script: "js/post.js",
        username: getComment.username.username,
        comment_date: getComment.comment_date,
        comment_content: getComment.comment_content,
        id: getComment._id,
        button_type: 'edit-comment-btn'
    });
});


router.post('/editc-:id', async (req, res) =>{

    try{
    const getId = req.params.id;

    console.log(req.body);
    

    const getComment = await Comment.findOne({_id: getId});

    const { comment_content } = req.body;

    if(comment_content != "") {
        getComment.comment_content = comment_content;
    }

    getComment.is_edited = true;
    
    console.log(getId);

    const saveComment = await getComment.save();
    console.log("Saved", saveComment);

    return res.json({ message: 'success', id: getId} );
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

          
          const getPopularTags = [];

        for (var i = 0; i < tagCounts.length; i++){
            var newTag = await Tag.findById(tagCounts[i]._id).lean();
            console.log(tagCounts[i].count);
            var tag = ({
                tag_name: newTag.tag_name,
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

        const listofcomments = await Comment.find({
            _id: { $in: getPost.comments },
          })
            .populate("username") // Populate the 'username' field with the 'Account' documents
            .lean();

            const comment_amount = listofcomments.length;

        res.render("view-post", {
            post_title: getPost.post_title,
            post_content: getPost.post_content,
            username: getPost.username,
            post_date: getPost.post_date,
            tags_post: getPost.tags,
            posts_latest: latest_posts,
            popular_tags: getPopularTags,
            post_edited: getPost.post_edited,
            comment: listofcomments,
            comment_amount: comment_amount,
            id: getName,
            logged_in: logged_in,
            script: "js/view-post.js"
        });
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