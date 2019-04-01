
const express = require('express');
const bodyParser = require('body-parser');
const {dbTask}=require('./src/services/dbTask');


// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create the homepage route at '/'
app.get('/', (req, res) => {
  res.send(`You got home page!\n`)
});

function enableAppToListen(){
  app.listen(3000, () => {
    console.log('Listening on localhost:3000')
  })
}
dbTask.preRunnerInsert()
.then(()=>{
  enableAppToListen();
})
.catch((err)=>{
  throw err;
})