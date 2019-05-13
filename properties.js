function getProperties(prop){
    if(process.env.NODE_ENV==='development')
        return dev[prop];
    else    
        return prod[prop];

}

const dev={
    port:1000,
};
const prod={
    port:process.env.PORT
}
module.exports={
    getProperties
};