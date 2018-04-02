var $nvaStick = $("#stick").children()

$nvaStick.mouseover(function () {
  $nvaStick.removeClass("active")
  $(this).attr("class", "active")

 /* $.each($nvaStick, function (index, stick) {
    // stick.removeClass();
    console.log("11")
  })*/
})
/*



})*/
