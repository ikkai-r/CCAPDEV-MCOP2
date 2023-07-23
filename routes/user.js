const express = require ("express");
const Account = require('../server/schema/Account');
const router = express.Router();


router.get("/:name", async (req, res)=>{
    const getName = req.params.name;
    try{
        const user = await Account.find().where("username").equals(getName);
        // currently stuck on displaying the stuff from the query
        res.render("user", {
            "profile_pic": user.profile_pic
        });
        
    } catch(error){
        console.log(error);
    }
})

router.get("/", (req, res)=>{
    res.redirect('/');
});

module.exports = router;