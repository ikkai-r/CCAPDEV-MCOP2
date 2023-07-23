const express = require ("express");
const router = express.Router();

router.get('/', (req, res) =>{
    const searchTerm = req.query.text;
    console.log('Search term:', searchTerm);

    res.render("search", {
        header: "Search Results for " + searchTerm,
        script: 'js/index.js',
        add_style: '<link rel="stylesheet" type="text/css" href="css/style1.css">'
        });
});

module.exports = router;
