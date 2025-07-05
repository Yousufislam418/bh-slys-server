const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3003;
const cors = require('cors');
require('dotenv').config();
app.use(cors());
app.use(express.json());

const Visitors = require('./models/visitors');

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
})


//------------------------------------------------------------>


app.listen(port, ()=> {
    console.log('bh-slys-server is Running on Port '+ port); 
});
