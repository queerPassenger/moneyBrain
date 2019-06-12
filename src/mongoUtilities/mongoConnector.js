const mongoClient=require('mongodb').MongoClient;
let mongoCount=0;

const createConnection=function(dbConnectionUrl,callback){
	console.log('**Connection Establishment Begins**',++mongoCount);
	mongoClient.connect(dbConnectionUrl, { useNewUrlParser: true },function(err,dbInstance){
		if(err){
			console.log('Err',err)
			callback(err,dbInstance);
		}
		else{
			callback(err,dbInstance);
		}
	});
}
module.exports.createConnection=createConnection;
