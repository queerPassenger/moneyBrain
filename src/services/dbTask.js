const { dbCollectionSet, getDbData, skeletonSchema, dummyEquivalent } = require('../mongoUtilities/dbDetails');
const dbConnect = require('./dbConnectService');
const collectionExistCheck = require('../mongoUtilities/collectionExistCheck.js');
const { errorConstants } = require('../constants');

class DbTask {
    
    /**
     * @param  {boolean} collectionCreateFlag
     * @param  {boolean} documentInsertFlag
     * @return {Promise}
     */
    static preRunnerInsert(collectionCreateFlag, documentInsertFlag) {
        return new Promise((resolve, reject) => {
            /* Iterating through each DB in dbDetails */
            function dbSetIterator(dbInd) {
                if (dbInd >= dbCollectionSet.length) {
                    resolve();
                    return;
                }
                let dbCollectionData = dbCollectionSet[dbInd];
                if (dbCollectionData.db) {
                    let dbDetailsToConnect = getDbData(dbCollectionData.db);
                    /* Establish connection DBClient Instance */
                    dbConnect(dbDetailsToConnect, (dbClient) => {
                        /* Iterating through each collection in the respective DB from dbDetails*/
                        function collectionIterator(collInd) {
                            if (collInd >= dbCollectionData.collectionList.length) {
                                /* If all collections in DB has finished iterating then move to next DB */
                                dbSetIterator(++dbInd);
                                return;
                            }
                            let collectionData = skeletonSchema(dbCollectionData.db, dbCollectionData.collectionList[collInd]);
                            /* Checking if collection exists and if not , create based on collectionCreateFlag */
                            collectionExistCheck(dbClient.db(dbDetailsToConnect.db_name), collectionData.collectionName, collectionCreateFlag, (resp) => {
                                if (!(resp.status)) {
                                    reject(errorConstants.errorCodeMsg + resp.errorCode);
                                }
                                else {
                                    /* if collection exists or is created now through collectionCreateFlag then insert Document based on documentInsertFlag */
                                    if(documentInsertFlag){
                                        let schemaString = JSON.stringify(collectionData.skeletonSchema);
                                        dbCollectionData.dataTypeSkeleton.map((dataType) => {
                                            schemaString = schemaString.replace(new RegExp(dataType, 'g'), dummyEquivalent(dataType));
                                        })
                                        dbClient.db(dbDetailsToConnect.db_name).collection(collectionData.collectionName).insertOne(JSON.parse(schemaString), (err, result) => {
                                            if (err) {
                                                reject(JSON.stringify(err));
                                                return;
                                            }
                                            else {
                                                collectionIterator(++collInd);
                                                return;
                                            }
                                        });
                                    }
                                    else{
                                        collectionIterator(++collInd);
                                        return;
                                    }
                                }

                            })
                        }
                        collectionIterator(0);
                    })
                }
                else {
                    reject(errorConstants.dbDataEmptyMsg);
                }
            }
            dbSetIterator(0);
        });
    }
}
module.exports = { DbTask };