var mongoose = require('mongoose')
var Schame = mongoose.Schema
var msgSchame = new Schame({
  num:{
    type:Number,
    default:1
  },
  youname:String,
  tel:String,
  msg:String

})
module.exports = mongoose.model('msg', msgSchame)