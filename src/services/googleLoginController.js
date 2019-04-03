const {getDbData,dbCollectionSet} = require('../mongoUtilities/dbDetails');
const dbConnect = require('./dbConnectService');
const { errorConstants } = require('../constants');
const dbName=dbCollectionSet[0].db;
const dbDetailsToConnect = getDbData(dbName);

class GoogleLoginController{    
    /**
     * @param {Object} profile
     * @return {Promise}
     */
    static checkUserExist(profile){
        return new Promise((resolve,reject)=>{
           
            dbConnect(dbDetailsToConnect, (dbClient) => {
                dbClient.db(dbDetailsToConnect.db_name).collection('user').findOne({loginId:profile.id},{projection:{userId:1,_id:0}},(err, result)=>{
                   if(err){
                        reject(errorConstants.findUserFailedMsg);
                    }
                    else{
                        return GoogleLoginController.createNewUser(profile);
                        resolve(result);
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
                

            }
            else{
                reject(errorConstants.createNewUserFailedMsg)
            }
           
        });
    }
}
module.exports = { GoogleLoginController };