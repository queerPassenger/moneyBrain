const TransactionController = require('./TransactionController').TransactionController;

function insertNewOne(payload, cb) {
    TransactionController.insertNewOne(payload, (response) => {
        cb(response);
        return;
    })
}
function getList(payload,cb){
    TransactionController.getList(payload, (response) => {
        cb(response);
        return;
    })
}
module.exports = {  
    insertNewOne, 
    getList
}