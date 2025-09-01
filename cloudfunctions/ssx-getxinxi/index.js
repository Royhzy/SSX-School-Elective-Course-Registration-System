// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db=cloud.database();
const cmd=db.command;


// 云函数入口函数
exports.main = async (event, context) => {
    if(event.type=="getStu")
    {
        return await db.collection("student").where({
            _openid:event.yhopenid
        }).get()
    }
    else if(event.type=="getCourse"){
        return await db.collection("course").where({
            _id:event.couID
        }).get()       
    }
    else if(event.type=="gettx"){
        return await db.collection("student").where({
            couID:event.couID
        }).get()       
    }
}