// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();
const cmd=db.command;


// 云函数入口函数
exports.main = async (event, context) => {
    if(event.type=="tijiao")
    {
        return await db.collection("student").add({
            data:{
                _openid:event.openid,
                name:event.name,
                class:event.banji,
                phone:event.phone,
                number:event.number,
                couID:event.couID,
                Cname:event.Cname,
                time:event.time,
            }
        })
        
    }
    else if(event.type=="xiugaishengyu"){
        return await db.collection("course").where({
                _id:event.couID,
        }).update({
            data:{
                remain:cmd.inc(-1)
            }
        })
    }
    else if(event.type=="chaxunshengyu"){
        return await db.collection("course").where({
            _id:event.couID,
        }).get()
    }
    else if(event.type=="match"){
        return await db.collection("student-match").where({
            name:event.name,
            class:event.banji,
            number:event.number,
        }).get()
    }
    else if(event.type=="udselected"){
        return await db.collection("student-match").where({
            class:event.banji,
            number:event.number,
        }).remove()
    }
    else if(event.type=="adselected"){
        return await db.collection("student-match").add({
            data:{
                name:event.name,
                class:event.banji,
                number:event.number,
            }
        })    
    }
    else if(event.type=="removeduoyu"){
        return await db.collection("student").where({
            name:event.name,            
            class:event.banji,
            number:event.number,
        }).remove()
    }   
    else if(event.type=="xiugaihuishengyu"){
        return await db.collection("course").where({
                _id:event.couID,
        }).update({
            data:{
                remain:cmd.inc(1)
            }
        })
    }
}