//index.js

const AV = require('../../utils/av-weapp-min');
const Name = require('../../model/name');

//获取应用实例
const app = getApp();

Page({
  data:{
    nameOrPhone:'',
    name:'',
    resultMeetingSeat:'未安排座位',
    resultDinnerSeat:'暂无相关信息'
  },
  editInput:function(res){
    this.setData({
      nameOrPhone: res.detail.value
    });
    console.log(res.detail.value);
  },
  getSeat:function(){

    if(this.data.nameOrPhone.length === 0){
      wx.showModal({
        title: '请输入手机号或姓名',
        content: '需重新输入',
      })
      return;
    }

    wx.showLoading({
      title: '正在查询',
    })

    const queryByPhone = new AV.Query('name').equalTo("phone", this.data.nameOrPhone);
    queryByPhone.first();

    const queryByName = new AV.Query('name').equalTo('name',this.data.nameOrPhone);

    var query = AV.Query.or(queryByPhone, queryByName);
    var res_get;
    query.find().then(res => { 
      console.log(res);
      // + '第一行内容\r\n第二行内容\r\n第三行内容\r\n第四行内容'
      if(res.length === 1){
        this.setData({ resultMeetingSeat: res[0].get('meetingSeat') ? res[0].get('meetingSeat') : "未找到座位信息" });
        this.setData({name :res[0].get('name')});
        this.setData({ resultDinnerSeat: res[0].get('dinnerSeat') ? res[0].get('dinnerSeat') : "未找到座位信息" });
        wx.hideLoading();
        wx.showModal({
          title: '欢迎您，'+this.data.name,
          content: '会议-座位：' + this.data.resultMeetingSeat + '\r\n' + '晚宴-桌号：' + this.data.resultDinnerSeat
        });
      }
      else if(res.length > 1){
        wx.hideLoading();
        wx.showModal({
          title: '有两个相同的姓名',
          content: '请输入手机号进行查询',
        })
      }
      else{
        wx.hideLoading();
        wx.showModal({
          title: this.data.nameOrPhone + '，不在邀请名单中',
          content: '请确认后，重新输入',
        })
      }

    }).catch(console.error);
    console.log(this.data.result);

  },
  onShareAppMessage:function(){
    return {
      title:"U净运营商大会-座位查询",
      desc:'查询座位和会议议程',
      path:'/pages/index/index'
    }
  }

})
