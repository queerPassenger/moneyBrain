
const express = require('express');
const bodyParser = require('body-parser');
const {DbTask}=require('./src/services/dbTask');

// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

require('./routes')(app);

function enableAppToListen(){
  app.listen(3000, () => {
    console.log('Listening on localhost:3000')
  })
}
console.log('Running Pre Runner Task');
DbTask.preRunnerInsert(true,false)
.then(()=>{
  enableAppToListen();
})
.catch((err)=>{
  throw err;
})