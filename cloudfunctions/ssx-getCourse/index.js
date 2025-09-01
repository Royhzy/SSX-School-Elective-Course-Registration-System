// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();
const cmd=db.command;

// 云函数入口函数
exports.main = async (event, context) => {
    if(event.type=="getCourse"){
        if(event.leibie=="全部"){
            if(event.syrs=="升序"){
                return await db.collection("course").orderBy('remain','asc').get()
            }
            else if(event.syrs=="降序"){
                return await db.collection("course").orderBy('remain','desc').get()              
            }
            else{
                return await db.collection("course").get()                
            }
        }
        else{
            if(event.syrs=="升序"){
                return await db.collection("course").orderBy('remain','asc').where({
                    category:event.leibie
                }).get()
            }
            else if(event.syrs=="降序"){
                return await db.collection("course").orderBy('remain','desc').where({
                    category:event.leibie
                }).get()            
            }
            else{
                return await db.collection("course").where({
                    category:event.leibie
                }).get()    
            }
        }
    }
    else if(event.type=="yzCourse"){
        return await db.collection("student").where({
            _openid:event.openid,
        }).get()  
    }
}