// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 3000;
//
// app.use(bodyParser.urlencoded({ extended: true }));
//
// // Simple AI response logic (replace this with your actual AI logic)
// app.post('/get_response', (req, res) => {
//     const userMessage = req.body.message;
//
//     // Simulate an AI response (replace with actual AI integration)
//     const botReply = `You said: "${userMessage}". This is the bot's reply.`;
//
//     // Send the bot response back to the frontend
//     res.json({ response: botReply });
// });
//
// app.listen(port, () => {
//     console.log(`Chatbot server running on http://localhost:${port}`);
// });
//
// #####

 let hasGreeted = false;
    let isFirstMessage = true;  // Flag to track if it's the first message

    // Toggle chatbot visibility with greeting
    document.getElementById("message-icon").onclick = function() {
        var chatbot = document.getElementById("chatbot");
        if (chatbot.style.display === "none" || chatbot.style.display === "") {
            chatbot.style.display = "block";
            // Send initial greeting if not greeted yet
            if (!hasGreeted) {
                sendBotMessage("Hello! How can I assist you today?");
                hasGreeted = true;
            }
        } else {
            chatbot.style.display = "none";
        }
    };

    // Function to display bot message
    function sendBotMessage(message) {
        document.getElementById("chat-output").innerHTML += "<div class='message bot-message'><strong>Bot:</strong> " + message + "</div>";
        document.getElementById("chat-output").scrollTop = document.getElementById("chat-output").scrollHeight;
    }

    // Function to display user message
    function sendUserMessage(message) {
        document.getElementById("chat-output").innerHTML += "<div class='message user-message'><strong>You:</strong> " + message + "</div>";
        document.getElementById("chat-output").scrollTop = document.getElementById("chat-output").scrollHeight;
    }

    // Send message functionality with POST request to AI
    document.getElementById("send-btn").onclick = function() {
        var userMessage = document.getElementById("chat-input").value;
        if (userMessage !== "") {
            sendUserMessage(userMessage);

            // Handle the first user message
            if (isFirstMessage) {
                sendBotMessage("Hello! How can I assist you today?");
                isFirstMessage = false;  // Mark first message as handled
            } else {
                // POST request to get AI response for further messages
                fetch("/get_response", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: "message=" + encodeURIComponent(userMessage)
                })
                .then(response => response.json())
                .then(data => {
                    sendBotMessage(data.response);
                })
                .catch(error => {
                    console.error("Error:", error);
                    sendBotMessage("Sorry, something went wrong.");
                });
            }
        }
        document.getElementById("chat-input").value = "";
    };

    // Add enter key functionality for sending the message
    document.getElementById("chat-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            document.getElementById("send-btn").click();
        }
    });

       // Close chat functionality
    document.getElementById("close-chat-btn").onclick = function() {
        document.getElementById("chatbot").style.display = "none";
        isFirstMessage = true;  // Optionally reset first message flag
    };