var key= '';
var Indexs=0;
var Indexs2=0;
var selectDatas=["全部","艺术天地", "语言星空","科创空间","体育世界","学科课程"];
var selectDatas2=["默认排序","升序", "降序"];
var list=[];
var openid='';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDatas: ["全部","艺术天地", "语言星空","科创空间","体育世界","学科课程"], //下拉列表的数据1
    indexs: 0, //选择的下拉列 表下标,


    shows2:false,
    selectDatas2: ["默认排序","升序", "降序"], //下拉列表的数据
    indexs2:0,


    yzlist:[],
  },


    // 点击下拉显示框
    selectTaps() {
      this.setData({
          shows: !this.data.shows,
      })
    },
    // 点击下拉列表
    optionTaps(e) {
      Indexs = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData({
        indexs: Indexs,
        shows: !this.data.shows
      })
      this.getList()
    },


    selectTaps2() {
        this.setData({
            shows2: !this.data.shows2,
        })
    },
    // 点击下拉列表
    optionTaps2(e) {
      Indexs2 = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      this.setData({
        indexs2: Indexs2,
        shows2: !this.data.shows2
      })
      this.getList()
    },


    gobaoming(e){
      wx.navigateTo({
        url: '/pages/baoming/baoming?id='+e.currentTarget.dataset.id,
      })
    },

    getList(){
        wx.cloud.callFunction({
          name:'ssx-getCourse',
          data:{
            type:"getCourse",
            leibie:selectDatas[Indexs],
            syrs:selectDatas2[Indexs2]   
          }   
        }).then(res=>{
              this.setData({
                  list:res.result.data
              })
              list=res.result.data
         }).catch(res=>{
          console.log('调用失败',res)
         })
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

      this.getList()







      wx.cloud.callFunction({      
          name: 'getOpenid', 
       }).then(res=>{
            openid = res.result.openid
            wx.cloud.callFunction({
              name:'ssx-getCourse',
              data:{
                type:"yzCourse",
                openid:openid,  
              }   
            }).then(res=>{
                  this.setData({
                      yzlist:res.result.data
                  })
             }).catch(res=>{
                console.log('调用失败',res)
             })   
      }) 

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
      this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})