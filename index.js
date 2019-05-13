
const express = require('express');
const bodyParser = require('body-parser');
const {DbTask}=require('./src/services/dbTask');
const getProperties=require('./properties').getProperties;

// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

require('./routes')(app);

function enableAppToListen(){
  app.listen(getProperties('port'), () => {
    console.log('Server started at '+getProperties('port'));
  })
}
DbTask.preRunnerInsert(true,false)
.then(()=>{
  enableAppToListen();
})
.catch((err)=>{
  throw err;
})