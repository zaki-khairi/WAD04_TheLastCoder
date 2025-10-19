const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        product_name: { type: DataTypes.STRING, allowNull: false },
        product_category: { type: DataTypes.STRING, allowNull: false },
        price: { type: DataTypes.BIGINT, allowNull: false, validate: { min: 0 } },
        owner: { type: DataTypes.STRING, allowNull: false }        
    }, {
        tableName: 'product',
        timestamps: true,
    })

    return Product
}