$(document).ready(function(){
 $("#submitbutton").on("click", function() {
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
    $.post("userlogin", { username: usrname, password: psword }, function(result) 
           {
      //  alert(result.success);
             if (result.success == false) {
                $("#error1").append("Inccorect login. Try again.");
             } else {
                 //document.open("/index.html");
                 //$("login").append("WELCOME, " + usrname + "");
                 //redirect the page 
                 window.location.replace("/index2.html");        
                  
             }
    });    
 });
});
