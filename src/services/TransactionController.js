const connectDB=require('../mongoUtilities/connectDB.js');
const collectionExistCheck=require('../mongoUtilities/collectionExistCheck.js');
const dbDetails=require('../mongoUtilities/dbDetails').getDbData('pouch');

class TransactionController{
    constructor(props){
        this.dbClient;        
    }
    static connect(cb){
        connectDB(dbDetails,(resp)=>{
            if(!(resp.status)){
                this.errorLogs(resp);
                this.dbClient=null;
                cb({
                    status:false,
                    message:'Failed to connect'
                });
                return;
            }
            else
                this.dbClient=resp.data;   
                cb({
                    status:true,
                    message:'Connected successfully'
                }); 
                return;           
        })
    }    
    static errorLogs(resp){
        let obj={
            timeStamp:new Date().toString(),
            message:resp
        }
        this.dbClient.db(dbDetails.db_name).collection(dbDetails.collection['error']).insertOne(obj,(err,result)=>{
            if(err)
               console.log('Error in Logging error: error message ',resp);
                         
        })
    }
    static getList(payload,cb){
        collectionExistCheck(this.dbClient.db(dbDetails.db_name),dbDetails.collection['transaction'].collectionName,false,(resp)=>{
            if(!(resp.status)){
                this.errorLogs(resp);
                cb([])
            }
            else{
                this.dbClient.db(dbDetails.db_name).collection(dbDetails.collection['transaction'].collectionName).aggregate([
                    { "$project": {
                        "_id": 0,
                        "key":"$_id",
                        "timeStamp":"$timeStamp",
                        "data":"$date",
                        "type":"$type",
                        "comment":"$comment",
                        "amount":"$amount",
                        "amountType":"$amountType",
                        "remainder":"$remainder",
                        "user":"$user",
                        "userId":"$userId",
                    }}
                ]).toArray((err, result)=>{
                    if(err){
                        this.errorLogs(resp);
                        cb([]);
                    }
                    else{
                        cb(result);
                    }
                  });
            }
        })
    }
    static insertNewOne(data,cb){
        let obj={
           timeStamp:new Date().toString(),
           date:data.date,
           type:data.type,
           comment:data.comment,
           amount:data.amount,
           amountType:data.amountType,
           remainder:data.remaider,
           userId:data.userId
        }
        this.dbClient.db(dbDetails.db_name).collection(dbDetails.collection['transaction'].collectionName).insertOne(obj,(err,result)=>{
            if(err){
                this.errorLogs(err);
                cb({
                    status:false,
                    message:''
                });
                return;
            }
            else{
                cb({
                    status:true,
                    message:''
                });
                return;
            }
                         
        })
    }
    
}
module.exports={TransactionController};