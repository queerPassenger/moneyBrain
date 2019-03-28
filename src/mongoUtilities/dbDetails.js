// Db,collection name used in Node js API .Not actual database,collection name in mongodB. Due to frequent alterations in the later 
const dbCollectionSet=[
    {
        db:'pouch',
        collectionList:[
            'user',
            'transaction',
            'transactionType',
            'amountType',
            'flagId',
            'errorLogs'
        ]
    }
]
function getDbData(key) {
    switch (key) {
        case 'pouch':
            return {
                db_address: 'ds053894.mlab.com',
                port_no: 53894,
                db_name: 'pouch',
                username: 'dbUser',
                password: 'dbUser123',
            }
        default:
            return {
                db_address: 'localhost',
                port_no: null,
                db_name: '',
                collection: {

                }
            }
    }
}

function skeletonSchema(db, collection) {
    if (db === 'pouch'){
        switch (collection) {
            case 'user':
                return {
                    collectionName: 'userTable',
                    skeletonSchema: {
                        userId: 'dataType_ObjectId',
                        userName: 'dataType_string',
                        userEmail: 'dataType_string',
                        userInfo: {
                            age: 'dataType_number',
                            gender: 'dataType_string',
                            status: 'dataType_string'
                        },
                        misc: 'dataType_array'
                    }
                };
            case 'transaction':
                return {
                    collectionName: 'transaction',
                    skeletonSchema: {
                        transactionId: 'dataType_ObjectId',
                        createdTimeStamp: 'dataType_date',
                        lastUpdatedTimeStamp: 'dataType_date',
                        transactionTypeId: 'dataType_ObjectId',
                        comment: 'dataType_string',
                        amount: 'dataType_number',
                        amountTypeId: 'dataType_ObjectId',
                        userId: 'dataType_ObjectId',
                        flagId: 'dataType_ObjectId',
                        misc: 'dataType_array'
                    }
                };
            case 'transactionType':
                return {
                    collectionName: 'transactionType',
                    skeletonSchema: {
                        transactionTypeId: 'dataType_ObjectId',
                        transactionTypeName: 'dataType_string',
                        misc: 'dataType_array'
                    }
                };

            case 'amountType':
                return {
                    collectionName: 'amountType',
                    skeletonSchema: {
                        amountTypeId: 'dataType_ObjectId',
                        amountTypeNameAbbreviation: 'dataType_string',
                        amountTypeName: 'dataType_string',
                        misc: 'dataType_array'
                    }
                };
            case 'flagId':
                return {
                    collectionName: 'flagId',
                    skeletonSchema: {
                        flagId: 'dataType_ObjectId',
                        flagName: 'dataType_string',
                        misc: 'dataType_array'
                    }
                };
            case 'errorLogs':
                return {
                    collectionName: 'errorLogs',
                    skeletonSchema: {
                        errorLogId: 'dataType_ObjectId',
                        errorObj: 'dataTye_object',
                        errorMsg: 'dataType_string',
                        misc: 'dataType_array',
                        userId: 'dataType_ObjectId'
                    }
                };
            default:
                return{
                    collectionName:'',
                    skeletonSchema:{
                        
                    }
                }
        }
    }
}
module.exports = {dbCollectionSet,getDbData,skeletonSchema}