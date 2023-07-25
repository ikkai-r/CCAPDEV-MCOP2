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

        res.render("index", {
        header: "Hot Posts",
        script: 'js/index.js',
        posts: listofposts,
        posts_latest: latest_posts,
        popular_tags: getPopularTags
        });
    } catch(error){
        console.log(error);
    }
});

module.exports = router;