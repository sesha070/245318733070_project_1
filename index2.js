const express = require('express');
const app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');
const url='mongodb://127.0.0.1:27017';
const dbn='HospitalInventory';
let db
MongoClient.connect(url,{ useUnifiedTopology:true } ,(err,client) =>
{
    if(err) return console.log(err);
    db=client.db(dbn);
    console.log('connected to database:'+url);
    console.log('database : '+dbn);
});

app.get('/Hospital', middleware.checkToken, function(req, res) {
    var da= db.collection("Hospital").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of hospital',da);
  });

  app.get('/Ventilators',middleware.checkToken, function(req, res) {
    var da= db.collection("Ventilators").find().toArray()
    .then(result=>  res.json(result));
    console.log('fetching details of Ventilator',da);
  });

app.post('/searchventilators',middleware.checkToken, (req,res) =>{
      var status=req.body.status;
      console.log(status);
      var Ventilatordetails=db.collection('Ventilators')
      .find({"status": status}).toArray().then(result=>res.json(result));
});
app.post('/searchventilatorn',middleware.checkToken,(req,res) => {
  var name=req.query.name;
  console.log(name);
  var Ventilatordetails= db.collection('Ventilators')
  .find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});
app.put('/update',middleware.checkToken,(req,res) => {
  var ventid={vId: req.body.vId};
  console.log(ventid);
  var newvalues={ $set :{ status:req.body.status}};
  db.collections("Ventilators").updateOne(ventid,newvalues,function(err,result){
    res.json('1 document updated');
  });
});
app.post('/add',middleware.checkToken,(req,res)=>{
  var hId=req.body.hId;
  var vId=req.body.vId;
  var status=req.body.status;
  var name=req.body.name;
  var item={
    hId:hId,vId:vId,status:status,name:name
  };
  db.collection('Ventilators').insertOne(item,function(err,result){
    res.json('Item inserted');
  });

});
app.delete('/delete',middleware.checkToken,(req,res)=>{
  var myquery=req.query.vId;
  console.log(myquery);
  var myquery1={ vId: myquery};
  db.collection('Ventilators').deleteOne(myquery1,function(err,obj)
    {
      res.json("1 document deleted");
    });
});
app.listen(1100);