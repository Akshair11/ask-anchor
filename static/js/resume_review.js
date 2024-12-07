document.addEventListener("DOMContentLoaded", () => {
    const resumeForm = document.getElementById("resume-form");
    const resumeInput = document.getElementById("resume-input");
    const submitBtn = document.getElementById("submit-btn");
    const feedbackContainer = document.getElementById("feedback-container");

    submitBtn.addEventListener("click", () => {
        const file = resumeInput.files[0];
        if (!file) {
            alert("Please upload a resume file.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        fetch("/resume_review", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    alert(data.error);
                } else {
                    feedbackContainer.textContent = data.feedback;
                    feedbackContainer.style.display = "block";
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Failed to process your resume. Please try again.");
            });
    });
});
