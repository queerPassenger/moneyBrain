const createCollection=require('./createCollection.js');

const collectionExistCheck=function(dbInstance,collectionName,createIt,callback){
  let count=0;
  dbInstance.listCollections().toArray(function(err, collInfos) {
      if(err){
        let jsonIntermediate={};
        jsonIntermediate.status=false;
        jsonIntermediate.data='collectionExistCheck err';
        jsonIntermediate.errorCode=1;
        callback(jsonIntermediate);
        return;
      }
      else{
        collInfos.map((obj,ind)=>{
          if(obj.name===collectionName){
            count++;
          }
        })
        if(count===0 && createIt===false){
          let jsonIntermediate={};
          jsonIntermediate.status=false;
          jsonIntermediate.data='collectionExistCheck no collection exists';
          jsonIntermediate.errorCode=2;
          callback(jsonIntermediate);
          return;
        }
        else if(count===0 && createIt===true){
          createCollection(dbInstance,collectionName,function(output){
            if(!output.status){
              let jsonIntermediate={};
              jsonIntermediate.status=false;
              jsonIntermediate.data=output.data;
              jsonIntermediate.errorCode=output.errorCode;
              callback(jsonIntermediate);
              return;
            }
            else{
              let jsonIntermediate={};
              jsonIntermediate.status=true;
              jsonIntermediate.data=output.data;
              jsonIntermediate.errorCode=output.errorCode;
              callback(jsonIntermediate);
              return;
            }
          })
        }
        else if(count>1){
          let jsonIntermediate={};
          jsonIntermediate.status=false;
          jsonIntermediate.data='collectionExistCheck duplicate collection exists';
          jsonIntermediate.errorCode=3;
          callback(jsonIntermediate);
          return;
        }
        else if(count===1){
          let jsonIntermediate={};
          jsonIntermediate.status=true;
          jsonIntermediate.data='collectionExistCheck collection exists';
          callback(jsonIntermediate);
          return;
        }
      }
  });
}
module.exports=collectionExistCheck;
