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

$("#toggle-pass").click(function () {
    if($("#password").prop('type') == 'text'){
        $("#password").prop("type", "password");
        $('#toggle-pass').addClass( "fa-eye-slash" );
        $('#toggle-pass').removeClass( "fa-eye" );
    }else if($("#password").prop('type') == 'password'){
        $("#password").prop("type", "text");
        $('#toggle-pass').removeClass( "fa-eye-slash" );
        $('#toggle-pass').addClass( "fa-eye" );
    }
});