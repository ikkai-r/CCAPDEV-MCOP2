// Reference Code for Nested Comments: https://youtu.be/a4OA7QbHEho

let commentContainer = document.getElementById("comment-container");
var isCommenting = 0;
var isEditing = 0;
var element;

var prevCommentContent;

let alreadyVoted = false;

let upvoteAlready = false;
let upvote = document.querySelector(".votes-cont i.fa-circle-up");
let downvoteAlready = false;
let downvote = document.querySelector(".votes-cont i.fa-circle-down");

let shareButton = document.querySelector(".share-cont");

function createTextarea () {
    let div = document.createElement("div");
    div.setAttribute("class", "commenting mt-2");
    div.setAttribute("id", "commenting");

    div.innerHTML += `
    <textarea class="comment-textarea" contenteditable="true" placeholder="add text here" ></textarea>
    <div class="d-flex justify-content-between">
        <button class="cancel-comment pill" id="comment-cancel" style="background-color: #DBDBDB;">cancel</button>
        <button class="submit-comment pill" id="submit-comment" style="background-color: #D4A373;">send</button>
    </div>`;

    return div;
}

function addReply(text) {
    let div = document.createElement("div");
    div.setAttribute("class", "all-comment");

    let commentNumber = document.getElementById("comment-amnt").innerText;
    document.getElementById("comment-amnt").innerHTML = parseInt(commentNumber) + 1;
    document.getElementById("comment-bar-amnt").innerHTML = parseInt(commentNumber) + 1;
    let date = convertDateToTxt();
    div.innerHTML += `
    <div class="row comment" id="comment">
        <div class="col-1 com-votes-cont" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <div><i class="fa-regular fa-circle-up comment-proper-votes" style="color: #292F33; font-size: x-large"></i></div>
            <div class="comment-vote-cont"><span class="com-prop-amnt">0</span></div>
            <div><i class="fa-regular fa-circle-down comment-proper-votes" style="color: #292F33; font-size: x-large"></i></div>
        </div>
        <div class="col-11">
            <!-- Username and Date Commented -->
            <div class="row">
                <div class="col-1">
                    <img src="img/profile.png" class="comment-profile-pic">
                </div>
                <div class="col-11 d-flex justify-content-between">
                    <div>
                        <div class="comment-username"><a href="profile.html">helpvirus</a></div>
                        <div class="comment-username">`+date+`</div>
                    </div>


                    <div class="comment-extras">
                    <!-- <span class="edited" title="This post has been edited.">edited</span> -->
                    <button class="comment-options dropdown" id="comment-options-dropdown" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis fa-l p-2"></i>
                    </button>
                    <div class="comment-options-menu dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                        <a class="dropdown-item" href="#" id="edit-comment" onclick="onClickEdit(event)">Edit comment</a>
                        <a class="dropdown-item" href="#" id="delete-comment" onclick="onClickDeleteComment(event)">Delete comment</a>
                    </div>
                </div>
                </div>
                
            </div>
            <!-- Comment contents -->
            <div class="comment-content">
                <div class="comment-content-text">${text}</div>
            </div>
            <span class="comment-reply" onclick="onClickRep(event)">reply</span>
            <span class="comment-time-reply">1s ago</span>
            <!-- Write a comment -->
            <!-- <div class="comment-writer">
                <div class="comment-textarea" contenteditable="true" placeholder="add text here" ></div>
                <div class="d-flex justify-content-between">
                    <button class="submit comment-pill " style="background-color: #DBDBDB;">cancel</button>
                    <button class="submit comment-pill" style="background-color: #D4A373;">send</button>
                </div>
            </div> -->
        </div>
    </div>`;
    
    const referenceTime = new Date();
    let timeReplyElement = div.querySelector('.comment-time-reply');

    function updateTimeReply() { 
        var currentTime = new Date();

        var timeDiff = Math.floor((currentTime - referenceTime) / 1000);

        var timeText;
        if (timeDiff < 60) {
        timeText = timeDiff + "s ago";
        } else {
        var minutes = Math.floor(timeDiff / 60);
        timeText = minutes + (minutes === 1 ? " minute ago" : "m ago");
        }

        timeReplyElement.textContent = timeText;
    }

    setInterval(updateTimeReply, 2000);

    return div;
}



function onClickRep(e) {
    let closest = e.target.closest(".all-comment");
    
    if (isCommenting == 0) {
        closest.appendChild(createTextarea ());
        element = document.getElementById("comment-cancel");
        isCommenting = 1;
        element.addEventListener("click", onClickCancel);
    } 
};

function onClickCancel(e) {
    let closest = e.target.closest(".all-comment");

    const commentTextarea = $(".commenting");
    commentTextarea.remove();
    isCommenting = 0;
}

function copyComment(text){
    let div = document.createElement("div");
    div.setAttribute("class", "commenting mt-2");
    div.setAttribute("id", "commenting");

    div.innerHTML += `
    <textarea class="comment-textarea" contenteditable="true" placeholder="add text here" >${text}</textarea>
    <div class="d-flex justify-content-between">
        <button class="cancel-comment pill" id="edit-cancel" style="background-color: #DBDBDB;">cancel</button>
        <button class="submit-comment pill" id="edit-submit" style="background-color: #D4A373;">edit</button>
    </div>`;

    return div;
}

