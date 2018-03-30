var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var itemSchema = new Schema({
    title:String,
    state:{
        type:Number,
        default:1
    }, //0删除 1未完成 2完成
    userId:Schema.Types.ObjectId
});
module.exports = mongoose.model("item", itemSchema);