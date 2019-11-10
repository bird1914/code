
//引入express模块
const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const User = require("../models/UserSchema");
const Hero = require("../models/heroSchema")

//登录接口
router.post('/login', function(req, res, next){
  //用户名、密码、验证码
  var username = req.body.username;
  var password = req.body.password;

  if(username === 'admin' && password === '123456'){
    res.cookie('user',username);
    return res.send({
      status: "success",
      info:"欢迎来到德莱联盟"
    });
  }

  return res.send({
    status: "fail",
    info: '账号或密码错误'
  });
});

// 添加一名用户信息路由
router.post("/addUser",(req, res) => {
  User.create(req.body, (err, user) => {
    if (err) {
      res.json({
        status:"fail",
        error:err
      });
    } else {
      res.json({
        status:"success",
        message:"新增成功"
      });
    }
  });
});

// 查询所有英雄信息路由
router.post("/getUserList", (req, res) => {
  var name = new RegExp(req.body.name)
      ipv4 = req.body.ipv4
      apiUrl = req.body.apiUrl
      createTime = req.body.createTime
      pageNumber = req.body.pageNumber,
      pageRow = req.body.pageRow;
  // 根据查询入参个数，动态生成sql查询语句
  var sqlObj = {};
  if(name){
    sqlObj.name = name;
  }
  if(ipv4){
    sqlObj.ipv4 = ipv4;
  }
  if(apiUrl){
    sqlObj.apiUrl = apiUrl;
  }
  if (createTime) {
    sqlObj.createTime = createTime;
  }
  var userList = User.find(sqlObj);
  //对查询的结果进行筛选，skip跳过结果集中的前多少
  userList.skip((pageNumber - 1)*pageRow);
  //对剩下来的数据进行限制返回个数
  userList.limit(pageRow)
  // 实现分页的关键步骤
  userList.exec(function(err,result){
    if(err){
      res.json({
        status:"fail",
        error:err
      });
    }else{
      User.find(sqlObj,function(err,users){
        res.json({
          status:"success",
          userList:result,
          total:users.length
        });
      })
    }
  })
});

// 查询所有英雄信息路由
/*router.post("/getHeroList", (req, res) => {
  var heroPosition = new RegExp(req.body.heroPosition),
    heroSex = req.body.heroSex,
    heroName = req.body.heroName,
    pageNumber = req.body.pageNumber,
    pageRow = req.body.pageRow;

  // 根据查询入参个数，动态生成sql查询语句
  var sqlObj = {};

  if(heroPosition){
    sqlObj.heroPosition = heroPosition;
  }
  if(heroSex){
    sqlObj.heroSex = heroSex;
  }
  if(heroName){
    sqlObj.heroName = heroName;
  }
  var heroList = Hero.find(sqlObj);

  //对查询的结果进行筛选，skip跳过结果集中的前多少
  heroList.skip((pageNumber - 1)*pageRow);
  //对剩下来的数据进行限制返回个数
  heroList.limit(pageRow)
  // 实现分页的关键步骤
  heroList.exec(function(err,result){
    if(err){
      res.json({
        status:"fail",
        error:err
      });
    }else{
      Hero.find(sqlObj,function(err,heros){
        res.json({
          status:"success",
          heroList:result,
          total:heros.length
        });
      })
    }
  })
});*/

//更新一条英雄信息数据路由
router.put("/modifyUser/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        ipv4: req.body.ipv4,
        apiUrl: req.body.apiUrl,
        createTime: req.body.createTime
      }
    },
    {
      new: true
    }
  )
    .then(user => res.json({
      status:"success",
      message:"修改成功"
    }))
    .catch(err => res.json({
      status:"fail",
      error:"修改失败"
    }));
});

//删除一条英雄信息路由
router.delete("/deleteUser/:id", (req, res) => {
  User.findOneAndRemove({
    _id: req.params.id
  })
    .then(user => res.json({
      status:"success",
      message:"删除成功"
    }))
    .catch(err => res.json({
      status:"fail",
      message:"删除失败"
    }));
});

module.exports = router;
