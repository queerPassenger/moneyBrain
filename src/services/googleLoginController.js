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
    static checkUserExist(queryObj,createFlag){
        return new Promise((resolve,reject)=>{   
            // {userId:queryObj.id} For all req
            // {loginId:queryObj.id} For Create req
            let query;
            if(createFlag){
                query={loginId:queryObj.id};
            }
            else{
                query={userId:queryObj.id};
            }
            console.log('query',query)
            dbConnect(dbDetailsToConnect, (dbClient) => {
                dbClient.db(dbDetailsToConnect.db_name).collection('user').findOne(query,{projection:{userId:1,_id:0}},(err, result)=>{
                   if(err){
                        reject(errorConstants.findUserFailedMsg);
                    }
                    else{
                        console.log('result',result);   
                        if(result===null){
                            if(createFlag){
                                const createNewUserHandler=GoogleLoginController.createNewUser(queryObj); 
                                createNewUserHandler
                                .then((status)=>{
                                    resolve(status);
                                })
                                .catch((err)=>{
                                    reject(err)
                                })
                            }
                            else{
                                reject(errorConstants.userNotFoundMsg)
                            }
                        }
                        else{
                            if(createFlag)
                                reject('User already exists')
                            else
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