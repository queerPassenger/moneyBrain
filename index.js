const express = require("express");
const app=express();
const authenticate=require('./authenticate');


const router = express.Router();

router.get('/',function(req,res,next){
    if(authenticate.validateUser(req)){
        console.log('User authenticated',req.path);
        next();
    }        
    else    
        res.send('Unauthorized User');
});
router.get('/loaddata',function(req,res,next){
    console.log('User authenticated in loaddata');
    res.send('All is well')
});
app.use('/*',router);
require('./enviroment')(app);