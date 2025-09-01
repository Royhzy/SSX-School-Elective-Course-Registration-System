const db=wx.cloud.database();

var id='';
var openid='';
var dataList='';
var Indexs=0;
var selectDatas=["01班","02班", "03班","04班","05班","06班","07班","08班","09班", "10班","11班","12班","13班","14班"];
var selectDatas2=[1,2,3,4,5,6,7,8,9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53];
var banji="01班";
var Indexs2='';
var number=1;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[],
        shows: false, //控制下拉列表的显示隐藏，false隐藏、true显示
        selectDatas: ["01班","02班", "03班","04班","05班","06班","07班","08班","09班", "10班","11班","12班","13班","14班"], //下拉列表的数据1
        indexs: 0, //选择的下拉列 表下标,

        shows2:false,
        selectDatas2:[1,2,3,4,5,6,7,8,9, 10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53],
        indexs2: 0, //选择的下拉列 表下标,
    },

    formatTime(date){
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()
     
        var hour = date.getHours()
        var minute = date.getMinutes()
        var second = date.getSeconds()


        if(hour<10)
        {
            hour='0'+hour;
        }
        if(minute<10)
        {
            minute='0'+minute;
        }
        if(second<10)
        {
            second='0'+second;
        }
        return [year, month, day].join('/') + ' ' + [hour, minute, second].join(':')
    },

    btnSub(res){
        var resVlu=res.detail.value

        // var nameStr = resVlu.name;
        // var reg1 = new RegExp('\n', 'g');//全局替换换行符
        // nameStr = nameStr.replace(reg1, '');
        // nameStr = nameStr.replace(/\s+/g, '');//全局替换空格


        if(resVlu.name==''){
          wx.showToast({
            icon:'none',
            title: '姓名不能为空',
          })
        }   
        else if(resVlu.phone==''){
          wx.showToast({
            icon:'none',
            title: '电话不能为空',
          })
        }
        else if(!(/^[\u4E00-\u9FA5A-Za-z]+$/.test(resVlu.name))){
            wx.showToast({
                icon:'none',
                title: '姓名格式错误！(原因：换行/空格/特殊字符)',
              })        
        }
        else if(!(/(^[0-9]*$)/.test(resVlu.phone))){
            wx.showToast({
                icon:'none',
                title: '电话格式错误！(原因：换行/空格/是否都为数字)',
            })        
        }
        else{
            wx.showModal({
                cancelColor: 'cancelColor',
                title: '确认提交',
                content:'请确认信息，一经提交后无法修改信息和修改选课',
                success:(res)=>{
                    if(res.confirm){
                        var myDate = new Date();
                        this.formatTime(myDate)
                        wx.showLoading({
                            title: '提交中',
                        })
                        
                        wx.cloud.callFunction({
                            name: 'ssx-baoming', 
                            data:{
                                couID:id,
                                type:"chaxunshengyu"            //第一次查询剩余人数
                            }         
                        }).then(res=>{
                            if(res.result.data[0].remain>0){

                                wx.cloud.callFunction({     
                                    name: 'ssx-baoming', 
                                    data:{
                                        name:resVlu.name,
                                        banji:banji,
                                        number:number,
                                        type:"match"              //找到学生匹配表里的对应学生
                                    }         
                                }).then(res=>{
                                    if(res.result.data.length>0){           //如果匹配成功
                                        wx.cloud.callFunction({
                                            name: 'ssx-baoming', 
                                            data:{
                                                banji:banji,
                                                number:number,
                                                type:"udselected"          //去掉匹配表里的学生
                                            }         
                                        }).then(res=>{
                                            wx.cloud.callFunction({
                                                name: 'ssx-baoming', 
                                                data:{
                                                    couID:id,
                                                    type:"xiugaishengyu"   //修改剩余人数
                                                }         
                                            }).then(res=>{
                                                wx.cloud.callFunction({             
                                                    name: 'ssx-baoming', 
                                                    data:{
                                                        openid:openid,
                                                        name:resVlu.name,
                                                        banji:banji,
                                                        phone:resVlu.phone,
                                                        number:number,
                                                        couID:id,
                                                        Cname:dataList.Cname,
                                                        time:this.formatTime(myDate),
                                                        type:"tijiao",         //添加到学生表
                                                    }
                                                }).then(res=>{
                                                    wx.cloud.callFunction({
                                                        name: 'ssx-baoming', 
                                                        data:{
                                                            couID:id,
                                                            type:"chaxunshengyu"   //第二次查询剩余
                                                        }         
                                                    }).then(res=>{
                                                        if(res.result.data[0].remain<0){   //如果两个人几乎同时抢了一个
                                                            wx.cloud.callFunction({
                                                                name: 'ssx-baoming', 
                                                                data:{
                                                                    name:resVlu.name,
                                                                    banji:banji,
                                                                    number:number,
                                                                    type:"adselected"   //添加回学生匹配表
                                                                }         
                                                            }).then(res=>{
                                                                wx.cloud.callFunction({             
                                                                    name: 'ssx-baoming', 
                                                                    data:{
                                                                        name:resVlu.name,
                                                                        banji:banji,
                                                                        number:number,
                                                                        type:"removeduoyu",//去掉学生表对应数据
                                                                    }
                                                                }).then(res=>{
                                                                    wx.cloud.callFunction({             
                                                                        name: 'ssx-baoming', 
                                                                        data:{
                                                                            couID:id,
                                                                            type:"xiugaihuishengyu"   //修改剩余人数
                                                                        }   
                                                                    }).then(res=>{
                                                                        wx.hideLoading()
                                                                        setTimeout(() => {
                                                                            wx.showToast({
                                                                              title: '报名失败！请重新刷新报名！',
                                                                              icon:'none',
                                                                            });
                                                                            setTimeout(() => {
                                                                              wx.hideToast();
                                                                              wx.reLaunch({
                                                                                url: '/pages/index/index'
                                                                            })
                                                                            }, 1500)
                                                                        }, 0);
                                                                    })
                                                                })
                                                            })
                                                        }
                                                    else{
                                                        wx.hideLoading()
                                                        setTimeout(() => {
                                                            wx.showToast({
                                                              title: '报名成功！',
                                                            });
                                                            setTimeout(() => {
                                                              wx.hideToast();
                                                              wx.reLaunch({
                                                                url: '/pages/index/index'
                                                            })
                                                            }, 1500)
                                                        }, 0);
                                                    }
                                                }).catch(res=>{
                                                    console.log('调用失败',res)
                                                })  
                                            })
                                            })
                                        })
                                    }
                                    else(
                                        wx.showToast({
                                          title: '报名失败！请检查信息是否填写错误或是否已选过课',
                                          icon:'none'
                                        })
                                    )
                                })
                            }
                            else{
                                wx.hideLoading()
                                setTimeout(() => {
                                    wx.showToast({
                                      title: '报名失败！人数已满！',
                                      icon:'none'
                                    });
                                    setTimeout(() => {
                                      wx.hideToast();
                                      wx.reLaunch({
                                        url: '/pages/index/index'
                                    })
                                    }, 1500)
                                }, 0);
                            }
                        }) 
                    }
                }
            })
            // console.log(resVlu.name,number,resVlu.phone,openid,banji,id,dataList.Cname,this.formatTime(myDate))
      }
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
        banji=selectDatas[Indexs]
        this.setData({
          indexs: Indexs,
          shows: !this.data.shows
        })

      },


      selectTaps2() {
        this.setData({
            shows2: !this.data.shows2,     
        })    
    },
    // 点击下拉列表
    optionTaps2(e) {
      Indexs2 = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
      number=selectDatas2[Indexs2]
      this.setData({
        indexs2: Indexs2,
        shows2: !this.data.shows2
      })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

        id=options.id
        db.collection("course").doc(id).get().then(res=>{
            this.setData({
                list:res.data,
                name:res.data.name
            })
            dataList=res.data
        })
        .catch(res=>{
            console.log("请求失败",res)
        })


        //获取用户openid
        wx.cloud.callFunction({      
            name: 'getOpenid', 
        }).then(res=>{
            openid = res.result.openid
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