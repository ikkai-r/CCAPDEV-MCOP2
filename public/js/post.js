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