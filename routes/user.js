const express = require ("express");

const Account = require('../server/schema/Account');
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
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

router.get("/:name", async (req, res)=> {

    console.log(req.session.username);
    const getName = req.params.name;
    const maxTextLength = 50;

    try{
        const user = await Account.find({ "username" : { $regex : new RegExp(getName, "i") } });
        const logged_user = await Account.find({ "username" : req.session.username } );


        if (!user) {
            // Handle the case when the user is not found
            return res.status(404).send("User not found.");
        }

        const listofposts = await Post.find().where("username").equals(user[0]._id).populate({
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

        const listofcomments = await Comment.find().where("username").equals(user[0]._id).populate({
            path: 'post_commented',
            select: 'post_id tags post_title',
            populate: {
              path: 'tags',
              select: '_id tag_name',
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

          const subscribedTags = user[0].subscribed_tags;
          // const subscribedTagsLogged = logged_user[0].subscribed_tags;

          const listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();
          // const listofTagsLogged = await Tag.find({ _id: { $in: subscribedTagsLogged } }).lean();

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
             console.log(tagCounts[i]._id);
             var tag = ({
                 tag_name: newTag.tag_name,
                 tag_id: newTag._id,
                 count: tagCounts[i].count
             });
             getPopularTags.push(tag);
         }

         let editIconPr = "";
      //if not logged in / not helpvirus
     if(user[0].username == "helpvirus") {
         editIconPr = '<i class="fa-regular fa-pen-to-square edit-profile-icon" data-bs-toggle="modal" data-bs-target="#edProfModal"></i>';
      }

      res.render("user", {
        title: user[0].username,
        "username": user[0].username,
        "profile_desc": user[0].profile_desc,
        "profile_pic": user[0].profile_pic,
        user_posts: listofposts,
        user_comments: listofcomments,
        user_sub_tags: listofTags,
        // sub_tags: listofTagsLogged,
        // edit_profile: editIconPr,
        posts_latest: latest_posts,
        popular_tags: getPopularTags,
        script: "js/profile.js",
        add_script: "js/index.js",
        navbar: 'logged-navbar'
    });
        
    } catch(error){
        console.log(error);
    }
})

router.get("/", (req, res)=>{
    res.redirect('/');
});

router.post('/:name', upload.single('getImg'), async function (req, res) {

  try {

    const getName = req.params.name;
    const user = await Account.findOne({ username: getName });
    const { bio_area } = req.body;

  if(req.file) {
    const newImg = "img/"+req.file.originalname;
    user.profile_pic = newImg;
  }

  if (bio_area === '') {
    user.profile_desc = null;
  } else {
    user.profile_desc = bio_area;
  }

  await user.save();

  return res.json({ message: 'success', profile_image: user.profile_pic, profile_bio: user.profile_desc} );


  } catch(error) {
    console.error('Error updating profile:', error);
    return res.status(500).send('Error updating profile.');
  }
  
});


module.exports = router;