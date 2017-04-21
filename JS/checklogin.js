$(document).ready(function(){
 $("#livehelp").on("click", function() {
    event.preventDefault();
     
     //get with jQuery to the server and database
    $.get("checklogin", { /* logged on variable? */}, function(result) 
           {
      //  alert(result.success);
             if (result.success == false) {
                alert("Please login to access this page");
                window.location.replace("loginmain.html");
             } else {                 
                 //redirect the page 
                 window.location.replace("/livehelp.html");
                  
             }
    });    
 });
});
