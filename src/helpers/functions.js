export function sendMessageToClient(client, phone_number, message, res) {
  client
    .sendMessage(phone_number + "@c.us", message)
    .then((response) => {
      console.log("Message sent:", response);
      if (response.id.fromMe) {
        return res.status(200).json({
          success: true,
        });
      }
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    });
}