$(".comment-container").click(function (e) {
    let closest = e.target.closest(".all-comment");
    console.log(closest);

    $(".submit-comment").unbind().click(function () {
        const commentTextarea = $(".comment-textarea");
        if (commentTextarea.val) {

            if(commentTextarea.val() !== "") {
                if(closest != null){
                    closest.appendChild(addReply(commentTextarea.val()));
                } else {
                    const commentContainer = document.querySelector(".comment-container");
                    commentContainer.appendChild(addReply(commentTextarea.val()));
                }
                $(".commenting").remove();
            } else {
                const commentTextarea = $(".commenting");
                commentTextarea.remove();
            }
            isCommenting = 0;
        } 
     });
});

upvote.addEventListener("click", function(){

    try{
        // check if upvoted already?
        var voteForm = $('#upvoteForm').serialize();

        $.ajax({
            url: '/post/' + $('#post_id').val(), 
            method: 'POST',
            data: voteForm,
            success: function(data) {
                console.log(data.message);
                location.reload(); // Refresh the page to get the updated comments
            },
            error: function(error) {
              console.error('Error submitting form:', error);
            }
          
        });
            
       

        /* let upvoteNumber = document.querySelectorAll(".votes-cont span")[0].innerText;
            let downvoteNumber = document.querySelectorAll(".votes-cont span")[2].innerText;
            
            if (downvoteAlready && !upvoteAlready){
                
                document.querySelectorAll(".votes-cont span")[2].innerHTML = parseInt(downvoteNumber) - 1;
                document.querySelectorAll(".votes-cont span")[0].innerHTML = parseInt(upvoteNumber) - 1;
                upvoteAlready = true;
                downvoteAlready = false;

                upvote.classList.remove("fa-regular");
                upvote.classList.add("fa-solid");
                downvote.classList.add("fa-regular");
                downvote.classList.remove("fa-solid");

                document.getElementById("upvote-amnt").style.fontWeight = "bold";
            }
            else if (!upvoteAlready){
                
                document.querySelectorAll(".votes-cont span")[0].innerHTML = parseInt(upvoteNumber) + 1;
                upvoteAlready = true;

                upvote.classList.remove("fa-regular");
                upvote.classList.add("fa-solid");
                downvote.classList.add("fa-regular");
                downvote.classList.remove("fa-solid");

                document.getElementById("upvote-amnt").style.fontWeight = "bold";
            }
            else {
                document.querySelectorAll(".votes-cont span")[0].innerHTML = parseInt(upvoteNumber) - 1;
                upvoteAlready = false;

                upvote.classList.remove("fa-solid");
                upvote.classList.add("fa-regular");

                document.getElementById("upvote-amnt").style.fontWeight = "bold";
            }*/
    }catch(error){
        console.log(error);
    }
    
    
});


downvote.addEventListener("click", function(){

    try{
        // check if upvoted already?
        var voteForm = $('#downvoteForm').serialize();

        $.ajax({
            url: '/post/' + $('#post_id').val(), 
            method: 'POST',
            data: voteForm,
            success: function(data) {
                console.log(data.message);
                location.reload(); // Refresh the page to get the updated comments
            },
            error: function(error) {
              console.error('Error submitting form:', error);
            }
          
        });
    } catch(error){
        console.log(error);
    }

    /*let upvoteNumber = document.querySelectorAll(".votes-cont span")[0].innerText;
    let downvoteNumber = document.querySelectorAll(".votes-cont span")[2].innerText;
    
    if (upvoteAlready && !downvoteAlready){
        console.log(downvoteNumber + " prior downvotes - post has already been upvoted. removed the upvoted and downvoted the post instead")
        document.querySelectorAll(".votes-cont span")[0].innerHTML = parseInt(upvoteNumber) - 1;
        document.querySelectorAll(".votes-cont span")[2].innerHTML = parseInt(downvoteNumber) + 1;
        downvoteAlready = true;
        upvoteAlready = false;

        downvote.classList.remove("fa-regular");
        downvote.classList.add("fa-solid");
        upvote.classList.add("fa-regular");
        upvote.classList.remove("fa-solid");

        document.getElementById("downvote-amnt").style.fontWeight = "bold";
    }
    else if (!downvoteAlready){
        document.querySelectorAll(".votes-cont span")[2].innerHTML = parseInt(downvoteNumber) + 1;
        console.log(downvoteNumber + " prior downvotes - downvoted the post!");
        downvoteAlready = true;

        downvote.classList.remove("fa-regular");
        downvote.classList.add("fa-solid");
        upvote.classList.add("fa-regular");
        upvote.classList.remove("fa-solid");

        document.getElementById("downvote-amnt").style.fontWeight = "bold";
    }
    else{
        document.querySelectorAll(".votes-cont span")[2].innerHTML = parseInt(downvoteNumber) - 1;
        downvoteAlready = false;

        downvote.classList.remove("fa-solid");
        downvote.classList.add("fa-regular");

        document.getElementById("downvote-amnt").style.fontWeight = "bold";
    }*/
});

