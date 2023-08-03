var imageSrc = ""; 

var loadFile = function (event) {
    var image = document.getElementById("edit-pfp");
    image.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("edit-pfp-bg").style.backgroundImage = "url(" + URL.createObjectURL(event.target.files[0]) + ")"
    imageSrc = URL.createObjectURL(event.target.files[0]);
};

var backLoad = function (event) {

    var image = document.getElementById("edit-pfp");
    image.src =  $("#upfp").attr('src')
    document.getElementById("edit-pfp-bg").style.backgroundImage = "url("+$("#upfp").attr('src')+")"
    document.getElementById("bio-area").value = $("#bio-user").text();
};

$("#edit-profile-btn").click(function (e) {
    // if (imageSrc !== "") {  // Check if an image URL is present
    //     var image = document.getElementById("upfp");
    //     image.src = imageSrc;  // Set the image source to the stored URL
    //   }
    //   document.getElementById("bio-user").textContent = document.getElementById("bio-area").value;

    e.preventDefault();

    // Create a new FormData object
    var formData = new FormData();

    formData.append('bio_area', $('#bio-area').val());
  
    var fileInput = $('#getImg')[0].files[0];
    if (fileInput) {
      formData.append('getImg', fileInput);
    }
      // Send the form data to the server using AJAX
      $.ajax({
        url: '/user/'+$('#username-edit').val(), 
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
         if(data.message == 'success') {
            if (data.profile_image) {
                $('#upfp').attr('src', data.profile_image);
              }
        
              // Update the profile bio if it exists in the response
              if (data.profile_bio) {
                $('#bio-user').text(data.profile_bio);
              }
         } 
        },
        error: function(error) {
          console.error('Error submitting form:', error);
        }
      });
   
});

var logoutButton = document.getElementById("logout-btn");

$(document).ready(function() {
    $('.tag-group').click(function() {
      window.location.href = 'view-tag.html';
    });
});