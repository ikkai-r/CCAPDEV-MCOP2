$(".add-tag").click(function () {
    if($(this).hasClass('fa-circle-plus')) {
        $(this).removeClass('fa-circle-plus');
        $(this).addClass('fa-circle-minus');
    } else {
        $(this).removeClass('fa-circle-minus');
        $(this).addClass('fa-circle-plus');
    }
    
});

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
    if ($('#password-reg').val() == $('#confirm-password').val()) {
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
    if ($('#password-reg').val() != $('#confirm-password').val()) {
        e.preventDefault();
        $('#pass-msg').addClass('alert-danger');
        $('#pass-msg').removeClass('alert-success');
        $('#pass-msg').text('Ensure your passwords are the same before registering.');
    }
});