const createCollection=function(dbInstance,collectionName,callback){
  dbInstance.createCollection(collectionName, function(err, res) {
      if (err) {
        let jsonIntermediate={};
        jsonIntermediate.status=false;
        jsonIntermediate.data='createCollection err';
        jsonIntermediate.errorCode=4;
        callback(jsonIntermediate);
        return;
      }
     else{
       let jsonIntermediate={};
       jsonIntermediate.status=true;
       jsonIntermediate.data='createCollection collection created';
       callback(jsonIntermediate);
       return;
     }
   });
}

module.exports=createCollection;
