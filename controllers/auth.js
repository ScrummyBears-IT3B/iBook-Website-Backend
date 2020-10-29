const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createPool({ //assigning db to create connection w/ database
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});


exports.userLoginPage = async (req, res) => {
    try {
        const {userUsername, userPassword} = req.body;

        if (!userUsername || !userPassword) {
            return res.status(400).render('userLoginPage', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users_table WHERE USER_NAME = ?', [userUsername], async (error, results) => {

            if(results.length<1 ){
                return res.status(401).render('userLoginPage', {
                        message : 'Enter valid email or password'
                });
        }
        else if(!(await bcrypt.compare(userPassword, results[0].USER_PASS)) ){

                return res.status(401).render('userLoginPage', {
                    message : 'Enter valid email or password'

              });

        }
        else{

        req.session.USER_NAME = req.body.userUsername;
        var userUsername = req.session.USER_NAME;    
        
        res.status(200).redirect('/')   
     
        }
});

} catch (err) { 
console.log(err);
}
}
exports.userRegisterPage = (req, res) => {
    console.log(req.body); //grabbing all the data sent from the form

     const userUsername = req.body.userUsername;
     const userEmail = req.body.userEmail;
     const userPassword = req.body.userPassword;
     const userPasswordConfirm = req.body.userPasswordConfirm; 

     var datetime = new Date();
     console.log(datetime);
    // const userCreatedDate =  db.query('SELECT CURRENT_TIMESTAMP');
     
 /**   const {
        userUsername,
        userEmail,
        userPassword,
        userPasswordConfirm
    } = req.body; */

    
    db.query('SELECT USER_NAME FROM users_table WHERE USER_NAME = ?', [userUsername], async (usernameError, usernameResults) => {
        
        db.query('SELECT USER_EMAIL FROM users_table WHERE USER_EMAIL = ?', [userEmail], async (emailError, emailResults) => {
        
        if (usernameError) {
            console.log(usernameError);
        }
        if (emailError) {
            console.log(emailError);
        }
        if (usernameResults.length > 0) {
            return res.render('userRegisterPage', {
                usernameMessage: 'That username is already in use'
            })
        }
        if (emailResults.length > 0) {
            return res.render('userRegisterPage', {
                emailMessage: 'That email is already in use'
            })
        } 
        if (userPassword !== userPasswordConfirm) {
            return res.render('userRegisterPage', {
                passwordMessage: 'Passwords do not match'
            });
        }

        
        let hashedPassword = await bcrypt.hash(userPassword, 8); //rounds of encryption
        console.log(hashedPassword);

        db.query('INSERT INTO users_table SET ?', {
            USER_NAME: userUsername,
            USER_EMAIL: userEmail,
            USER_PASS: hashedPassword,
            USER_CREATED_DATE: datetime,
            USER_MODIFIED_DATE: datetime
        }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
              //  console.log(results);
                return res.render('userRegisterPage', {
                    message: 'User registered'
                });
            }
        })
    });
});
    //res.send("Form submitted");
}