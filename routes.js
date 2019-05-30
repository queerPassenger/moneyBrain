const {createTransaction,updateTransaction,deleteTransaction,getList,getUserInfo,createTransactionType,deleteTransactionType} =require('./src/services/dbOps')
const getTransaction=require('./src/services/dbOps').getTransaction;
const GoogleLoginController=require('./src/services/googleLoginController');


module.exports=(app)=>{
    app.post('/getUserId',(req,res)=>{
        GoogleLoginController.getUserIdFromLoginId(req.body)
        .then((userId)=>{
            res.send({
                status:true,
                msg:userId
            });
        })
        .catch((err)=>{
            res.send({
                status:false,
                msg:err
            })
        });
    });

    app.get('/validateUser',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            res.status(200);
            res.send({
                status:true,
                msg
            })
        })
        .catch((err)=>{
            console.log('err',err);
            res.status(401);
            res.send({
                status:false,
                msg:'Unauthorized access'
            })
        });
    });
 
    app.get('/getUserInfo',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            getUserInfo('user',req.query,(json)=>{
                res.send(json);
            })
        })
        .catch((err)=>{
            res.status(401);
            res.send({
                status:false,
                msg:'Unauthorized access'
            })
        });
    })
    app.get('/getTransactionTypeList', (req, res) => {
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            getList('transactionType',req.query,(json)=>{
                 res.send(json);
            });
        })
        .catch((err)=>{
            console.log('error',err);
            res.send({
                status:false,
                msg:err
            })
        });
    });

    app.get('/getAmountTypeList', (req, res) => {
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            getList('amountType',null,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            res.send({
                status:false,
                msg:err
            })
        });
    });

    app.post('/recordTransaction',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            createTransaction('transaction',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            res.send({
                status:false,
                msg:err
            })
        });
    });
    app.post('/updateTransaction',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            updateTransaction('transaction',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            console.log('err',err);
            res.send({
                status:false,
                msg:err
            })
        });
    })
    app.post('/getTransaction',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            getTransaction('transaction',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            res.send({
                status:false,
                msg:err
            })
        });
    });

    app.delete('/deleteTransaction',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            deleteTransaction('transaction',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            console.log('err',err);
            res.send({
                status:false,
                msg:err
            })
        });
    })
    app.post('/recordTransactionType',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            createTransactionType('transactionType',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            res.send({
                status:false,
                msg:err
            })
        });
    });
    app.delete('/deleteTransactionType',(req,res)=>{
        GoogleLoginController.checkUserIdExist(req.query)
        .then((msg)=>{
            deleteTransactionType('transactionType',req.query,req.body,(json)=>{
                res.send(json);
            });
        })
        .catch((err)=>{
            console.log('err',err);
            res.send({
                status:false,
                msg:err
            })
        });
    })
// app.get('/', (req, res) => {
//   let profile={"id":"1096606541659894762190","displayName":"Allan Valooran","name":{"familyName":"Valooran","givenName":"Allan"},"photos":[{"value":"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg"}],"provider":"google","_raw":"{\n \"kind\": \"plus#person\",\n \"etag\": \"\\\"4DZKD8nJom0F9AKh7PGs_B0kK-A/rVrqj1CF9WOC66lJSJz5rVu2WiM\\\"\",\n \"id\": \"109660654165989476219\",\n \"displayName\": \"Allan Valooran\",\n \"name\": {\n  \"familyName\": \"Valooran\",\n  \"givenName\": \"Allan\"\n },\n \"image\": {\n  \"url\": \"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg\",\n  \"isDefault\": true\n },\n \"language\": \"en_GB\"\n}\n","_json":{"kind":"plus#person","etag":"\"4DZKD8nJom0F9AKh7PGs_B0kK-A/rVrqj1CF9WOC66lJSJz5rVu2WiM\"","id":"109660654165989476219","displayName":"Allan Valooran","name":{"familyName":"Valooran","givenName":"Allan"},"image":{"url":"https://lh4.googleusercontent.com/-52C-SWPb9KQ/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rdRt_itmyzSNGHHGY0SHNJxLdYzsQ/s50-mo/photo.jpg","isDefault":true},"language":"en_GB"}};
//   GoogleLoginController.checkUserExist(profile)
//   .then(result=>{
//     console.log('result',result);
//     res.send(result);
//   })
//   .catch(err=>{
//     res.send(err);
//   })  
// });
}

