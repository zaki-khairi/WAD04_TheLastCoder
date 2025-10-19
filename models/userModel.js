const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        role: { type: DataTypes.STRING, allowNull: false },
    }, {
        tableName: 'users',
        timestamps: true,   
    })

    return User;
};