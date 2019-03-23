const enviroment=function (app){
    if(process.env.NODE_ENV==='production')
        app.listen(3000)
    else
        app.listen(8080,()=>{
            require('opn')('http://localhost:8080');
        })
}
module.exports=enviroment