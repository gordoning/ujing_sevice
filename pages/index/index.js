//index.js

const AV = require('../../utils/av-weapp-min');
const Name = require('../../model/name');

//获取应用实例
const app = getApp();

Page({
  data:{
    nameOrPhone:'',
    result:''
  },
  editInput:function(res){
    this.setData({
      nameOrPhone: res.detail.detail.value
    });
    console.log(res.detail.detail.value);
  },
  getSeat:function(){
    const queryByPhone = new AV.Query('name').equalTo("phone", parseInt(this.data.nameOrPhone));
    queryByPhone.first();

    const queryByName = new AV.Query('name').equalTo('name',this.data.nameOrPhone);

    var query = AV.Query.or(queryByPhone, queryByName);
    var res_get;
    query.find().then(res => { 
      this.setData({result: res.length ? res[0].get('seat'):"未找到您的座位信息"});
      wx.showModal({
        title: '参会信息',
        content: '座位号：' + this.data.result
      });
    }).catch(console.error);
    console.log(this.data.result);

  },

})
