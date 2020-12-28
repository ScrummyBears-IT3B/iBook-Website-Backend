const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class UsersTable extends Model {}
UsersTable.init({
		USER_ID: {
			type: Sequelize.INTEGER(10),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			autoIncrement: true
		},
		USER_NAME: {
			type: Sequelize.STRING(60),
			allowNull: false
		},
		USER_EMAIL: {
			type: Sequelize.STRING(60),
			allowNull: false
		},
		USER_PASS: {
			type: Sequelize.STRING(60),
			allowNull: false
		},
		USER_CREATED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		},
		USER_MODIFIED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'UsersTable',
		freezeTableName: true,
		timestamps: false
	}
);


      UsersTable.associate = (db) => {
        
      };
      module.exports = () =>UsersTable;
