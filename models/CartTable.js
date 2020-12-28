const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class CartTable extends Model {}
CartTable.init({
		USER_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false
		},
		CART_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false
		},
		CART_CREATED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		},
		CART_MODIFIED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'CartTable',
		freezeTableName: true,
		timestamps: false
	}
);


      CartTable.associate = (db) => {
        
      };
      module.exports = () =>CartTable;
