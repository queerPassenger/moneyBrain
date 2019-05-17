const { getDbData, dbCollectionSet } = require('../mongoUtilities/dbDetails');
const dbConnect = require('../services/dbConnectService');
const dbCollectionData = dbCollectionSet[0];
const dbName = dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);
const { errorConstants } = require('../constants');
const ObjectID = require('mongodb').ObjectID;

const getUserInfo = (collectionName, queryObj, cb) => {
  try {
    dbConnect(dbDetailsToConnect, (dbClient) => {
      dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({ userId: queryObj.id }).toArray((err, result) => {
        if (err) {
          return cb({
            status: false,
            msg: errorConstants.getUserInfo
          })
        }
        else {
          return cb({
            status: true,
            msg: '',
            data: result.map(data => {
              return {
                name: data.userName,
                photo: data.userInfo.photo
              }
            })[0]
          })
        }
      })
    });

  } catch (error) {
    console.log(error);
    return cb({
      status: false,
      msg: errorConstants.getUserInfo
    })
  }
}

const getList = (collectionName, cb) => {
  try {
    dbConnect(dbDetailsToConnect, (dbClient) => {
      dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({}, { _id: 0 }).toArray((err, result) => {
        if (err) {
          console.log(errorConstants.getListFailure + '- ' + collectionName);
          return cb({
            status: false,
            msg: errorConstants.getListFailure
          })
        }
        else {
          return cb({
            status: true,
            msg: '',
            data: result
          })
        }
      })

    });

  } catch (error) {
    console.log(error);
    return cb({
      status: false,
      msg: errorConstants.getListFailure
    })
  }
};
const createTransaction = (collectionName, queryObj, payload, cb) => {
  try {
    payload.map((data) => {
      data['userId'] = queryObj.id;
      data['createdTimeStamp'] = new Date(data['createdTimeStamp']);
      data['timeStamp'] = new Date(data['timeStamp']);
      let objId = new ObjectID();
      data['transactionId'] = objId.toString();
    });
    dbConnect(dbDetailsToConnect, (dbClient) => {
      dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).insertMany(payload, (err, result) => {
        if (err) {
          return cb({
            status: false,
            msg: errorConstants.createTransactionFailure
          })
        }
        else {
          return cb({
            status: true,
            msg: 'Successfully Recorded',

          })
        }
      })

    });

  }
  catch (error) {
    console.log(error);
    cb({
      status: false,
      msg: errorConstants.createTransactionFailure
    })
  }
}
const getTransaction = (collectionName, queryObj, payload, cb) => {
  try {
    dbConnect(dbDetailsToConnect, (dbClient) => {
      dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).find({ $and: [{ userId: queryObj.id }, { 'timeStamp': { $gte: new Date(payload.fromDate), $lte: new Date(payload.toDate) } }] }).sort({ "timeStamp": 1 }).toArray((err, result) => {
        if (err) {
          return cb({
            status: false,
            msg: errorConstants.getTransaction
          })
        }
        else {
          return cb({
            status: true,
            msg: '',
            data: result.map(data => {
              return {
                amount: data.amount,
                amountTypeId: data.amountTypeId,
                comment: data.comment,
                createdTimeStamp: data.createdTimeStamp,
                lastUpdatedTimeStamp: data.lastUpdatedTimeStamp,
                timeStamp: data.timeStamp,
                transactionId: data.transactionId,
                transactionTypeId: data.transactionTypeId,
              }
            })
          })
        }
      })

    });

  } catch (error) {
    console.log(error);
    cb({
      status: false,
      msg: errorConstants.getTransaction
    })
  }
}

const updateTransaction = (collectionName, queryObj, payload, cb) => {
  dbConnect(dbDetailsToConnect, (dbClient) => {
    updateOne(0);
    let failedTypes=[];
    function updateOne(ind) {
      payload[ind]['lastUpdatedTimeStamp'] = new Date(data['createdTimeStamp']);
      let obj = {
        lastUpdatedTimeStamp: payload[ind]['lastUpdatedTimeStamp'],
        transactionTypeId: payload[ind]['transactionTypeId'],
        timeStamp: new Date(payload[ind]['timeStamp']),
        comment: payload[ind]['comment'],
        amount: payload[ind]['amount'],
        amountTypeId: payload[ind]['amountTypeId']
      };
      dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).update({ userId: queryObj.id, transactionId: obj['transactioinId'] },obj, (err, result) => {
        if (err) {
          failedTypes.push(payload[ind]);
        }
        else {
          if(ind<payload.length){
            updateOne(++ind);
          }
          else{
            if(failedTypes.length===0){
              return cb({
                  status: true,
                  msg: 'Update Successfully',
                  data: []
              })
            }
            else{
              return cb({
                status: true,
                msg: 'Failed to update the following',
                data: failedTypes
            })
            }
          }
        }
      })
    }
  });
}
module.exports = {
  getList,
  createTransaction,
  getTransaction,
  getUserInfo,
  updateTransaction
}
