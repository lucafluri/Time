/*Functions*/
/* 80Years = 4160 weeks = 29120 days
Display Every Week
*/

function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function autotab(current,to){
    if (current.getAttribute &&
      current.value.length==current.getAttribute("maxlength")) {
        to.focus()
        }
}


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
  var weeksAlive = Math.round(daysAlive/7)-2; //+3 due to offset error
  var yearsAlive = daysAlive/365;
  //alert("Days: " + daysAlive + " Weeks: " + weeksAlive + " Years: " + yearsAlive);

  makeGrid(daysAlive, weeksAlive, yearsAlive);

}

function makeGrid(daysAlive, weeksAlive, yearsAlive){
  /*HTML TEST*/
  /*$("#main").html("<p>TEST</p>");*/

  $("#main").html("<div class='grid'>\n");
  $("#main").append("<div class='grid-sizer'></div>\n");

  for(var i = 0; i < 4160; i++){
    if(i <= weeksAlive){
      if(i%52==51 && i/52!=0){
        $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil(i/52)));
      }
      else{
        $("#main").append("<div class='grid-item lived'></div>\n");
      }
    }
    else{
      if(i%52==51){
        $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil(i/52)));
      }else{
        $("#main").append("<div class='grid-item toLive'></div>\n");
      }
    }
  }
/*
  for(var i = 0; i < (Math.round(4160-weeksAlive)); i++){
    if(i%52==51){
      $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil((weeksAlive/52)+(i/52))));
    }else{
      $("#main").append("<div class='grid-item toLive'></div>\n");
    }
  }*/

  $("#main").append("</div>");


  /*Init Masonry*/
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  $("#subtitle").html("This is your life until age 80.</br> Every bubble represents a week. </br> ");
  $("#subtitle").append("You have already lived the black ones.</br></br>")
  $("#subtitle").append("Reload page to enter a new date")
}






$(function() {
  var d = new Date();
  $("#credits").html("(C) " + d.getFullYear() + " by Luca Fluri" );
  checkInput();


});
