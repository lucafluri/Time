/*Functions*/
/* 80Years = 4160 weeks = 29120 days
Display Every Week
*/

function calcDiff(day, month, year){
  var date = new Date();
  var oneDay = 1000*60*60*24; // hours*minutes*seconds*milliseconds
  var birth = new Date(year,month,day);
  var today = new Date(date.getFullYear(),date.getMonth()+1,date.getDay());

  var daysAlive = Math.round(Math.abs((birth.getTime() - today.getTime())/(oneDay)));
  alert(daysAlive);


  /*HTML TEST*/
  $("#main").html("<p>HELLO</p>");
}


function checkInput(){
  $("#submitButton").on("click", function() {
    var date = new Date();
    var day = $("#dayIn").val();
    var month = $("#monthIn").val();
    var year = $("#yearIn").val();

    if((0 < day && day <= 31) && (0 < month && month <= 12) && (1900 < year && year <= date.getFullYear())){
        $("#dateForm").slideUp(300);
        $("#submitButton").slideUp(300);
        calcDiff(day, month, year);
      }
    else {
      alert("Please enter valid birthdate");
      document.getElementById("dateForm").reset();
    }
  });
}




$(function() {
  checkInput();


});
