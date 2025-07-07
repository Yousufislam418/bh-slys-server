const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3003;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const Visitors = require('./models/visitors');
const User = require('./models/users');

app.get('/', async(req,res)=> {
    res.send('bh-slys-server is online');
});

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
// POST : users data
app.post('/users', async(req,res)=> {
 try{
  const {name,email,number,password,location,age,image,date} = req.body;
  const newUser = new User({name,email,number,password,location,age,image,date});
  const result = await newUser.save();
  res.status(201).json(result).send(result);
 }catch(error){
  res.status(500).json({error: 'Unsuccessfully'});
 }
});
// READ : GET all users
app.get('/users', async(req,res)=> {
 try{
  const users = await User.find();
  res.json(users).send(users);
 }catch(error){
  res.status(500).json({error: 'User get failed'});
 }
});
// READ : GET one user
app.get('/users/:id', async(req,res)=> {
 try{
  const user = await User.findById(req.params.id);
  if(!user) return res.status(404).send('User not found');
  res.json(user).send(user);
 }catch(error){
  res.status(500).send(error);
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
