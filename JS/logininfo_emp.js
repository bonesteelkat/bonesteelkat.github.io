$(document).ready(function(){
 $("#empsubmitbutton").on("click", function() {
    event.preventDefault();
    //store username and password entered by user
    var usrname = $("#username").val(),
        psword = $("#password").val();
     
    //make sure there is a username inputted 
    if(usrname == "") {
            $("#error1").fadeIn().text("Username required.");
            $("#username").focus();
            return false;
     }
     //make sure there is a password unputted
    if(psword == "") {
            $("#error2").fadeIn().text("Password required");
            $("#password").focus();
            return false;
     }

     //post with jQuery to the server and database
    $.post("emplogin", { username: usrname, password: psword }, function(result) 
           {
        // alert(result);
             if (result.success == false) {
        //         $(".link1").attr("href", "videolib.html");
          //       $(".link2").attr("href", "chat.html");
                 $("#error1").append("Inccorect login. Try again.");
             } else {
                 //redirect the page                                  
                 window.location.replace("index2.html");
             }
    });    
 });
});
