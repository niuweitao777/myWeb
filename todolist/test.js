var express = require("express");
require("./tools/db");
var item = require("./models/item")
var app = express();
item.create({
    title:"吃西瓜",
    state:1,
    userId:"5aaf61d45b698c4e383f50aa"
})
app.listen(3000, function () {
    console.log("ok");
})