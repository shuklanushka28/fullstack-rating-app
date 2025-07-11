'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'ownerId', as: 'owner' });


      this.hasMany(models.Rating, { foreignKey: 'storeId' });
    }
  }

  Store.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      address: DataTypes.STRING,
      ownerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Store',
    }
  );

  return Store;
};
