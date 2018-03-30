var express = require("express");
var router = express.Router();
var User = require("../models/user");
var sha1 = require("sha1");
//引入item模型
var Item = require("../models/item");
//登出
router.get("/loginOut", function (req, res) {
    res.redirect("/login");
    req.session.destroy();

});


//根目录页面


router.get("/login", function (req, res) {
    if (req.session.loginUser){
        res.redirect("item_list");
    }else{
        res.redirect("login");
    };

});
//检查用户是否登录
function checkLogin(req, res, next) {
    if (req.session.loginUser){
        next()
    }else{
        res.render("login", {msg:{err:"请登录后在访问此页面"}});
    };


}
//待办事项页面
router.get("/item_list", checkLogin, function (req, res) {
    //当前用户id
    var userId = req.session.loginUser._id;

    Item.find({userId:userId, state:{$ne:0}}, function (err, itmes) {
        res.render("item_list", {items:itmes});
    })


});
//添加待办事项路由
router.post("/addItem", checkLogin, function (req, res) {
    var title = req.body.title;
    var userId = req.session.loginUser._id;
    //待办事项插入数据库
    Item.create({
        title:title,
        userId:userId
    }, function (err) {
        //显示待办事项

        res.redirect("item_list");
    });
});
//完成和恢复路由
router.get("/updateState", checkLogin, function (req, res) {
    var itemId = req.query.itemId;
    var state = req.query.state;
    var userId = req.session.loginUser._id
    Item.updateOne({_id:itemId, userId:userId}, {$set:{state:state}}, function (err) {
        res.redirect("item_list");
    });
});
//修改路由
router.post("/updateTitle", checkLogin, function (req, res) {
    var itemId = req.body.itemId;
    var title = req.body.title;
    var userId = req.session.loginUser._id;
    Item.updateOne({_id:itemId, userId:userId}, {$set:{title:title, state:1}}, function (err) {
        res.redirect("/item_list");
    });
});
//登录页面
router.get("/login", function (req, res) {
    res.render("login");

});
//映射登录
router.post("/login", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    User.findOne({username:username}, function (err, user) {
        if (!err && user && user.password == sha1(password)) {
            res.cookie("username", username, {maxAge:1000*60*60*24});

            req.session.loginUser = user;
            res.redirect("item_list");
            console.log(user)
        }else{
          res.render("login",{msg:{err:"用户名或密码错误"}})  ;
        };
       /* if(!err && user && user.password == sha1(password)){

            //用户登录成功，将用户名设置为cookie，发送给浏览器
            res.cookie("username",username,{maxAge:1000*60*60*24*7});

            //当用户登录成功以后，向session中添加一个属性，通过该属性可以标识用户是否登录
            //一般会在用户登录成功以后，将表示用户信息的对象放入到session
            req.session.loginUser = user;

            //登录成功，跳转到item_list
            res.redirect("/item_list");

        }else{
            //登录失败，返回登录页面，并显示错误消息
            res.render("login",{msg:{err:"用户名或密码错误"}});
        }*/
    });
});
//注册
router.get("/register", function (req, res) {
    res.render("register");
});
//确认用户名是否存在
router.get("/checkUsername", function (req, res) {
    var username = req.query.username;
    User.findOne({username:username}, function (err, user) {
        if (!err && user) {
            res.send({status:"error"});
        }else{
            res.send({status:"ok"});
        };
    });
})
//映射注册
router.post("/register", function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var repwd = req.body.repwd;
    var email = req.body.email;
    var msg = {};
    msg.username = username;
    msg.email = email
    var naemReg = /^[a-z0-9_-]{6,16}$/;
    var pwReg = /^[a-z0-9_-]{6,18}$/i;
    var emailReg = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/i;
    if (!naemReg.test(username)){
        msg.unErr = "请输入6-16位密码，可以是字母、数字、_、-的用户名";
    };
    if (!pwReg.test(password)){
        msg.pwdErr = "请输入6-16位密码，可以是字母、数字、_、-的密码";
    };
    if (password != repwd){
        msg.reErr = "两次密码输入不一致";
    };
    if (!emailReg.test(email)){
        msg.emailErr = "请输入正确的邮箱";
    };
    if (msg.unErr || msg.pwdErr || msg.reErr ||msg.emailErr) {
        res.render("register", {msg:msg});
        return
    };
    User.create({
        username:username,
        password:sha1(password),
        email:email
    }, function (err) {
        if (err){
            msg.err = "用户名已存在"
            res.render("register", {msg:msg})


        }else{
            res.redirect("/login");
        };
    });
});

//列表
router.get("/item_list", function (req, res) {
    res.render("item_list");
});
router.get("/404", function (req, res) {
    res.render("404");
});
module.exports = router;