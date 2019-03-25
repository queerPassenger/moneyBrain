const mongoConnection=require('./mongoConnector.js');
const util=require('../jsUtilities/util');

function formConnectionUrl(dbDetails){
  let output={
    status:false,
    connectUrl:'mongodb://'
  }  
  if(util.has_Keys(dbDetails,['username','password','db_address','port_no','db_name'])){
    output.status=true;
    output.connectUrl+=dbDetails.username+':'+dbDetails.password+'@'+dbDetails.db_address+':'+dbDetails.port_no+'/'+dbDetails.db_name;
  }
  else if(util.has_Keys(dbDetails,['db_address','port_no','db_name'])){
    output.status=true;
    output.connectUrl+=dbDetails.db_address+':'+dbDetails.port_no+'/'+dbDetails.db_name;
  }
  return output;
}
const connectDB=function(dbDetails,callback){
  let temp=formConnectionUrl(dbDetails);
  if(!(temp.status)){
    let json={};
    json.status=false;
    json.data='dB Connect Url Error';
    json.errorCode=20;
    json.dataType='string';
    callback(json);
    return;
  }    
  mongoConnection.createConnection(temp.connectUrl,function(err,client){
  	if(err){
      let json={};
      json.status=false;
      json.data='Error @ connectDB createConnection';
      json.errorCode=12;
      json.dataType='string';
      callback(json);
      return;
  	}
  	else{
      let json={};
      json.status=true;
      json.data=client;
      json.dataType='db';
      callback(json);
      return;
    }
  });
}

module.exports=connectDB;
