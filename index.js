
const express = require('express');
const bodyParser = require('body-parser');
const {DbTask}=require('./src/services/dbTask');
const {GoogleLoginController}=require('./src/services/googleLoginController');


// create the server
const app = express();
// add & configure middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// create the homepage route at '/'
app.get('/', (req, res) => {
  let profile={"id":"1096606541659894762190","displayName":"Allan Valooran","name":{"familyName":"Valooran","givenName":"Allan"},"photos":[{"value":"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg"}],"provider":"google","_raw":"{\n \"kind\": \"plus#person\",\n \"etag\": \"\\\"4DZKD8nJom0F9AKh7PGs_B0kK-A/rVrqj1CF9WOC66lJSJz5rVu2WiM\\\"\",\n \"id\": \"109660654165989476219\",\n \"displayName\": \"Allan Valooran\",\n \"name\": {\n  \"familyName\": \"Valooran\",\n  \"givenName\": \"Allan\"\n },\n \"image\": {\n  \"url\": \"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg\",\n  \"isDefault\": true\n },\n \"language\": \"en_GB\"\n}\n","_json":{"kind":"plus#person","etag":"\"4DZKD8nJom0F9AKh7PGs_B0kK-A/rVrqj1CF9WOC66lJSJz5rVu2WiM\"","id":"109660654165989476219","displayName":"Allan Valooran","name":{"familyName":"Valooran","givenName":"Allan"},"image":{"url":"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg","isDefault":true},"language":"en_GB"}};
  GoogleLoginController.checkUserExist(profile)
  .then(result=>{
    console.log('result',result);
    res.send(result);
  })
  .catch(err=>{
    res.send(err);
  })
  
});

function enableAppToListen(){
  app.listen(3000, () => {
    console.log('Listening on localhost:3000')
  })
}
DbTask.preRunnerInsert(true,true)
.then(()=>{
  enableAppToListen();
})
.catch((err)=>{
  throw err;
})