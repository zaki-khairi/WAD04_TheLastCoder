const express = require('express');
const app = express();
const PORT = 3000

// Import routes
const aboutUsRoutes = require('./routes/aboutUsRoute');
const greetRoutes = require('./routes/greetRoute');
const userRoutes = require('./routes/userRoute');
const productRoutes = require('./routes/productRoute');
const cartRoutes = require('./routes/cartRoute')

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// Use Routes
app.use('/aboutus', aboutUsRoutes);
app.use('/greet', greetRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/carts', cartRoutes);

// Base Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
})

app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))
