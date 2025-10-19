// models/cartModel.js (user_id INTEGER)
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Cart = sequelize.define('Cart', {
    id:      { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.INTEGER, allowNull: false, unique: true }, // 1 user = 1 cart
  }, {
    tableName: 'carts',
    timestamps: true,
    underscored: true,
  });

  return Cart;
};
