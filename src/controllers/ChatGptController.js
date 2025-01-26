const axios = require("axios");
const ChatGPTService = require("../service/ChatGPTService");

class ChatGPTController {
    /**
     * Handle the /chat endpoint to process a user's message and save the response.
     */
    searchData = async (req, res) => {
        try {
            const { userId, messageContent } = req.body;

            // Validate input
            if (!userId || !messageContent) {
                return res.status(400).json({
                    error: "userId and messageContent are required in the request body.",
                });
            }

            // Make API call to ChatGPT
            const response = await axios.post(
                process.env.CHATGPT_URL,
                {
                    messages: [{ role: "user", content: messageContent }],
                    model: "openai/gpt-3.5-turbo",
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "Content-Type": "application/json",
                        "OpenAI-Organization": "SillyPilot",
                        "User-Agent": "SillyPilot/1.0.0",
                    },
                }
            );

            // Extract response from ChatGPT
            const completion = response.data;
            const responseContent =
                completion?.choices[0]?.message?.content ||
                "No response from ChatGPT";

            // Save chat data to the database
            await ChatGPTService.saveChatMessage(userId, messageContent, responseContent);
						
            // Send the response content to the frontend
            res.status(200).send(responseContent);
        } catch (error) {
            console.error(
                "Error in /chat endpoint:",
                error.response?.data || error.message
            );
            res.status(error.response?.status || 500).json({
                error: error.message || "Internal Server Error",
                details:
                    error.response?.data ||
                    "An error occurred while processing your request.",
            });
        }
    };

    /**
     * Handle the /chat-history endpoint to fetch a user's chat history.
     */
    getChatHistory = async (req, res) => {
        try {
            const { userId } = req.query;

            // Validate input
            if (!userId) {
                return res.status(400).json({
                    error: "userId is required as a query parameter.",
                });
            }

            // Fetch chat history from the database
            const chatMessages = await ChatGPTService.getChatMessages(userId);
						console.log(chatMessages);

            // Send chat messages to the frontend
            res.status(200).send(chatMessages);
        } catch (error) {
            console.error("Error fetching chat history:", error.message);
            res.status(500).json({
                error: "Failed to fetch chat history.",
                details: error.message,
            });
        }
    };
}

module.exports = new ChatGPTController();
