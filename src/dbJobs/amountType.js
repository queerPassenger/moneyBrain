//Separate Runners;
const fetch = require("node-fetch");
const {getDbData,dbCollectionSet} = require('../mongoUtilities/dbDetails');
const dbConnect = require('../services/dbConnectService');
const dbCollectionData=dbCollectionSet[0];
const dbName=dbCollectionData.db;
const dbDetailsToConnect = getDbData(dbName);

const url = "https://gist.githubusercontent.com/Fluidbyte/2973986/raw/b0d1722b04b0a737aade2ce6e055263625a0b435/Common-Currency.json";


const convertJSON=json=>{
    let output=[];
    Object.keys(json).map((key,ind)=>{        
        let objInp=json[key];
        output.push(
            {
                amountTypeId:(ind+1),
                amountTypeNameAbbreviation:objInp.code,
                amountTypeName:objInp.name,
                amountSymbol:objInp.symbol,
                misc: []
            }
        );
    });
    return output;
}

const amountTypeJobRunner = async () => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    let dataToInsert=convertJSON(json);
    dbConnect(dbDetailsToConnect, (dbClient) => {
        dbClient.db(dbDetailsToConnect.db_name).collection('amountType').drop((err,result)=>{
            if(err){
                console.log('Error In removing amountType - dbJobs',err);
            }
            else{
                dbClient.db(dbDetailsToConnect.db_name).collection('amountType').insertMany(
                    dataToInsert,
                    (err,result)=>{
                        if(err){
                            console.log('Error In inserting amountType - dbJobs');
                        }
                        else{
                            console.log('Done  amountType - dbJobs');
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
module.exports=amountTypeJobRunner;