import React, { useState, ChangeEvent } from "react";
import axios from "axios";

interface Message {
  sender: "user" | "chatgpt";
  message: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async (): Promise<void> => {
    if (!userMessage) return;

    // Add user message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", message: userMessage },
    ]);

    setLoading(true);
    setUserMessage("");

    try {
      // Send user message to OpenAI
      const response = await axios.post("http://localhost:3001/chat", { message: userMessage });


      // Add response from ChatGPT to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatgpt", message: response.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error fetching response from OpenAI:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatgpt", message: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserMessage(e.target.value);
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.sender === "user" ? "#d3f8d3" : "#e3e3e3",
            }}
          >
            <p>{msg.message}</p>
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userMessage}
          onChange={handleChange}
          placeholder="Type a message"
          style={styles.input}
        />
        <button onClick={handleSendMessage} disabled={loading} style={styles.button}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: "400px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
  },
  message: {
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    maxWidth: "80%",
    wordBreak: "break-word",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginRight: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default ChatInterface;
