
const express = require('express');
const bodyParser = require('body-parser');
const newRecord=require('./src/services/newRecorder').utility;

// create the server
const app = express();

// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create the homepage route at '/'
app.get('/', (req, res) => {
  res.send(`You got home page!\n`)
})
app.post('/newrecord',(req,res)=>{
  newRecord(req.body,(resp)=>{
    res.send(resp);
  })
})
app.listen(3000, () => {
  console.log('Listening on localhost:3000')
})