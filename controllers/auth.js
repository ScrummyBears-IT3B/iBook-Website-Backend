const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require ('util');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//const { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } = require("constants");

const db = mysql.createPool({ //assigning db to create connection w/ database
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

let testAccount = nodemailer.createTestAccount();

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'ibook.scrummybears@gmail.com',
        pass: 'scrummybears'
    }
});

//ADMIN LOGIN
exports.adminLoginPage = async (req, res) => {
    try {
        const {
            adminUsername,
            adminPassword
        } = req.body;
        
        if (!adminUsername || !adminPassword) {
            return res.status(400).render('adminLoginPage', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM admin_table WHERE ADMIN_NAME = ?', [adminUsername], (error, results) => {
            console.log(results);
            if (results.length < 1) {
                return res.status(401).render('adminLoginPage', {
                    message: 'Enter valid email or password'
                });
            } else if ( adminPassword !== (results[0].ADMIN_PASS)) {

                return res.status(401).render('adminLoginPage', {
                    message: 'Enter valid email or password'

                })

            } else {
                
                const adminID = results[0].ADMIN_ID;

                const token = jwt.sign({ adminID }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); //unique token
                console.log("token is" + token);
              
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/adminPage');

            }
        });

    } catch (error) {
        console.log(error);
    }
}

//USER LOGIN
exports.userLoginPage = async (req, res) => {
    try {
        const {
            userUsername,
            userPassword
        } = req.body;

        if (!userUsername || !userPassword) {
            return res.status(400).render('userLoginPage', {
                message: 'Please provide an email and password'
            })
        }

        db.query('SELECT * FROM users_table WHERE USER_NAME = ?', [userUsername], async (error, results) => {
            console.log(results);
            if (results.length < 1) {
                return res.status(401).render('userLoginPage', {
                    message: 'Enter valid email or password'
                });
            } else if (!(await bcrypt.compare(userPassword, results[0].USER_PASS))) {

                return res.status(401).render('userLoginPage', {
                    message: 'Enter valid email or password'

                })

            } else {
    

                const userID = results[0].USER_ID;

                const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }); //unique token
                console.log("token is" + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect('/');
                this.props.navigation.reset([NavigationActions.navigate({ routeName: 'DevicesList'})], 0);
 
            }
        });

    } catch (error) {
        console.log(error);
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
                        message: 'Registration completed successfuly! You can now login.'
                    });
                }
            })
        });
    });
    
}

exports.isLoggedIn = async(req, res, next) => {
    console.log(req.cookies); //check cookies
    if(req.cookies.jwt) {
        try {
            //1 verify token/ which user
            const decoded = await promisify(jwt.verify) (req.cookies.jwt,
            process.env.JWT_SECRET
            ); //decode all token to grab the id of the user
        console.log(decoded);        
        
        //2 Check if user still exists
        db.query('SELECT * FROM users_table WHERE USER_ID = ?', [decoded.userID], (error, result) => {
            console.log(result);

            if(!result) { //if no result
                return next(); 
            }

            req.user = result[0]
            return next();
        });

        } catch (error) {
            console.log(error);
            return next();
        } 
        } else {
            next();
        }

    }
  
//ADMIN IS LOGGED IN
exports.adminIsLoggedIn = async(req, res, next) => {
        console.log(req.cookies); //check cookies
        if(req.cookies.jwt) {
            try {
                //1 verify token/ which user
                const decoded = await promisify(jwt.verify) (req.cookies.jwt,
                process.env.JWT_SECRET
                ); //decode all token to grab the id of the user
            console.log(decoded);        
            
            //2 Check if user still exists
            db.query('SELECT * FROM admin_table WHERE ADMIN_ID = ?', [decoded.adminID], (error, result) => {
                console.log(result);
    
                if(!result) { //if no result
                    return next(); 
                }
    
                req.admin = result[0]
                return next();
            });
    
            } catch (error) {
                console.log(error);
                return next();
            } 
            } else {
                next();
                return res.status(401).json({ message: 'Unauthorized' });
            }
    
        }

exports.logout = async(req, res) => {
    res.cookie('jwt', 'logout', {
        expires: new Date(Date.now() + 2*1000),
        httpOnly: true
    }); //overwrite current cookie

    res.status(200).redirect('/');
}   


exports.userSendEmail = (req, res) => {
    console.log(req.body);

    const userEmail = req.body.userEmail;

    db.query('SELECT USER_EMAIL FROM users_table WHERE USER_EMAIL = ?', [userEmail], async (error, results) => {

        if (error) {
            console.log('sad');
        }

        if (results.length < 1) {
            return res.render('userSendEmail', {
                message: 'That email is not registered'
            })
        }
    
    
    //Create a random reset token
    const urlTokens = crypto.randomBytes(64).toString('base64');
    console.log(urlTokens);
    //token expires after one hour
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1/24);

    //create email
    const message = {
        from: 'ibook@scrummybear.com',
        to: req.body.userEmail,
        subject: "📘 iBOOK PASSWORD RESET" ,
        html: ` <p>Hey ${req.body.userEmail}!</p>
                <p>We heard that you lost your iBook password. Sorry about that!</p>
                <p>To reset your password, please click the link below.\n\nhttp://localhost:8080/userForgotPassword?token='+${encodeURIComponent(urlTokens)}+'&email='+${req.body.userEmail}</p>
                <p>Don't forget to read anytime and anywhere you want!</p>
                <p>–Scrummy Bears</p>`,
    };
   
    //send email
    transport.sendMail(message, function (error, info) {
       if(error) { 
           console.log(error)
        }
       else { console.log(info); 
        return res.render('userSendEmail', {
            sentMessage: 'Please check your email for a password reset link'
        })  
    }
    });
   
  
});
}
 

exports.userForgotPassword = (req, res, next) => {
    console.log(req.body);

      if (urlTokens == null) {
        return res.render('userForgotPassword', {
          message: 'Token has expired. Please try password reset again.',
          showForm: false
        });
      }
     
      res.render('userForgotPassword', {
        showForm: true,
        urlTokens: urlTokens
      });

      
    }

exports.userForgotPassword = async(req, res, next) => {
    console.log(req.body);
    
    const userPassword = req.body.userPassword;
    const userPasswordConfirm = req.body.userPasswordConfirm;

        //compare passwords
         if (userPassword !== userPasswordConfirm) {
                return res.render('userForgotPassword', {
                    message: 'Passwords do not match'
                });
            }
       
        
        var datetime = new Date();

        let hashedPassword = await bcrypt.hash(userPassword, 8); //rounds of encryption
        console.log(hashedPassword);

        db.query('UPDATE users_table SET ?', {
            USER_PASS: hashedPassword,
            USER_MODIFIED_DATE: datetime
        }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                //  console.log(results);
                return res.render('userLoginPage', {
                    loginMessage: 'You can now login with your new password.'
                });
            }
        })
          
    }

