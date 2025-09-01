var openid="";
var couID='';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        xslist:[],
        kblist:[],
        txlist:[],
    },

    getList(yhopenid){                      
        wx.cloud.callFunction({
            name:'ssx-getxinxi',
            data:{
                yhopenid:yhopenid,
                type:"getStu"
            }
        }).then(res=>{
            this.setData({
                xslist:res.result.data[0],
            })
            if(res.result.data[0]){
                couID=res.result.data[0].couID
                wx.cloud.callFunction({
                    name:'ssx-getxinxi',
                    data:{
                        couID:couID,
                        type:"getCourse"
                    }
                }).then(res=>{
                    this.setData({
                        kblist:res.result.data[0],
                    })
                }).catch(res=>{
                    console.log('调用失败',res)
                }) 

                wx.cloud.callFunction({
                    name:'ssx-getxinxi',
                    data:{
                        couID:couID,
                        type:"gettx"
                    }
                }).then(res=>{
                    this.setData({
                        txlist:res.result.data,
                    })
                }).catch(res=>{
                    console.log('调用失败',res)
                }) 
            }
        }).catch(res=>{
            console.log('调用失败',res)
        })

    },

    xiugai(e){
        wx.navigateTo({
            url: '/pages/xiugai/xiugai?id='+e.currentTarget.dataset.id,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.cloud.callFunction({      
            name: 'getOpenid', 
        }).then(res=>{
            openid = res.result.openid
            this.getList(res.result.openid);
        }) 
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        this.getList(openid)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})