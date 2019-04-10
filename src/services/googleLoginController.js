const {getDbData,dbCollectionSet,skeletonSchema, dummyEquivalent} = require('../mongoUtilities/dbDetails');
const dbConnect = require('./dbConnectService');
const { errorConstants } = require('../constants');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);

class GoogleLoginController{    
    /**
     * @param {Object} profile
     * @return {Promise}
     */
    static checkUserExist(profile,createFlag){
        return new Promise((resolve,reject)=>{           
            dbConnect(dbDetailsToConnect, (dbClient) => {
                dbClient.db(dbDetailsToConnect.db_name).collection('user').findOne({loginId:profile.id},{projection:{userId:1,_id:0}},(err, result)=>{
                   if(err){
                        reject(errorConstants.findUserFailedMsg);
                    }
                    else{
                        if(result===null){
                            if(createFlag){
                                const createNewUserHandler=GoogleLoginController.createNewUser(profile); 
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
                        else
                            resolve('User already exists');
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
                })
                let userSchema=JSON.parse(schemaString);
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
                                console.log('Error is   ',err);
                                reject(errorConstants.createNewUserFailedMsg)
                            }
                            else{
                                resolve('User registered successfully');
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