const express = require ("express");
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const Comment = require('../server/schema/Comment');
const router = express.Router();


router.get('/', async (req, res) => {
    const maxTextLength = 100;

    try {
        const listofposts = await Post.find().populate({
            path: 'username',
        }).populate({
            path:'tags',
            select: 'tag_name'
        }).sort({date: 'desc'}).lean();

        listofposts.forEach((post) => {

            if (post.post_title && post.post_title.length > maxTextLength) {
              post.post_title = post.post_title.substring(0, maxTextLength) + '...';
            }

            if (post.tags && post.tags.length > 3) {
                post.tags = post.tags.slice(0, 3);
              }
        });

        // start for side-container content

        let logged_in = false;
        let listofTags;
        let navbar = 'navbar';

        if(req.session.username) {
          //user is logged in

          logged_in = true;
          
          const user = await Account.findOne({ "username" : req.session.username });

          const subscribedTags = user.subscribed_tags;
          listofTags = await Tag.find({ _id: { $in: subscribedTags } }).lean();
          
          navbar = 'logged-navbar';
        }


        console.log(listofTags);

        const latest_posts = await Post.find().populate('username').sort({post_date:'desc'}).limit(5).lean();

          // start for side-container content
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
            var tag = ({
                tag_name: newTag.tag_name,
                tag_id: newTag._id,
                count: tagCounts[i].count
            });
          getPopularTags.push(tag);

  }
       
        res.render("index", {
        title: "Hot Posts",
        header: "Hot Posts",
        script: 'js/index.js',
        posts: listofposts,
        posts_latest: latest_posts,
        popular_tags: getPopularTags,
        sub_tags: listofTags,
        logged_in: logged_in,
        navbar: navbar,
        session_user: req.session.username
        });
    } catch(error){
        console.log(error);
    }
});

module.exports = router;