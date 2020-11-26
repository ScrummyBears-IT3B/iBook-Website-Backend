const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');
const { request } = require('http');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

//Private files
dotenv.config({
    path: './.env'}); 

const app = express(); 

//Connection with the database
const db = mysql.createPool({ 
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

//Client side files directory (css)
const publicDirectory =  path.join(__dirname, './public')
app.use(express.static(publicDirectory)); 

//Parse URL-encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended: false }));  //make sure to grab all data from forms

//Parse JSON bodies (as sent by API clients)
app.use(express.json()); //values will come in as JSONS

app.use(cookieParser());

//View handlebars pages
app.set('view engine', 'hbs'); 


app.use(fileUpload());

//Check database connection
db.getConnection( (error) => { 
    if(error){
        console.log(error);
    }
    else{
         console.log("MYSQL CONNECTED");
    }
})

//Define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));
app.use('/data', require('./routes/data'));

app.listen(8080, () => {
    console.log("Server started at port 8080");
    
})

