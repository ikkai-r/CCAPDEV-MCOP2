function copyLink(url) {
    navigator.clipboard.writeText(url);
    $('#copyLinkModal').modal('show');

    setTimeout(function() {
        $('#copyLinkModal').modal('hide');
    }, 1500)
}

function convertDateToTxt() {
    const date = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
      ];
    
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    // Format the date
    let formattedDate = monthNames[month] + " " + day + ", " + year;
    
    return formattedDate;

}



$("#toggle-pass-log").click(function () {
    if($("#password-log").prop('type') == 'text'){
        $("#password-log").prop("type", "password");
        $('#toggle-pass-log').addClass( "fa-eye-slash" );
        $('#toggle-pass-log').removeClass( "fa-eye" );
    }else if($("#password-log").prop('type') == 'password'){
        $("#password-log").prop("type", "text");
        $('#toggle-pass-log').removeClass( "fa-eye-slash" );
        $('#toggle-pass-log').addClass( "fa-eye" );
    }
});


$("#toggle-pass-reg").click(function () {
    if($("#password-reg").prop('type') == 'text'){
        $("#password-reg").prop("type", "password");
        $('#toggle-pass-reg').addClass( "fa-eye-slash" );
        $('#toggle-pass-reg').removeClass( "fa-eye" );
    }else if($("#password-reg").prop('type') == 'password'){
        $("#password-reg").prop("type", "text");
        $('#toggle-pass-reg').removeClass( "fa-eye-slash" );
        $('#toggle-pass-reg').addClass( "fa-eye" );
    }
});

$("#toggle-pass-con").click(function () {
    if($("#confirm-password").prop('type') == 'text'){
        $("#confirm-password").prop("type", "password");
        $('#toggle-pass-con').addClass( "fa-eye-slash" );
        $('#toggle-pass-con').removeClass( "fa-eye" );
    }else if($("#confirm-password").prop('type') == 'password'){
        $("#confirm-password").prop("type", "text");
        $('#toggle-pass-con').removeClass( "fa-eye-slash" );
        $('#toggle-pass-con').addClass( "fa-eye" );
    }
});

$('#password-reg, #confirm-password').on('keyup', function () {

    if ($('#password-reg').val() == $('#confirm-password').val() && $('#password-reg').val() != "") {
        $('#pass-msg').css('display', 'block');
        $('#pass-msg').removeClass('alert-danger');
        $('#pass-msg').addClass('alert-success');
        $('#pass-msg').text('Matching password');
    } else  {
        $('#pass-msg').addClass('alert-danger');
        $('#pass-msg').removeClass('alert-success');
        $('#pass-msg').text('Not matching password');
    }
  });

 

  $("#register-btn").click(function (e) {
    e.preventDefault();
    if ($('#password-reg').val() != $('#confirm-password').val()) {
        $('#pass-msg').addClass('alert-danger');
        $('#pass-msg').removeClass('alert-success');
        $('#pass-msg').text('Ensure your passwords are the same before registering.');
    } else {
        const formData = $('#register-user').serialize();

        // Send the form data to the server using AJAX
        $.ajax({
          url: '/', 
          method: 'POST',
          data: formData,
          success: function(data) {
            $('#pass-msg').text(data.message); 

            setTimeout(function() {
              window.location = "/user/"+data.username;
            }, 2000);
          },
          error: function(error) {
            console.error('Error submitting form:', error);
          }
        });
     
    }
});



$("#login-btn").click(function (e) {
    e.preventDefault();

        const formData = $('#login-user').serialize();

        // Send the form data to the server using AJAX
        $.ajax({
          url: '/', 
          method: 'POST',
          data: formData,
          success: function(data) {     
            $('#login-msg').css('display', 'block');
            $('#login-msg').removeClass('alert-danger');
            $('#login-msg').addClass('alert-success');
            $('#login-msg').text('Successful login. You will be redirected shortly.'); 
            setTimeout(function() {
                // Handle the redirect using JavaScript
                window.location = "/user/" + data.username;
              }, 2000);
               },
          error: function(error) {
            console.error('Error submitting form:', error);
            $('#login-msg').css('display', 'block');
            $('#login-msg').removeClass('alert-success');
            $('#login-msg').addClass('alert-danger');
            $('#login-msg').text('Invalid credentials'); 
          }
        });
     
});


// Get all popular tag containers
const popularTagContainers = document.querySelectorAll(".popular-taglist");

popularTagContainers.forEach((container) => {
    const tag = container.querySelector(".tag-subscribe");

    tag.addEventListener("click", function () {
        if (tag.textContent === "Subscribe") {
            tag.textContent = "Unsubscribe";
        }
        else {
            tag.textContent = "Subscribe";
        }
    });
});