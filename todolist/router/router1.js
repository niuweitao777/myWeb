var express = require('express')
var router = express.Router()
var msg = require('../models/msg')
router.get("/", function (req, res) {
  res.render("index")
})
router.post('/msg', function (req, res) {
  var youname = req.body.youname
  var tel = req.body.tel
  var message = req.body.msg
  msg.create({
    youname:youname,
    tel:tel,
    msg:message
  })
})
router.get("/myMsg",function (req, res) {
  msg.find({num:1}, function (err, itmes) {
    if (!err){
      
      res.render('message', {itmes:itmes})
    }
  })
})
module.exports = router;