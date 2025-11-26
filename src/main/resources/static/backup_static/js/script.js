// Simple script for job portal interactivity

// Show confirmation before deleting a job
document.addEventListener("DOMContentLoaded", function () {
    const deleteForms = document.querySelectorAll("form[action*='/delete']");
    deleteForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            if (!confirm("Are you sure you want to delete this job?")) {
                e.preventDefault();
            }
        });
    });
});

// Auto-hide flash messages after 5 seconds
document.addEventListener("DOMContentLoaded", function () {
    const flashMessages = document.querySelectorAll(".flash-message");
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.display = "none";
        }, 5000);
    });
});
