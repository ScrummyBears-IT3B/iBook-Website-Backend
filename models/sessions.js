const sequelize = require("../config/env.js");
const Sequelize = require("sequelize");
const Model = Sequelize.Model;

class Sessions extends Model {}
Sessions.init({
		session_id: {
			type: Sequelize.STRING(128),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		expires: {
			type: Sequelize.INTEGER(11).UNSIGNED,
			allowNull: false
		},
		data: {
			type: Sequelize.TEXT,
			allowNull: true
		}
	}, {
		sequelize,
		modelName: 'Sessions',
		freezeTableName: true,
		timestamps: false
	}
);


      Sessions.associate = (db) => {
        
      };
      module.exports = () =>Sessions;
