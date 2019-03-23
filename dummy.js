const express = require("express");
const app=express();
const router = express.Router();

console.log(process.env);
app.use(router);

if(process.env.NODE_ENV==='production'){
  app.listen(8080);    
}