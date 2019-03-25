function get(key){
    switch(key){
        case 'pouch':
            return{
                db_address:'ds053894.mlab.com',
                port_no:53894,
                db_name:'pouch',
                username:'dbUser',
                password:'dbUser123',
                collection:{
                    user:'userTable',
                    transaction:'moneyManagement',
                    error:'errorLogs'
            }
        }
       
        default :
            return{
                db_address:'localhost',
                port_no:null,
                db_name:'',
                collection:{

                }
            }
        
    }
}
module.exports={get}