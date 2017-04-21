$(document).ready(function(){
 $("#submitbutton").on("click", function() {
     event.preventDefault();
    //store info entered by user
    var usrname = $("#username").val(),
        psword = $("#password").val(),
        email = $("#email").val(),
        first_name = $("#name").val(),
        last_name = $("#lastname").val(),
        phone = $("#phone").val();
     
//     console.log(usrname);
//     console.log(psword);
//     console.log(email);
//     console.log(first_name);
//     console.log(last_name);
//     console.log(phone);
     
    //make sure there is input for these fields 
    if(usrname == "") {
            $("#error0").fadeIn().text("Required field");
            $("#username").focus();
            return false;
     }
     
    if(psword == "") {
            $("#error5").fadeIn().text("Required field");
            $("#password").focus();
            return false;
     }
     
     if(email == "") {
            $("#error3").fadeIn().text("Required field");
            $("#email").focus();
            return false;
     }
     

    $.post("user_register", { username: usrname, password: psword, email: email }, function(result) 
           {
       // window.alert(result.success);
             if (result.success == false) {
               // document.getElementById( "#error" ).fadeIn().text("Unable to register");
                alert("Unable to register. Try again.");
                window.location.replace("userregister.html");
             } else {
                 
                 //change the html to say they registered
                 alert("Successfully registered");
                 //redirect the page 
                 window.location.replace("index.html");
                  
             }
    });    
 });
});
