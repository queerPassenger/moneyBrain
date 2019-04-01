const connectDB=require('../mongoUtilities/connectDB.js');
const {errorConstants}=require('../constants'); 

const dbConnect=(function (){
    let dbClient;
    return function (dbDetails,cb){
        if(dbClient){
            cb(dbClient);
        }
        else{
            connectDB(dbDetails,(resp)=>{
                if(!(resp.status))
                    throw errorConstants.dbConnectFailedMsg;                
                else{
                    cb(dbClient=resp.data);
                }         
            })
        }
        
    }
})();

module.exports=dbConnect;