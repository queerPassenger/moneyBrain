const {getDbData,dbCollectionSet,skeletonSchema, dummyEquivalent} = require('../mongoUtilities/dbDetails');
const dbConnect = require('./dbConnectService');
const { errorConstants } = require('../constants');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);
const ObjectID = require('mongodb').ObjectID;

class GoogleLoginController{    
    /**
     * @param {Object} queryObj
     * @param {boolean} createFlag
     * @return {Promise}
     */
    static getUserIdFromLoginId(queryObj){
        return new Promise((resolve,reject)=>{   
            dbConnect(dbDetailsToConnect, (dbClient) => {
                let query= {loginId:queryObj.id};
                dbClient.db(dbDetailsToConnect.db_name).collection('user').findOne(query,{projection:{userId:1}},(err, result)=>{
                    if(err){
                        reject(errorConstants.getUserIdFailed);
                    }
                    else{
                        if(result===null){
                            const createNewUserHandler=GoogleLoginController.createNewUser(queryObj); 
                            createNewUserHandler
                            .then((userId)=>{
                                resolve(userId);
                            })
                            .catch((err)=>{
                                reject(err)
                            })
                        }
                        else{
                            console.log(result);
                            resolve(result.userId)
                        }
                    }
                });
            })
        });

    }
    static checkUserIdExist(queryObj){
        return new Promise((resolve,reject)=>{   
            let query={userId:queryObj.id};
            dbConnect(dbDetailsToConnect, (dbClient) => {
                dbClient.db(dbDetailsToConnect.db_name).collection('user').findOne(query,{projection:{userId:1}},(err, result)=>{
                   if(err){
                        reject(errorConstants.findUserFailedMsg);
                    }
                    else{
                        if(result===null){                           
                            reject(errorConstants.userIdNotFoundMsg);                            
                        }
                        else{
                            console.log(result.userId);
                            resolve('User exist');
                        }
                            
                    }
                })
            })
        })
    }

    static createNewUser(profile){
        return new Promise((resolve,reject)=>{
            if(profile.provider==='google' && profile.id && profile.displayName && profile.photos && profile.photos[0] && profile.photos[0].value){
                let schemaString =JSON.stringify(skeletonSchema(dbName,'user').skeletonSchema);
                dbCollectionData.dataTypeSkeleton.map((dataType) => {
                    schemaString = schemaString.replace(new RegExp(dataType, 'g'), dummyEquivalent(dataType));
                });
                let objId=new ObjectID();
                let userSchema=JSON.parse(schemaString);                
                userSchema.userId=objId.toString();
                userSchema.loginType=profile.provider;
                userSchema.loginId=profile.id;
                userSchema.userName=profile.displayName;
                userSchema.userInfo.photo=profile.photos[0].value;
                dbConnect(dbDetailsToConnect, (dbClient) => {
                    dbClient.db(dbDetailsToConnect.db_name).collection('user').updateOne(
                        { loginId:  userSchema.loginId},
                        {$set:userSchema},
                        { upsert: true },
                        (err,result)=>{
                            if(err){
                                reject(errorConstants.createNewUserFailedMsg)
                            }
                            else{
                                resolve(userSchema.userId);
                            }
                        }
                    )
                })
            }
            else{
                reject(errorConstants.createNewUserFailedMsg)
            }
           
        });
    }
}
module.exports = GoogleLoginController;