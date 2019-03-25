function has_Keys(obj,_keys){
    if(type_of(_keys)!=='Array' || _keys.length===0)
        return false;    
    if(_keys.length<0)
        return false;
    for(i=0;i<_keys.length;i++)
        if(!(obj.hasOwnProperty(_keys[i])))
            return false; 
    return true;
}
function type_of(obj){
    return Object.prototype.toString.call(obj).split(' ')[1].replace(']','');
}
module.exports={has_Keys};