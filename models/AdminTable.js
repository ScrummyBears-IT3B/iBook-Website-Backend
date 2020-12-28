const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class AdminTable extends Model {}
AdminTable.init({
		ADMIN_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			autoIncrement: true
		},
		ADMIN_NAME: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		ADMIN_EMAIL: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		ADMIN_PASS: {
			type: Sequelize.STRING(100),
			allowNull: false
		},
		ADMIN_CREATED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		},
		ADMIN_MODIFIED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'AdminTable',
		freezeTableName: true,
		timestamps: false
	}
);


      AdminTable.associate = (db) => {
        
      };
      module.exports = () =>AdminTable;
