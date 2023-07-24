var imageSrc = ""; 

var loadFile = function (event) {
    var image = document.getElementById("edit-pfp");
    image.src = URL.createObjectURL(event.target.files[0]);
    document.getElementById("edit-pfp-bg").style.backgroundImage = "url(" + URL.createObjectURL(event.target.files[0]) + ")"
    imageSrc = URL.createObjectURL(event.target.files[0]);
};

var backLoad = function (event) {
    var image = document.getElementById("edit-pfp");
    image.src = "./img/profile.png";
    document.getElementById("edit-pfp-bg").style.backgroundImage = "url(./img/profile.png)"
    document.getElementById("bio-area").value = "i'm a great placeholder, just like how i am easily replaced";
};

var saveChanges = function () {
    if (imageSrc !== "") {  // Check if an image URL is present
        var image = document.getElementById("upfp");
        image.src = imageSrc;  // Set the image source to the stored URL
      }
      document.getElementById("bio-user").textContent = document.getElementById("bio-area").value;
}

var logoutButton = document.getElementById("logout-btn");

$(document).ready(function() {
    $('.tag-group').click(function() {
      window.location.href = 'view-tag.html';
    });
});