$(document).on("click", ".comment-proper-votes", function () {
    var voteCount = $(this).closest(".com-votes-cont").find(".comment-vote-cont .com-prop-amnt");

    if($(this).hasClass('fa-circle-up')) {
        //upvote
        if($(this).hasClass('fa-regular')) {
            var downVoteElement = $(this).closest(".com-votes-cont").find(".fa-circle-down.comment-proper-votes");  

            if(downVoteElement.hasClass('fa-solid')) {
                downVoteElement.removeClass('fa-solid');
                downVoteElement.addClass('fa-regular');
                voteCount.text(parseInt(voteCount.text()) + 1);
            } 
    
            $(this).removeClass('fa-regular');
            $(this).addClass('fa-solid');
            voteCount.text(parseInt(voteCount.text()) + 1);
        } else {
            $(this).removeClass('fa-solid');
            $(this).addClass('fa-regular');
            voteCount.text(parseInt(voteCount.text()) - 1);
        }

    } else {
        //downvote
        if($(this).hasClass('fa-regular')) {
            var upVoteElement = $(this).closest(".com-votes-cont").find(".fa-circle-up.comment-proper-votes"); 

            if(upVoteElement.hasClass('fa-solid')) {
                upVoteElement.removeClass('fa-solid');
                upVoteElement.addClass('fa-regular');
                voteCount.text(parseInt(voteCount.text()) - 1);
            }
    
            $(this).removeClass('fa-regular');
            $(this).addClass('fa-solid');
            voteCount.text(parseInt(voteCount.text()) - 1);
        } else {
            $(this).removeClass('fa-solid');
            $(this).addClass('fa-regular');
            voteCount.text(parseInt(voteCount.text()) + 1);
        }
    } 

});

$(document).on("click", ".comments-cont", function (e){
    let commentContainer = document.querySelector(".comment-container");

    if (isCommenting == 0){
        commentContainer.appendChild(createTextarea ());
        element = document.getElementById("comment-cancel");
        isCommenting = 1;
        element.addEventListener("click", onClickCancel);
    }
    
});

function onClickEdit(e){
    let parentComment = e.target.closest(".row.comment");
    let commentContent = parentComment.querySelector(".comment-content");

    if (isCommenting == 0 && isEditing == 0){
        console.log("sucess");
        
        prevCommentContent = commentContent.innerText;
        commentContent.querySelector(".comment-content-text").remove();
        parentComment.querySelector(".comment-reply").remove();
        
        commentContent.appendChild(copyComment(prevCommentContent));
        
        parentComment.querySelector("#edit-cancel").addEventListener("click", onClickCancelEdit);
        parentComment.querySelector("#edit-submit").addEventListener("click", onClickSubmitEdit);

        isEditing = 1;
    } else {
        console.log("fail");
    }
}

function returnCommentContentText(text){
    let div = document.createElement("div");
    div.setAttribute("class", "comment-content-text");

    div.innerHTML += `<p>${text}</p>`;

    return div;
}

function returnReply(){
    let span = document.createElement("span");
    span.setAttribute("class", "comment-reply");
    span.setAttribute("onclick", "onClickRep(event)");

    span.innerHTML += `reply`;

    return span;
}

function onClickCancelEdit(e){
    let parentComment = e.target.closest(".row.comment");
    let commentTextarea = parentComment.querySelector(".commenting");
    let commentContent = parentComment.querySelector(".comment-content");

    commentContent.appendChild(returnCommentContentText(prevCommentContent));
    commentTextarea.remove();
    $(returnReply()).insertBefore(`.comment-time-reply`);
    isEditing = 0;
}
    
$(document).ready(function() {

    $("#comment-send-btn").click(function(e) {
      e.preventDefault();
        
      // Send the form data to the server using AJAX
      const formData = $('#comment-form').serialize();

      // Send the form data to the server using AJAX
      $.ajax({
        url: '/post/comment', 
        method: 'POST',
        data: formData,
        success: function(data) {
          console.log(data.message);
          location.reload(); // Refresh the page to get the updated comments

        },
        error: function(error) {
          console.error('Error submitting form:', error);
        }
      });

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
            
          window.location.href = 'post/'+data.id; 
        },
        error: function(error) {
          console.error('Error submitting form:', error);
        }
      });
  
  });
  });
  
  
  $(document).ready(function() {
  
    $("#delete-comment-btn").click(function(e) {
  
      console.log("HERE");
      e.preventDefault();
    
      if($("#comment_id").val() !== "") {
        const postId = $("#comment_id").val();
    
      $.ajax({
        url: `/post/${postId}`,
        method: 'DELETE',
        success: function(data) {
          // Handle the success response (e.g., show a success message or refresh the page)
          window.location.reload(); 
        },
        error: function(error) {
          // Handle the error response (e.g., show an error message)
          console.error('Error deleting comment:', error);
          alert('An error occurred while deleting the comment.');
        },
      });
      } else {
        window.location.reload(); 
      }
      
    });
    });