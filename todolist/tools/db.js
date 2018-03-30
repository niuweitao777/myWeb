var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/todolist");
mongoose.connection.on("open", function () {
    console.log("数据库已连接");
});