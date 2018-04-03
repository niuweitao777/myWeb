$(function () {
  var $nvaStick = $("#stick").children()

  $nvaStick.mouseover(function () {
    $nvaStick.removeClass("active")
    $(this).attr("class", "active")


  })

  $('#btn').click(function () {
    var youName = $('#youName').val();
    var tel = $('#tel').val();
    var msg = $('#msg').val();

    //ajax请求
    $.post('/msg',{youname:youName, tel:tel, msg:msg }, function (data) {

    })
    alert("提交成功")
    $('#youName').val("")
    $('#tel').val("")
    $('#msg').val("")
  })


})