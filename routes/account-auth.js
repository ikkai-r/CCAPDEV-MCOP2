const express = require ("express");
const router = express.Router();
const Account = require('../server/schema/Account');
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
const bcrypt = require('bcryptjs');


router.post('/', async (req, res) =>{
    
    try {
        const { action } = req.body;
        
        if(action === 'register') {

            const { username, email_reg, password_reg } = req.body;
             //Check if the user already exists 
            //will make frontend for this
            const existingUser = await Account.findOne({ email:email_reg });
            if (existingUser) {
            return res.status(400).send('User already exists');
            }

            const hashedPassword = await bcrypt.hash(password_reg, 10);

            // Create a new account document
            const newAccount = new Account({
                username: username.toLowerCase(),
                email: email_reg,
                password: hashedPassword
            });

            newAccount.save()
            .then(savedAccount => {
                console.log('New Account created:', savedAccount);
                return res.json({ message: 'Successfully registered! You will be redirected shortly.', username: username.toLowerCase() });
            })
            .catch(error => {
                console.error('Error creating Account:', error);
            });
        } else if (action === 'login') {
            const { email_log, password_log } = req.body;

            console.log(email_log);
            console.log(password_log);
            const user = await Account.findOne( {email: email_log} );

            if (!user) {
                console.log('user');
                console.log(user);
                return res.status(401).json({ message: 'Invalid credentials'});
            }

            const passwordComp = await bcrypt.compare(password_log, user.password);

            if (!passwordComp) {
                console.log('pass');
                return res.status(401).json({ message: 'Invalid credentials'});
            }

            return res.json({ username: user.username });
        }


                } catch (error) {
                    
                    console.error('Error registering user:', error);
                    return res.status(500).send('Error registering user.');
                }

});




module.exports = router;