const { Sequelize } = require('sequelize');
const UserModel = require('./models/userModel');
const ProductModel = require('./models/productModel');
const CartModel = require('./models/cartModel');
const CartItemModel = require('./models/cartItemModel');

const pg = process.env.PG_DATABASE;
const pg_username = process.env.PG_USERNAME;
const pg_password = process.env.PG_PASSWORD;
const pg_host = process.env.PG_HOST

// Initialize Sequelize
const sequelize = new Sequelize(pg, pg_username, pg_password, {
    host: pg_host,
    dialect: 'postgres',
    logging: false,
});

// Register models
const User = UserModel(sequelize);
const Product = ProductModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);


const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.Product = Product;
db.Cart = Cart;
db.CartItem = CartItem;

db.Cart.belongsTo(db.User,   { foreignKey: 'user_id' });
db.User.hasOne(db.Cart,      { foreignKey: 'user_id' });

db.Cart.hasMany(db.CartItem, { foreignKey: 'cart_id' });
db.CartItem.belongsTo(db.Cart, { foreignKey: 'cart_id' });

db.CartItem.belongsTo(db.Product, { foreignKey: 'product_id' });
db.Product.hasMany(db.CartItem,   { foreignKey: 'product_id' });


module.exports = db;



