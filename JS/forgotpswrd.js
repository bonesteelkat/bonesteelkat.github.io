//on click the db checks for the user's email and returns the resulting password
$(document).ready(function(){
 $("#sendbutton").on("click", function() {
     event.preventDefault();
     var email = $("#sendbox").val();
     
     $.post("checkpass", { email: email }, function(data) {
         if (data.success = false) {
             $("#pass").append("That email does not exist");
         } else {
             $("#pass").append("You password is " + data);
         }
     });
 });                 
});