const express = require ("express");
const Post = require('../server/schema/Post');
const Tag = require('../server/schema/Tag');
const Account = require('../server/schema/Account');
const Comment = require('../server/schema/Comment');
const { parse } = require("dotenv");
const router = express.Router();


router.get('/', async (req, res) => {
    const maxTextLength = 100;

    try {
        const page = req.query.p || 0;
        const postsPerPage = 12;

        const listofposts = await Post.find().populate({
            path: 'username',
        }).populate({
            path:'tags',
            select: 'tag_name'
        }).sort({date: 'desc'})
        .skip(page * postsPerPage)
        .limit(postsPerPage)
        .lean();

        const listofallposts = Post.find().lean();
        const postCount = (await listofallposts).length;
        const parsedPage = parseInt(page);

        var maxPage = Math.floor(postCount/postsPerPage)
        var firstPage = 0;
        var lastPage = maxPage;
        var prevPage, nextPage;

        prevPage = parsedPage - 1;
        nextPage = parsedPage + 1;

        if (prevPage < firstPage){
          prevPage = undefined;
        } 
        
        if (nextPage > maxPage) {
          nextPage = undefined;
        } 

        console.log("--debug--");
        console.log(firstPage);
        console.log(prevPage);
        console.log(parsedPage);
        console.log(nextPage);
        console.log(lastPage);



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
            // console.log(tagCounts[i].count);
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
          popular_tags: getPopularTags,
          navbar: 'navbar',
          first_page: firstPage,
          prev_page: prevPage,
          curr_page: parsedPage,
          next_page: nextPage,
          last_page: lastPage
        });
    } catch(error){
        console.log(error);
    }
});

module.exports = router;