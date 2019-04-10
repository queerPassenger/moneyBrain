//Separate Runners;

const {getDbData,dbCollectionSet} = require('../mongoUtilities/dbDetails');
const dbConnect = require('../services/dbConnectService');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);


const transactionTypeJobRunner = async () => {
  try {
    let dataToInsert=require('./transactionTypeJSON.json');
    dbConnect(dbDetailsToConnect, (dbClient) => {
        dbClient.db(dbDetailsToConnect.db_name).collection('transactionType').drop((err,result)=>{
            if(err){
                console.log('Error In removing transactionType - dbJobs',err);
            }
            else{
                dbClient.db(dbDetailsToConnect.db_name).collection('transactionType').insertMany(
                    dataToInsert,
                    (err,result)=>{
                        if(err){
                            console.log('Error In inserting transactionType - dbJobs');
                        }
                        else{
                            console.log('Done  transactionType - dbJobs');
                        }
                    }
                )
            }
        })
            
    });
        
  } catch (error) {
    console.log(error);
  }
};
module.exports=transactionTypeJobRunner;