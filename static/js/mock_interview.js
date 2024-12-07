document.addEventListener("DOMContentLoaded", () => {
    const descriptionInput = document.getElementById("interview-description");
    const prepareQuestionsBtn = document.getElementById("prepare-questions-btn");
    const questionsContainer = document.getElementById("questions-container");

    // Function to fetch interview questions
    prepareQuestionsBtn.addEventListener("click", () => {
        const description = descriptionInput.value.trim();

        if (!description) {
            alert("Please provide a description of your interview.");
            return;
        }
        fetch("/mock-interview/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.questions) {
                    renderQuestions(data.questions);
                } else {
                    alert("Failed to generate questions. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Something went wrong while generating questions.");
            });
    });

    // Function to render questions with input and feedback
    const renderQuestions = (questions) => {
        questionsContainer.innerHTML = ""; // Clear previous content

        // Filter out empty or invalid questions
        const validQuestions = questions.filter((q) => q && q.trim().length > 0);

        validQuestions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question-card");

            const questionText = document.createElement("p");
            questionText.classList.add("question-text");
            questionText.textContent = question; // Use the exact question text from the server

            questionDiv.appendChild(questionText);

            // Skip adding input and submit button for the first descriptive line
            if (index === 0 && !question.trim().endsWith("?")) {
                questionsContainer.appendChild(questionDiv);
                return;
            }

            const answerInput = document.createElement("textarea");
            answerInput.classList.add("answer-input");
            answerInput.placeholder = "Type your answer here...";

            const submitButton = document.createElement("button");
            submitButton.classList.add("submit-btn");
            submitButton.textContent = "Submit Answer";

            submitButton.addEventListener("click", () => {
                const userAnswer = answerInput.value.trim();

                if (!userAnswer) {
                    alert("Please provide an answer before submitting.");
                    return;
                }

                // Send the answer for evaluation
                fetch("/mock-interview/evaluate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ question, answer: userAnswer }),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        const feedback = document.createElement("p");
                        feedback.classList.add("feedback");
                        feedback.textContent = `Feedback: ${data.feedback}`;
                        questionDiv.appendChild(feedback);
                        submitButton.disabled = true; // Prevent multiple submissions
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        alert("Failed to evaluate the answer. Please try again.");
                    });
            });

            questionDiv.appendChild(answerInput);
            questionDiv.appendChild(submitButton);

            questionsContainer.appendChild(questionDiv);
        });
    };
});
