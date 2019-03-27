
const express = require('express');
const bodyParser = require('body-parser');
const TransactionUtility=require('./src/services/TransactionUtility');
const TransactionController=require('./src/services/TransactionController').TransactionController;
//Initiate Connection to MongoDB


// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create the homepage route at '/'
app.get('/', (req, res) => {
  res.send(`You got home page!\n`)
});
app.post('/insertNewTransaction',(req,res)=>{
  TransactionUtility.insertNewOne(req.body,(resp)=>{   
    res.send(resp);
  })
});
app.get('/getTransactionList',(req,res)=>{
  TransactionUtility.getList(req.body,(resp)=>{   
    res.send(resp);
  })
})


TransactionController.connect((resp)=>{
  if(resp.status){
    console.log(resp.message);
    app.listen(3000, () => {
      console.log('Listening on localhost:3000')
    })
  }
  else
    console.error(resp.message);
});