const express = require ("express");
const router = express.Router();
const Post =  require('../server/schema/Post');
const Account =  require('../server/schema/Account');
const Tag =  require('../server/schema/Tag');

router.get('/', async (req, res) =>{
    var searchTerm = req.query.text;
    const search = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const searchResults_Post = await Post.find({
        $or: [
            { post_title: {$regex: new RegExp(search, 'i')}},
            { post_content: {$regex: new RegExp(search, 'i')}},
    ]}).populate('username').populate('tags').lean();

    const searchResults_Account = await Account.find({
        $or: [
            { username: {$regex: new RegExp(search, 'i')}},
            ]
    }).lean();

    const searchTag = await Tag.find({
        tag_name: {$regex: new RegExp(search, 'i')}
    }).lean();
    var searchResults_Tag = [];


    // UNFINISHED
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
      ]);

    

    // need to output the results to here
    res.render("search", {
        header: "Search Results for " + searchTerm,
        searched_post: searchResults_Post,
        searched_accounts: searchResults_Account,
        searched_tags: searchResults_Tag,
        script: 'js/index.js',
        add_style: '<link rel="stylesheet" type="text/css" href="css/style1.css">'
        });
});

module.exports = router;
