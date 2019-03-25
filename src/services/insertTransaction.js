const ServiceController=require('./ServiceController').ServiceController;

function utility(payload,cb){
    ServiceController.connect((responseData)=>{
        if(responseData.status){
            ServiceController.insertNewTransaction(payload,(response)=>{
                cb(response);
                return;
            })
        }
        else{
            cb(responseData);
            return;
        }
    })
}
module.exports={utility}