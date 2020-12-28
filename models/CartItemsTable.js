const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class CartItemsTable extends Model {}
CartItemsTable.init({
		CART_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false
		},
		PRODUCT_ID: {
			type: Sequelize.INTEGER(100),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true,
			autoIncrement: true
		},
		PRODUCT_QUAN: {
			type: Sequelize.INTEGER(100),
			allowNull: false
		},
		PRODUCT_ADDED_DATE: {
			type: Sequelize.DATE,
			allowNull: false
		}
	}, {
		sequelize,
		modelName: 'CartItemsTable',
		freezeTableName: true,
		timestamps: false
	}
);


      CartItemsTable.associate = (db) => {
        
      };
      module.exports = () =>CartItemsTable;
