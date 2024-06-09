const dotenv = require("dotenv")
dotenv.config()
const validator = require('validator')
const express = require("express");
const session=require('express-session')
const app = express();
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}))

const PORT = 4000;
const path = require("path");

const mongoose = require("mongoose");
const { ALL } = require("dns");

const connectionString = process.env.MONGO_URI

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("DB is live");
  })
  .catch((err) => {
    console.log("DB CONNECTION ERROR: " + err);
});

app.use(express.static("../Client"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());



app.get("/", (req, res) => {
  const sessionData=req.session
  res.sendFile(path.join(__dirname, "..", "Client", "index.html"));
});

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    inCart: Number,
    order: Array,
    admin: Boolean
})
const User = mongoose.model('user',userSchema)

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: Number,
  image: String
})
const Product = mongoose.model('product',productSchema)

const ordersSchema = new mongoose.Schema({
  recipientName: String,
  recipientEmail: String,
  order: Array,
  orderSum: Number,
  time: Object
})
const Order = mongoose.model('order',ordersSchema)




app.get("/all-orders", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Client", "allOrders.html"));
});
app.post('/api/all-orders',async(req,res)=>{
    try {
        const orders = await Order.find({})
        res.json(orders)
    }catch(error) {
        res.status(500).send("Internal server error")
    }
})
app.post('/api/all-orders/session',async(req,res)=>{
  try {
      if(!req.session.admin)
        res.status(401).send('Not an admin')
  }catch(error) {
      res.status(500).send("Internal server error")
  }
})
app.post('/api/home-image',async(req,res)=>{
  try {
      const {guitarName} = req.body
      result = await Product.findOne({name: guitarName})
      res.json(result)
  }catch(error) {
      res.status(500).send("Internal server error")
  }
})
app.get("/store", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Client", "store.html"));
});
app.get("/confirm-order", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Client", "confirmOrder.html"));
});
app.get("/sign-up", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Client", "signUp.html"));
});
app.get("/sign-in", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "Client", "signIn.html"));
});
app.get("/log-out", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "Client", "logOut.html"));
});
async function addNewUser(newUser){
    const user = new User({
      fullName: newUser.fullName,
      email: newUser.email,
      password: newUser.password,
      inCart:0
    })
    await user.save()
}
app.post('/api/sign-up',async (req,res)=>{
    const {fullName,email,password,passwordConfirm}=req.body
    const userObject = {fullName,email,password}
    const searchEmail = await User.findOne({email: email})
    try{
      if(!validator.isEmail(email)){
        res.status(400).send('Email not valid')
      }else if (searchEmail!=null || searchEmail!=undefined){
        res.status(400).send('Email is already registered')
      }else if(fullName.length==0||fullName==null){
        res.status(400).send("No name has been entered")
      }else if(/\d/.test(fullName)){
        res.status(400).send("Name cannot contain numbers")  
      }else if(password!=passwordConfirm){
        res.status(400).send('Passwords must match')
      }else if(password.length < 5 || password.length > 10){
        res.status(400).send("The password's length must be between 5-10 characters")
      }else{
        await addNewUser(userObject)
        res.send('User registered successfully')
      }
    }catch(error){
      res.status(418).send("Error occured: " + error) 
    }
})
app.post('/api/store/all-products',async(req,res)=>{
  try{
    const products = await Product.find()
    res.json(products)
  }catch(err){
    res.status(500).send("Internal server error")
  }
})
app.post('/api/store/category-products',async(req,res)=>{
  try{
    const {category,searchInput} = req.body
    if(category=='allBox'){
      const products = await Product.find({name: new RegExp(searchInput,"i")})
      res.json(products)
    }else{
    const products = await Product.find({category: category,name: new RegExp(searchInput,"i")})
    res.json(products)
    }
  }catch(err){
    res.status(500).send("Internal server error")
  }
})

app.post('/api/store/add-to-cart',async(req,res)=>{
  try{
    const {productName,productPrice} = req.body
    const product = await Product.findOne({name: productName})
    const update = await User.findOne({email:req.session.email})
    if(update.inCart==null)
      update.inCart = 1
    else
      update.inCart=update.inCart+1
    update.order.push(product)
    const userName = await User.findOneAndUpdate({email: update.email},
                                                {inCart:update.inCart,order:update.order},
                                                {new: true})
    res.json(userName)
  }catch(err){
    res.status(500).send("Internal server error")
  }
})
app.post('/api/confirm-order',async(req,res)=>{
  try{
    const currentUser = await User.findOne({email: req.session.email})
    res.json(currentUser)
  }catch(err){
    res.status(500).send('Error occured: ' + error)
  }
})
app.post('/api/confirm-order/remove-product',async(req,res)=>{
  try{
    const {productName} = req.body
    const currentUser = await User.findOne({email: req.session.email})
    const updatedOrder = currentUser.order
    const index = updatedOrder.indexOf(updatedOrder.find(product=>(product.name==productName)))
    updatedOrder.splice(index,1)
    currentUser.inCart--
    await User.findOneAndUpdate({email: currentUser.email},
                                {inCart:currentUser.inCart,order:updatedOrder},
                                {new: true})
    res.send('success')
  }catch(err){
    res.status(500).send('Error occured: ' + err)
  }
})
app.post('/api/confirm-order/confirmed',async(req,res)=>{
  try{
    const currentUser = await User.findOne({email: req.session.email})
    const now = new Date()
    const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    const currentTime = {date: date,time: time}
    const {orderSum} = req.body
    const order = await new Order({
            recipientName: currentUser.fullName,
            recipientEmail: currentUser.email,
            order: currentUser.order,
            orderSum: orderSum,
            time: currentTime
    })

    await order.save()
    currentUser.order=[]
    currentUser.inCart=0
    await User.findOneAndUpdate({email:currentUser.email},
                                {order:currentUser.order,inCart:currentUser.inCart}
                                ,{new: true})
    res.send('Success')
  }catch(err){
    res.status(500).send('Error occured: ' + err)
  }
})

app.post('/api/sign-in',async (req,res)=>{
  try{
  const {emailInput,passwordInput}=req.body
  const result = await User.findOne({email: emailInput})
  if(result==null)
    res.status(404).send('Email not found')
  else if(result.password!==passwordInput)
    res.status(401).send('Incorrect password')
  else{
    if(result.admin==true)
      req.session.admin=true
    else
      req.session.admin=false
    req.session.isLoggedIn=true
    req.session.fullName=result.fullName
    req.session.email=result.email
    res.send(`Welcome ${result.fullName}`)
  }
  }catch(error){
    res.status(500).send('Error occured: ' + error)
  }
})
app.post('/api/is-logged-in',async(req,res)=>{
  if(req.session.isLoggedIn){
    const user = await User.findOne({fullName:req.session.fullName})
    res.json(user)
  }
  else
    res.status(418).send('not logged in')
})
app.post('/api/log-out',async(req,res)=>{
  req.session.destroy((err)=>{
    if(err)
      res.send(err)
    else
      res.send('Logged out successfully')
  })
})



app.listen(PORT, () => {
  console.log(`Server is live on http://localhost:${PORT}`);
});
