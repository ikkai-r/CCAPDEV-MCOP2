const express = require ("express");
const router = express.Router();


router.get("/:name", (req, res)=>{
    res.render("user");
})


router.get("/", (req, res)=>{
    res.redirect('/');
});

module.exports = router;