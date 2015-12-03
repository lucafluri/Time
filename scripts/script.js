/*Functions*/
/* 80Years = 4160 weeks = 29120 days
Display Every Week
*/

function checkInput(){
  $("#submitButton").on("click", function() {
    var date = new Date();
    var day = $("#dayIn").val();
    var month = $("#monthIn").val();
    var year = $("#yearIn").val();

    if((0 < day && day <= 31) && (0 < month && month <= 12) && ((date.getFullYear()-110) < year && year <= date.getFullYear())){
        $("#dateForm").slideUp(300);
        $("#submitButton").slideUp(300);
        $("#credits").hide(0);

        setTimeout(calcDiff(day, month, year), 300);

      }
    else {
      alert("Please enter valid birthdate");
      document.getElementById("dateForm").reset();
    }
  });
}

function calcDiff(day, month, year){
  var date = new Date();
  var oneDay = 1000*60*60*24; // hours*minutes*seconds*milliseconds
  var birth = new Date(year,month,day);
  var today = new Date(date.getFullYear(),date.getMonth()+1,date.getDay());

  var daysAlive = Math.round(Math.abs((birth.getTime() - today.getTime())/(oneDay)));
  var weeksAlive = Math.round(daysAlive/7);
  var yearsAlive = daysAlive/365;
  /*alert("Days: " + daysAlive + " Weeks: " + weeksAlive + " Years: " + yearsAlive);*/

  makeGrid(daysAlive, weeksAlive, yearsAlive);

}

function makeGrid(daysAlive, weeksAlive, yearsAlive){
  /*HTML TEST*/
  /*$("#main").html("<p>TEST</p>");*/

  $("#main").html("<div class='grid'>\n");
  $("#main").append("<div class='grid-sizer'></div>\n");

  for(var i = 0; i < weeksAlive; i++){
    $("#main").append("<div class='grid-item lived'></div>\n");
  }

  for(var i = 0; i < (4160-weeksAlive); i++){
    $("#main").append("<div class='grid-item toLive'></div>\n");
  }

  $("#main").append("</div>");


  /*Init Masonry*/
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  $("#subtitle").html("This is your life until age 80. Every bubble represents a week. </br> ");
  $("#subtitle").append("You have already lived the black ones.</br>")
}






$(function() {
  var d = new Date();
  $("#credits").html("(C) " + d.getFullYear() + " by Luca Fluri" );
  checkInput();


});
