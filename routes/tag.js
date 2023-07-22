const express = require ("express");
const router = express.Router();


router.get("/:tagname", (req, res)=>{
    res.render("tag");
})


router.get("/", (req, res)=>{
    res.render("tag", {
        header: "View tags"
    });
});



module.exports = router;