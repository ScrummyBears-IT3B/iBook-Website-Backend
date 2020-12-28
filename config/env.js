const Sequelize = require("sequelize");
var SequelizeAuto = require('sequelize-auto-models')

const sequelize = new Sequelize("ibook_db", "root", "", {
  host: "localhost",
  dialect: "mysql"
});
 
var auto = new SequelizeAuto('ibook_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    directory: false, // prevents the program from writing to disk
    port: '3306',
    additional: {
        timestamps: false,
        typescript: true
        //...
    },
    tables: ['books_table', 'admin_table', 'users_table', 'cart_items_table', 'cart_table', 'sessions']
    //...
})

 /** 
auto.run(function (err) {
  if (err) throw err;
 
  console.log(auto.tables); // table list
  console.log(auto.foreignKeys); // foreign key list
}); */

module.exports = sequelize; 