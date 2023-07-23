const express = require ("express");
const Account = require('../server/schema/Account');
const router = express.Router();


router.get("/:name", async (req, res)=>{
    const getName = req.params.name;
    try{
        const user = await Account.find().where("username").equals(getName);

        if (!user) {
            // Handle the case when the user is not found
            return res.status(404).send("User not found.");
        }

        res.render("user", {
            "username": user[0].username,
            "profile_desc": user[0].profile_desc,
            "profile_pic": user[0].profile_pic,
            script: "js/profile.js"
        });
        
    } catch(error){
        console.log(error);
    }
})

router.get("/", (req, res)=>{
    res.redirect('/');
});

module.exports = router;