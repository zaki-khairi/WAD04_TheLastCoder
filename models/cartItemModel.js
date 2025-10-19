const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CartItem = sequelize.define('CartItem', {
    id:         { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    cart_id:    { type: DataTypes.UUID,   allowNull: false },
    product_id: { type: DataTypes.BIGINT, allowNull: false },
    qty:        { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } },
  }, {
    tableName: 'cart_items',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['cart_id', 'product_id'] }, // satu produk sekali di cart
    ],
  });

  return CartItem;
};
