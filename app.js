
const express = require('express');
const mysql = require("mysql");
const dotenv = require('dotenv');
const path = require('path');
const { request } = require('http');
//const togglePassword = document.querySelector('#togglePassword');
//const userPassword = document.querySelector('#userPassword');
dotenv.config({
    path: './.env'}); //tells where the private files are


const app = express(); 

const db = mysql.createPool({ //assigning db to create connection w/ database
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory =  path.join(__dirname, './public')///frontend files dirname = directory where you are
//make sure that express is using public directory
app.use(express.static(publicDirectory)); //to grab all static files 

//Parse URL-encoded bodies as sent by HTML forms
app.use(express.urlencoded({extended: false }));  //make sure to grab all data from forms
//Parse JSON bodies (as sent by API clients)
app.use(express.json()); //values will come in as JSONS

app.set('view engine', 'hbs'); //view hbs pages

db.getConnection( (error) => { //function
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

app.listen(8080, () => {
    console.log("Server started at port 8080");
    
})

