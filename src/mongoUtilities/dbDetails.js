// Db,collection name used in Node js API .Not actual database,collection name in mongodB. Due to frequent alterations in the later 
const dbCollectionSet=[
    {
        db:'pouch',
        collectionList:[
            'transactionType',
            'amountType',
            'flag',
            'user',
            'transaction',           
            'errorLogs'
        ],
        dataTypeSkeleton:['dataType_object','dataType_array','dataType_string','dataType_number','dataType_date','dataType_ObjectId']
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
        case 'local':
            return {
                db_address: 'localhost',
                port_no: null,
                db_name: '',
            }
        default :
            return null
    }
}

function skeletonSchema(db, collection) {
    if (db === 'pouch'){
        switch (collection) {
            case 'user':
                return {
                    collectionName: 'user',
                    skeletonSchema: {
                        userId: 'dataType_ObjectId',
                        loginId:'dataType_string',
                        loginType:'dataType_string',
                        userName: 'dataType_string',
                        userEmail: 'dataType_string',
                        userInfo: {
                            age: 'dataType_number',
                            gender: 'dataType_string',
                            status: 'dataType_string',
                            photo:'dataType_string'
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
                        transactionTypeId: 'dataType_number',
                        transactionTypeName: 'dataType_string',
                        transactionClassification:'dataType_string',
                        misc: 'dataType_array'
                    }
                };

            case 'amountType':
                return {
                    collectionName: 'amountType',
                    skeletonSchema: {
                        amountTypeId: 'dataType_number',
                        amountTypeNameAbbreviation: 'dataType_string',
                        amountTypeName: 'dataType_string',
                        amountSymbol:'dataType_string',
                        misc: 'dataType_array'
                    }
                };
            case 'flag':
                return {
                    collectionName: 'flag',
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
function dummyEquivalent(type){
    switch(type){
        case 'dataType_object':
            return '{}';
        case 'dataType_array':
            return '[]';
        case 'dataType_string':
            return '';
        case 'dataType_number':
            return -1;
        case 'dataType_date':
            return null;
        case 'dataType_ObjectId':
            return '';
    }
}
module.exports = {dbCollectionSet,getDbData,skeletonSchema,dummyEquivalent}