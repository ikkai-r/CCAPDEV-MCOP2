// Get all post containers
const postContainers = document.querySelectorAll(".profile-post");

document.addEventListener("DOMContentLoaded", function() {
    // Get the query parameter from the URL
    var queryParams = new URLSearchParams(window.location.search);
    var msg = queryParams.get("msg");
    // Check if the message is "logout" and display the logout message
    if (msg === "logout") {
        $('#logoutModal').modal('show');

        setTimeout(function() {
            $('#logoutModal').modal('hide');
        }, 1500)
    }
});

function redirectToPage(url) {
    window.location.href = url;
}

// For upvotes, downvotes and vote amount
// Attach event listeners to each post container
postContainers.forEach((container) => {
    const upvoteBtn = container.querySelector(".upvote-btn");
    const downvoteBtn = container.querySelector(".downvote-btn");
    const upvoteAmnt = container.querySelector(".upvote-amnt");
    const downvoteAmnt = container.querySelector(".downvote-amnt");

    let upvoteAlready = false;
    let downvoteAlready = false;

    upvoteBtn.addEventListener("click", function () {
        if (downvoteAlready && !upvoteAlready) {
            downvoteAmnt.textContent = parseInt(downvoteAmnt.textContent) - 1;
            upvoteAmnt.textContent = parseInt(upvoteAmnt.textContent) + 1;
            upvoteAlready = true;
            downvoteAlready = false;

            upvoteBtn.classList.remove("fa-regular");
            upvoteBtn.classList.add("fa-solid");
            downvoteBtn.classList.add("fa-regular");
            downvoteBtn.classList.remove("fa-solid");
        } else if (!upvoteAlready) {
            upvoteAmnt.textContent = parseInt(upvoteAmnt.textContent) + 1;
            upvoteAlready = true;

            upvoteBtn.classList.remove("fa-regular");
            upvoteBtn.classList.add("fa-solid");
            downvoteBtn.classList.add("fa-regular");
            downvoteBtn.classList.remove("fa-solid");
        }
        else {
            upvoteAmnt.textContent = parseInt(upvoteAmnt.textContent) - 1;
            upvoteAlready = false;

            upvoteBtn.classList.remove("fa-solid");
            upvoteBtn.classList.add("fa-regular");
        }

        
    });

    downvoteBtn.addEventListener("click", function () {
        if (upvoteAlready && !downvoteAlready) {
            upvoteAmnt.textContent = parseInt(upvoteAmnt.textContent) - 1;
            downvoteAmnt.textContent = parseInt(downvoteAmnt.textContent) + 1;
            downvoteAlready = true;
            upvoteAlready = false;

            downvoteBtn.classList.remove("fa-regular");
            downvoteBtn.classList.add("fa-solid");
            upvoteBtn.classList.add("fa-regular");
            upvoteBtn.classList.remove("fa-solid");
            
            document.getElementById("upvote-amnt").style.fontWeight = "bold";
        } else if (!downvoteAlready) {
            downvoteAmnt.textContent = parseInt(downvoteAmnt.textContent) + 1;
            downvoteAlready = true;

            downvoteBtn.classList.remove("fa-regular");
            downvoteBtn.classList.add("fa-solid");
            upvoteBtn.classList.add("fa-regular");
            upvoteBtn.classList.remove("fa-solid");
            
            document.getElementById("upvote-amnt").style.fontWeight = "bold";
        }
        else {
            downvoteAmnt.textContent = parseInt(downvoteAmnt.textContent) - 1;
            downvoteAlready = false;

            downvoteBtn.classList.remove("fa-solid");
            downvoteBtn.classList.add("fa-regular");
        
            document.getElementById("upvote-amnt").style.fontWeight = "bold";
        }
        
    });
});