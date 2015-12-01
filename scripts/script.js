/*Functions*/
function checkInput(){
  $("#submitButton").on("click", function() {
    var date = new Date();
    var day = $("#dayIn").val();
    var month = $("#monthIn").val();
    var year = $("#yearIn").val();

    if((0 < day && day <= 31) && (0 < month && month <= 12) && (1900 < year && year <= date.getFullYear())){
        $("#dateForm").slideUp(300);
        $("#submitButton").slideUp(250);
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
