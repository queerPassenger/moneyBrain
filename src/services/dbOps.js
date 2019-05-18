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
  try {
    dbConnect(dbDetailsToConnect, (dbClient) => {
      updateOne(0);
      let failureList=[];
      let successList=[];
      function updateOne(ind) {
        dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).updateOne({$and:[{ userId: queryObj.id},{transactionId:payload[ind]['transactionId']}]},
        {$set:{
          lastUpdatedTimeStamp:new Date(payload[ind]['lastUpdatedTimeStamp']),
          transactionTypeId: payload[ind]['transactionTypeId'],
          timeStamp: new Date(payload[ind]['timeStamp']),
          comment: payload[ind]['comment'],
          amount: payload[ind]['amount'],
          amountTypeId: payload[ind]['amountTypeId']
        }},{ upsert: false },(err, result) => {
          if (err) {
            failureList.push(payload[ind]['transactionId']);
          }
          else{
            successList.push(payload[ind]['transactionId'])
          }
          
          if(ind<(payload.length-1)){
            //Recursive
            updateOne(++ind);
          }
          else{
            if(failureList.length===0){
              return cb({
                  status: true,
                  msg: 'Update Successfully',
                  data: {successList,failureList}
              })
            }
            else{
              return cb({
                status: true,
                msg: errorConstants.updateTransactionFailure,
                data: {failureList,successList}
            })
            }
          }
        })
      }
    });
  }
  catch(err){
    console.log(err);
    cb({
      status: false,
      msg: errorConstants.updateTransactionFailure
    })
  }
}

const deleteTransaction= (collectionName, queryObj, payload, cb) => {
  try {
    dbConnect(dbDetailsToConnect, (dbClient) => {
      deleteOne(0);
      let failureList=[];
      let successList=[];
      function deleteOne(ind) {
        dbClient.db(dbDetailsToConnect.db_name).collection(collectionName).deleteOne({$and:[{ userId: queryObj.id},{transactionId:payload[ind]['transactionId']}]},(err, result) => {
          if (err) {
            failureList.push(payload[ind]['transactionId']);
          }
          else{
            successList.push(payload[ind]['transactionId'])
          }
          
          if(ind<(payload.length-1)){
            //Recursive
            deleteOne(++ind);
          }
          else{
            if(failureList.length===0){
              return cb({
                  status: true,
                  msg: 'Delete Successfully',
                  data: {successList,failureList}
              })
            }
            else{
              return cb({
                status: true,
                msg: errorConstants.deleteTransactionFailure,
                data: {failureList,successList}
            })
            }
          }
        })
      }
    });
  }
  catch(err){
    console.log(err);
    cb({
      status: false,
      msg: errorConstants.deleteTransactionFailure
    })
  }
}
module.exports = {
  getList,
  createTransaction,
  getTransaction,
  getUserInfo,
  updateTransaction,
  deleteTransaction
}
