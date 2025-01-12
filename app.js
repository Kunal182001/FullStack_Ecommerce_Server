const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const cors=require('cors');
const connectDB=require('./DataBase/Database');
const authjwt = require('./Helper/jwt.js');

require('dotenv/config');



app.use(cors());
app.options("*",cors);

app.use(bodyParser.json());


//Routes
const Categoreyroute=require('./Routes/Categoreyroutes');
const Productroute=require('./Routes/Productroutes');
const Cart = require('./Routes/Cartroutes.js')
const Userroute=require('./Routes/UserRoute');
const WisListroute=require('./Routes/WishListroutes.js');
const Orderroute=require('./Routes/Orderroutes.js');
const Searchroute=require('./Routes/Searchroutes.js');


app.use('/api/Category',Categoreyroute);
app.use('/api/products',Productroute);
app.use('/api/User',Userroute);
app.use('/api/Cart',Cart)
app.use('/api/Wishlist',WisListroute);
app.use('/api/Order',Orderroute);
app.use('/api/Search',Searchroute);

connectDB();
// app.use(authjwt());



app.listen(process.env.PORT,()=>{
    console.log("Server is Started...");
})