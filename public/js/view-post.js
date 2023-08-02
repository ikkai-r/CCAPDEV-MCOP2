// Reference Code for Nested Comments: https://youtu.be/a4OA7QbHEho

let commentContainer = document.getElementById("comment-container");
var isCommenting = 0;
var isEditing = 0;
var element;

var prevCommentContent;

let upvote = document.querySelector(".votes-cont i.fa-circle-up");
let downvote = document.querySelector(".votes-cont i.fa-circle-down");

let shareButton = document.querySelector(".share-cont");

function createTextarea (commentId) {
    let div = document.createElement("div");
    div.setAttribute("class", "commenting mt-2");
    div.setAttribute("id", "commenting");

    div.innerHTML += `
    <form id="reply-form" method="post">
    <input type="hidden" id="parent_comment_id" name="parent_comment_id" value="`+commentId+`">
    <textarea class="reply-textarea comment-textarea" contenteditable="true" placeholder="add text here" name="reply_content"></textarea>
    <div class="d-flex justify-content-between">
        <button class="cancel-comment pill" id="comment-cancel" style="background-color: #DBDBDB;">cancel</button>
        <button class="submit-comment pill" id="submit_comment" style="background-color: #D4A373;">send</button>
    </div>
    </form>`;

    return div;
}



function onClickRep(e) {
    let closest = e.target.closest(".all-comment");
    const commentId = $(e.target).closest(".all-comment").find("#comment_id").val();
    if (isCommenting == 0) {
        closest.appendChild(createTextarea (commentId));
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

$(document).ready(function() {
$(".comment-container").click(function (e) {
    let closest = e.target.closest(".all-comment");
    console.log(e.target);
    $(".submit-comment").unbind().click(function (e) {
        e.preventDefault();
        console.log("HEREEE");

        const commentTextarea = $(".reply-textarea");

        if (commentTextarea.val()) {
            // Send the form data to the server using AJAX
            const formData = $('#reply-form').serialize();
            console.log(formData);

            // Send the form data to the server using AJAX
            $.ajax({
                url: '/post/reply', 
                method: 'POST',
                data: formData,
                success: function(data) {
                console.log(data.message);
                window.location.reload(); // Refresh the page to get the updated comments

                },
                error: function(error) {
                console.error('Error submitting form:', error);
                }
            });

        }
     });
});
});

upvote.addEventListener("click", function(e){
    e.preventDefault();
    var upvoteCount = parseInt($(this).closest(".votes-cont").find("#upvote-amnt").text());
    var downvoteCount = parseInt($(this).closest(".votes-cont").find("#downvote-amnt").text());
    console.log("upvote " + upvoteCount + " downvote: " + downvoteCount);
   
    try{
        // check if upvoted already?
        var voteForm = $('#upvoteForm').serialize();

        $.ajax({
            url: '/post/' + $('#post_id').val(), 
            method: 'POST',
            data: voteForm,
            success: function(data) {
                console.log(data.message);
            },
            error: function(error) {
              console.error('Error submitting form:', error);
            }
          
        });
            
           
    }catch(error){
        console.log(error);
    }
  
        //upvote
        if($(this).hasClass('fa-regular')) {
            var downVoteElement = $(this).closest(".votes-cont").find("#downvote-btn");  

            if(downVoteElement.hasClass('fa-solid')) {
                downVoteElement.removeClass('fa-solid');
                downVoteElement.addClass('fa-regular');
                $(this).closest(".votes-cont").find("#downvote-amnt").text(downvoteCount - 1);
            } 
    
            $(this).removeClass('fa-regular');
            $(this).addClass('fa-solid');
            $(this).closest(".votes-cont").find("#upvote-amnt").text(upvoteCount + 1);
        } else {
            $(this).removeClass('fa-solid');
            $(this).addClass('fa-regular');
            $(this).closest(".votes-cont").find("#upvote-amnt").text(upvoteCount - 1);
        }
        document.getElementById("upvote-amnt").style.fontWeight = "bold";


    
});


downvote.addEventListener("click", function(e){
    e.preventDefault();

    var upvoteCount = parseInt($(this).closest(".votes-cont").find("#upvote-amnt").text());
    var downvoteCount = parseInt($(this).closest(".votes-cont").find("#downvote-amnt").text());
    console.log("upvote " + upvoteCount + " downvote: " + downvoteCount);

    try{
        var voteForm = $('#downvoteForm').serialize();

        $.ajax({
            url: '/post/' + $('#post_id').val(), 
            method: 'POST',
            data: voteForm,
            success: function(data) {
                console.log(data.message);
            },
            error: function(error) {
              console.error('Error submitting form:', error);
            }
          
        });
    } catch(error){
        console.log(error);
    }


    //downvote
    if($(this).hasClass('fa-regular')) {
        var upVoteElement =  $(this).closest(".votes-cont").find("#upvote-btn");  

        if(upVoteElement.hasClass('fa-solid')) {
            upVoteElement.removeClass('fa-solid');
            upVoteElement.addClass('fa-regular');
            $(this).closest(".votes-cont").find("#upvote-amnt").text(upvoteCount - 1);
        }

        $(this).removeClass('fa-regular');
        $(this).addClass('fa-solid');
        $(this).closest(".votes-cont").find("#downvote-amnt").text(downvoteCount + 1);
    } else {
        $(this).removeClass('fa-solid');
        $(this).addClass('fa-regular');
        $(this).closest(".votes-cont").find("#downvote-amnt").text(downvoteCount - 1);
    }

    document.getElementById("downvote-amnt").style.fontWeight = "bold";

   
});

$(document).on("click", ".comment-proper-votes", function (e) {
    var form = {"comment_id":  $(this).parent().parent().find("#this_comment_id").val()};
    var voteCount = $(this).closest(".com-votes-cont").find(".comment-vote-cont .com-prop-amnt");
    
    try{
    
         if($(this).hasClass('fa-circle-up')) {
        // check if upvoted already?
        $.ajax({
            url: '/post/up_comment' ,
            method: 'POST',
            data: form,
            success: function(data) {
                console.log(data.message);
                //window.location.reload(); // Refresh the page to get the updated comments
            },
            error: function(error) {
              console.error('Error submitting form:', error);
            }
          
        });
        }else {

            $.ajax({
                url: '/post/down_comment', 
                method: 'POST',
                data: form,
                success: function(data) {
                    console.log(data.message);
                    //window.location.reload(); // Refresh the page to get the updated comments
                },
                error: function(error) {
                  console.error('Error submitting form:', error);
                }
              
            });
        }
    }catch(error){
        console.log(error);
    }
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

// $(document).on("click", ".comments-cont", function (e){
//     let commentContainer = document.querySelector(".comment-container");

//     if (isCommenting == 0){
//         commentContainer.appendChild(createTextarea ());
//         element = document.getElementById("comment-cancel");
//         isCommenting = 1;
//         element.addEventListener("click", onClickCancel);
//     }
    
// });

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
          window.location.reload(); // Refresh the page to get the updated comments

        },
        error: function(error) {
          console.error('Error submitting form:', error);
        }
      });

});
});


// $(document).ready(function() {

//     $("#submit_comment").click(function(e) {
//       e.preventDefault();
//       console.log("HEREEE");
//     //   // Send the form data to the server using AJAX
//     //   const formData = $('#reply-form').serialize();

//     //   // Send the form data to the server using AJAX
//     //   $.ajax({
//     //     url: '/post/reply', 
//     //     method: 'POST',
//     //     data: formData,
//     //     success: function(data) {
//     //       console.log(data.message);
//     //     },
//     //     error: function(error) {
//     //       console.error('Error submitting form:', error);
//     //     }
//     //   });

// });
// });
  
  $(document).ready(function() {
  
    $(".delete-comment-btn").click(function(e) {

      e.preventDefault();
    
      const postId = $(this).closest(".comment-options-menu").find("#comment_id").val();
      if(postId !== "") {
    
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