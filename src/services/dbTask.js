const {dbCollectionSet,getDbData,skeletonSchema,dummyEquivalent}=require('../mongoUtilities/dbDetails');
const dbConnect=require('./dbConnectService');
const collectionExistCheck=require('../mongoUtilities/collectionExistCheck.js');
const {errorConstants}=require('../constants');
var {ObjectId} = require('mongodb');

 class dbTask{    
    static preRunnerInsert(){
        return new Promise((resolve,reject)=>{
            function dbSetIterator(dbInd){
                if(dbInd>=dbCollectionSet.length){
                    resolve();
                    return;
                }
                let dbCollectionData=dbCollectionSet[dbInd];
                if(dbCollectionData.db){
                    let dbDetailsToConnect=getDbData(dbCollectionData.db);
                    dbConnect(dbDetailsToConnect,(dbClient)=>{
                        function collectionIterator(collInd){
                            if(collInd>=dbCollectionData.collectionList.length){
                                dbSetIterator(++dbInd);
                                return;
                            }
                            let collectionData=skeletonSchema(dbCollectionData.db,dbCollectionData.collectionList[collInd]);
                            collectionExistCheck(dbClient.db(dbDetailsToConnect.db_name),collectionData.collectionName,true,(resp)=>{
                                if(!(resp.status)){
                                    reject(errorConstants.errorCodeMsg+resp.errorCode);
                                }
                                else{
                                    let schemaString=JSON.stringify(collectionData.skeletonSchema);
                                    dbCollectionData.dataTypeSkeleton.map((dataType)=>{
                                        schemaString=schemaString.replace(new RegExp(dataType,'g'),dummyEquivalent(dataType));
                                    })
                                    dbClient.db(dbDetailsToConnect.db_name).collection(collectionData.collectionName).insertOne(JSON.parse(schemaString),(err,result)=>{
                                        if(err){
                                            reject(JSON.stringify(err));
                                            return;
                                        }
                                        else{
                                            collectionIterator(++collInd);
                                            return;
                                        }                                                     
                                    });                                
                                }
                                
                            })
                        }
                        collectionIterator(0);
                    })
                }
                else{
                    reject(errorConstants.dbDataEmptyMsg);
                }
            }
            dbSetIterator(0);        
        });       
    }
}
module.exports={dbTask};