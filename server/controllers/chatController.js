const chatController = {
    handleMessage: async (req, res) => {
        try {
            const { message } = req.body;
            const lowerMsg = message.toLowerCase();

            let response = "I'm not sure about that. Try asking about 'adoption', 'vets', or 'listings'.";

            if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
                response = "Hello! How can I help you with your pet queries today?";
            } else if (lowerMsg.includes('adopt') || lowerMsg.includes('buy')) {
                response = "You can browse our Marketplace to find pets available for adoption or sale.";
            } else if (lowerMsg.includes('vet') || lowerMsg.includes('doctor')) {
                response = "Check out our Vets page to find qualified veterinarians near you.";
            } else if (lowerMsg.includes('register') || lowerMsg.includes('account')) {
                response = "You can sign up or log in using the buttons in the navigation bar.";
            } else if (lowerMsg.includes('thank')) {
                response = "You're welcome! Paws and love! 🐾";
            }

            res.status(200).json({ reply: response });
        } catch (error) {
            console.error('Chat error:', error);
            res.status(500).json({ reply: "Sorry, something went wrong with the chatbot." });
        }
    }
};

module.exports = chatController;
