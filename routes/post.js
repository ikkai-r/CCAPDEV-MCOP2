const express = require ("express");
const router = express.Router();

router.get('/', (req, res) =>{
    res.render("create-post", {
        header: "Create a new post"
    });
});

// add viewing of page for a specific post

module.exports = router;