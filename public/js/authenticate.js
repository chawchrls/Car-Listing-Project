$(document).ready(function() {
    //authentication
    $("#signIn-btn").on("click", function () {
        // console.log("ok");
        console.log($("#userName").val());
        console.log($("#password").val());
        if($("#userName").val() && $("#password").val()){
            $.get(
                "/find-user?userName=" +
                    $("#userName").val() +
                    "&password=" +
                    $("#password").val(),
                function (response) {
                    let msg = response.message;
                    // console.log(msg);
                    if (msg === "invalid username") {
                        $("#error-message").text("The username you entered isn't connected to any account.");
                    } else if (msg === "incorrect password") {
                        $("#error-message").text("The password you've enter is incorrect.");
                    } else if (msg === "correct") {
                        // console.log("signIn");
                         window.location = "/signIn?userName=" + $("#userName").val();
                        //  sessionStorage.setItem('userName',$("#userName").val());
                        //  console.log(sessionStorage.getItem('userName'));
                    }
                }
            );
        }else{
            $("#error-message").text("Please enter your username and password.");
        }
        
    });
});