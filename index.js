
const express = require('express');
const bodyParser = require('body-parser');
const {DbTask}=require('./src/services/dbTask');

// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

require('./routes')(app);
let port =process.env.PORT || 3000 ;
function enableAppToListen(){
  app.listen(port, () => {
    console.log('Listening on localhost:'+port);
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