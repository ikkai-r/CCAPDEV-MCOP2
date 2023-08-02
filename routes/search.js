const express = require ("express");
const mongoose = require('mongoose');
const router = express.Router();
const Post =  require('../server/schema/Post');
const Account =  require('../server/schema/Account');
const Tag =  require('../server/schema/Tag');


router.get('/', async (req, res) =>{

    let navbar = 'navbar';

    if(req.session.username) {
      navbar = 'logged-navbar';
    } 
    
    var searchTerm = req.query.text;
    const search = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const searchResults_Post = await Post.find({
      $or: [
        { post_title: {$regex: new RegExp(search, 'i')}},
        { post_content: {$regex: new RegExp(search, 'i')}},
    ]}).populate('username').populate( { path: 'tags', match: { type: search}},).lean();
   

    const searchResults_Account = await Account.find({
        $or: [
            { username: {$regex: new RegExp(search, 'i')}},
            ]
    }).lean();

    const searchTag = await Tag.find({
        tag_name: {$regex: new RegExp(search, 'i')}
    }).lean();

    var searchResults_Tag = [];

   
    for (var i = 0; i < searchTag.length; i++){
     
      
    var tagCounts = await Post.aggregate([
      {
        $unwind: '$tags' 
      },
      {
        $match: {tags: searchTag[i]._id}
      },
      {
        $count: "count"
      }
      ]);

      console.log(tagCounts)
      var getTagNames = await Tag.findById(searchTag[i]._id).lean();
      var jsonfile = JSON.stringify(tagCounts)
      var filteredPostNum = jsonfile.replace(/\D/g,'');
      var newSearchTag = ({
        tag_name: getTagNames.tag_name,
        count: filteredPostNum
      })
      
      if(tagCounts.length != 0)
      await searchResults_Tag.push(newSearchTag);

    }
    console.log(searchResults_Tag);

    

    // need to output the results to here
    res.render("search", {
        header: "Search Results for " + searchTerm,
        searched_post: searchResults_Post,
        searched_accounts: searchResults_Account,
        searched_tags: searchResults_Tag,
        script: 'js/index.js',
        add_style: '<link rel="stylesheet" type="text/css" href="css/style1.css">',
        navbar: navbar,
        session_user: req.session.username
        });
});

module.exports = router;
