const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3003;
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const Visitors = require('./models/visitors');
const User = require('./models/users');

app.get('/', async(req,res)=> {
    res.send('bh-slys-server is online');
});

//----------------Token Verify------------------------------------------->
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });
  try {
    const verified = jwt.verify(token, process.env.SECRET_TOKEN);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true, 
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB Connected is Successfully'));

//------------------------------------------------------------>
// GET : visitors data
app.get('/visitors', async(req,res)=> { 
  try{
    const visitorsData = await Visitors.find();
    res.json(visitorsData).send(visitorsData);
  }catch(err){
    res.status(err);
  }
});
// UPDATE : visitors data
app.put('/visitors/:id', async(req,res)=> {
  try{
    const id = req.params.id;
    const datas = req.body;
    const updateVisitors = await Visitors.findByIdAndUpdate(id, datas,{new: true});
    res.json(updateVisitors).send(updateVisitors);
  }catch(err){
    res.send(err);
  }
});

//----------------------------------> users start
// Register
app.post('/register', async(req,res)=>{
  const userDatas = req.body;
  const {email,password} = userDatas;
  const existingUser = await User.findOne({email});
 const hashPassword = await bcrypt.hash(password, 10);
 try{
   if(existingUser){
    return res.status(400).json({error: 'User already create'});
   }else{
    const users = new User({...userDatas, password: hashPassword});
    const result = await users.save();  
    res.status(201).json(result);
   }
 }catch(err){
   res.status(403).json({error: err});
 }
});

// Login
app.post('/login', async(req,res)=>{
  const {email,password} = req.body;
  const user = await User.findOne({email});
  if(!user || !(await bcrypt.compare(password, user.password))){
    return res.status(401).json({error: 'invalid credentials'});
  }else{
    const token = jwt.sign({userId: user._id}, process.env.SECRET_TOKEN, {expiresIn: "30d"});
    res.status(200).json({token}); 
 }
});

// profile
app.get('/profile', verifyToken, async(req,res)=>{
 try{
  const user = await User.findById(req.user.userId).select('-password');
  res.json(user);
 }catch(err){
   res.status(403).json({error: 'Invalid token'});
 }
});

// Get All Users : Match Token
app.get('/users',verifyToken, async(req,res)=>{
 try{
    const user = await User.find().select('-password');
  res.json(user);
 }catch(err){
   res.status(403).json({error: 'Invalid token'});
 }
}); 

// Get one user : using id
app.get('/users/:id',verifyToken, async(req,res)=>{
 try{
    const user = await User.findById(req.params.id);
  res.json(user);
 }catch(err){
   res.status(403).json({error: 'Invalid token'});
 }
});

// UPDATE : PUT user update
app.put('/users/:id', async(req,res)=> {
 try{
  const id = req.params.id;
  const datas = req.body;   
  const result = await User.findByIdAndUpdate(id, datas, {new: true});
  res.json(result).send(result); 
 }catch(error){
  res.status(500).send(error);
 }
});

// UPDATE PASSWORD : PUT user password update
app.put('/users-pass/:id', async(req,res)=> {
 try{
  const id = req.params.id;
  const datas = req.body;
  const newPass = datas.password;
  const hashPassword = await bcrypt.hash(newPass, 10);
  const result = await User.findByIdAndUpdate(id, {password:hashPassword}, {new: true});
  res.json(result); 
 }catch(error){
  res.status(500).send(error);
 }
});

// DELETE : one user delete
app.delete('/users/:id', async(req,res)=> {
 try{
  const id = req.params.id;
  const result = await User.findByIdAndDelete(id);
  res.json(result).send(result);
 }catch(error){
  res.status(500).send(error);
 }
});

//----------------------------------> users end


//------------------------------------------------------------>

app.listen(port, ()=> {
    console.log('bh-slys-server is Running on Port '+ port); 
});
