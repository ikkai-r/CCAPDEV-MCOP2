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
