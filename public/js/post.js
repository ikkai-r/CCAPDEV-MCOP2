document.getElementById("date").innerHTML = convertDateToTxt();

document.getElementById("add-tag-area").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      var text = document.getElementById("add-tag-area").innerText;
      document.getElementById("add-tag-area").innerText = "";

      if(text !== "") {
        createNewDiv(text);
      }
    }
  });
  
function createNewDiv(text) {
  var outerDiv = document.createElement("div");
  outerDiv.className = "post-tags-cont-r mt-2 added-tag";

  var icon = document.createElement("i");
  icon.className = "fa-solid fa-xmark postcom-tags";
  icon.style.marginRight = "5px";

  var span = document.createElement("span");
  span.contentEditable = true;
  span.textContent = text;

  outerDiv.appendChild(icon);
  outerDiv.appendChild(span);

  document.getElementById("tag-grp").appendChild(outerDiv);
}

$(document).on("click", ".fa-xmark", function () {
  $(this).parent().remove();
});


$("#create-post-btn").click(function(e) {
  e.preventDefault();

  var formData = new FormData();

  var tags = $("#tag-grp div span").map(function() {
    return $(this).text();
  }).get().join(",");

  formData.append('post_title', $('#post_title').val());
  formData.append('date', $('#date').val());
  formData.append('post_content', $('#post_content').val());
  formData.append('action', $('#action').val());
  formData.append('tags', tags);
  
  var fileInput = $('#file')[0].files[0];
  if (fileInput) {
    formData.append('post_attachment', fileInput);
  }

  // Send the form data to the server using AJAX
    $.ajax({
        url: '/post', 
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
         console.log(data.message);
         window.location = "/post/" + data.id;
        },
        error: function(error) {
          console.error('Error submitting form:', error);
      }

});
});


// For attaching files
const fileInput = document.getElementById("file");
const attachmentContainer = document.getElementById("attachment-container");

fileInput.addEventListener("change", function(e) {
  const file = e.target.files[0];

  // Clear the container
  attachmentContainer.innerHTML = "";

  // Loop through the selected files and display their content in the div element
  const reader = new FileReader();

  reader.addEventListener("load", function(e) {
    const fileContent = e.target.result;
    const divPostAttachment = document.createElement("div");
    const divPostAttachmentDelete = document.createElement("div");
    const divPostAttachmentAnchor = document.createElement("a");
    const divPostAttachmentDeleteIcon = document.createElement("i");

    divPostAttachment.className = "post-attachment";
    divPostAttachment.id = "post-attachment";
    divPostAttachmentDelete.className = "post-attachment-delete";
    divPostAttachmentDelete.id = "post-attachment-delete";
    divPostAttachmentAnchor.href = "index.html";
    divPostAttachmentDeleteIcon.className = "fa-regular fa-trash-can";

    divPostAttachment.textContent = file.name;
    
    divPostAttachmentDelete.appendChild(divPostAttachmentAnchor);
    divPostAttachmentDelete.appendChild(divPostAttachmentDeleteIcon);
    divPostAttachment.appendChild(divPostAttachmentDelete);
    attachmentContainer.appendChild(divPostAttachment);
  });

  reader.readAsDataURL(file);
});

// For removing attachments
$(document).on("click", ".post-attachment-delete", function () {
  $(this).parent().remove();
});


$("#edit-post-btn").click(function(e) {
  e.preventDefault();

  var formData = new FormData();

  var tags = $("#tag-grp div span").map(function() {
    return $(this).text();
  }).get().join(",");

  formData.append('post_title', $('#post_title').val());
  formData.append('post_content', $('#post_content').val());
  formData.append('tags', tags);
  formData.append('post_id', $('#post_id').val());
  formData.append('action', $('#action').val()); // Updated this line
  
  var fileInput = $('#file')[0].files[0];
  if (fileInput) {
    formData.append('post_attachment', fileInput);
  } 

  // Send the form data to the server using AJAX
    $.ajax({
        url: '/post/edit-'+$('#post_id').val(), 
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
         console.log(data.message);
         window.location = "/post/" + data.id;
        },
        error: function(error) {
          console.error('Error submitting form:', error);
      }

});


});

$(document).ready(function() {

$("#delete-post-btn").click(function(e) {
  e.preventDefault();

  if($("#post_id").val() !== "") {
    const postId = $("#post_id").val();

  $.ajax({
    url: `/post/edit-${postId}`,
    method: 'DELETE',
    success: function(data) {
      // Handle the success response (e.g., show a success message or refresh the page)
      alert(data.message);
      window.location.href = '/home'; 
    },
    error: function(error) {
      // Handle the error response (e.g., show an error message)
      console.error('Error deleting post:', error);
      alert('An error occurred while deleting the post.');
    },
  });
  } else {
    window.location.href = '/home'; 
  }
  
});
});


$(document).ready(function() {

  $("#edit-comment-btn").click(function(e) {
    e.preventDefault();
      
    // Send the form data to the server using AJAX
    const formData = $('#edit-comment-form').serialize();

    // Send the form data to the server using AJAX
    $.ajax({
      url: '/post/editc-'+$('#comment_id').val(), 
      method: 'POST',
      data: formData,
      success: function(data) {
        window.location = 'post/'+$('#comment_id').val(); 
      },
      error: function(error) {
        console.error('Error submitting form:', error);
      }
    });

});
});
  
