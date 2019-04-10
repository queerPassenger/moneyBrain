const {getDbData,dbCollectionSet} = require('../mongoUtilities/dbDetails');
const dbConnect = require('../services/dbConnectService');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);
const { errorConstants } = require('../constants');

const getList = (collectionName,cb) => {
    try {
      dbConnect(dbDetailsToConnect, (dbClient) => {
          dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({},{_id:0}).toArray((err,result)=>{
              if(err){
                  console.log(errorConstants.getListFailure+'- '+collectionName);
                  return cb({
                      status:false,
                      msg:errorConstants.getListFailure
                  })
              }
              else{
                return cb({
                    status:true,
                    msg:'',
                    data:result
                })
              }
          })
              
      });
          
    } catch (error) {
      console.log(error);
    }
};
module.exports=getList
