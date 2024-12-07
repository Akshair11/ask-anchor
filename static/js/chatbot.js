document.addEventListener("DOMContentLoaded", () => {
    const chatbox = document.getElementById("chatbox");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Send user message and fetch bot response
    sendBtn.addEventListener("click", () => {
        const message = userInput.value.trim();
        if (message) {
            appendMessage("You", message, "user-message");
            fetch("/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message }),
            })
                .then((response) => response.json())
                .then((data) => {
                    const botResponse = data.response || "I'm not sure how to respond.";
                    appendMessage("Bot", formatResponse(botResponse), "bot-message");
                })
                .catch((error) => {
                    console.error("Error:", error);
                    appendMessage("Bot", "Failed to connect to the server.", "bot-message");
                });
            userInput.value = "";
        }
    });

    // Format the bot's response for better readability
    const formatResponse = (response) => {
        // Replace markdown-style formatting (e.g., **text**) with plain text
        response = response.replace(/\*\*(.*?)\*\*/g, "$1");
        // Replace line breaks with <br> for multi-line formatting
        return response.replace(/\n/g, "<br>");
    };

    // Append a message to the chatbox
    const appendMessage = (sender, message, className) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", className);
        messageDiv.innerHTML = `<strong>${sender}:</strong><br>${message}`;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    };
});
