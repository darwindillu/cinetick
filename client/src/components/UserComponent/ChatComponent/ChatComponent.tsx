import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import axios from "axios";
import baseUrl from "../../../utils/Url";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Floating AI assistant that answers questions and recommends movies now showing
const ChatInterface: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userMessage, setUserMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async (): Promise<void> => {
    const text = userMessage.trim();
    if (!text || loading) return;

    const history = messages;
    setMessages([...history, { role: "user", content: text }]);
    setLoading(true);
    setUserMessage("");

    try {
      const response = await axios.post(`${baseUrl}chat`, { message: text, history });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Error fetching response from the assistant:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Sorry, I couldn't process your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") handleSendMessage();
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={styles.launcher} aria-label="Open movie assistant">
        <i className="fa-solid fa-comments"></i>
      </button>
    );
  }

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <span>CineTick Assistant</span>
        <button onClick={() => setOpen(false)} style={styles.close} aria-label="Close assistant">×</button>
      </div>

      <div style={styles.chatBox}>
        {messages.length === 0 && (
          <p style={styles.hint}>Ask me for a movie suggestion, e.g. "a family movie in Malayalam".</p>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: msg.role === "user" ? "#d3f8d3" : "#e3e3e3",
            }}
          >
            <p style={{ margin: 0 }}>{msg.content}</p>
          </div>
        ))}
        {loading && <p style={styles.hint}>Thinking…</p>}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={userMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          style={styles.input}
        />
        <button onClick={handleSendMessage} disabled={loading} style={styles.button}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  launcher: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    border: "none",
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: "22px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  chatContainer: {
    position: "fixed",
    right: "24px",
    bottom: "24px",
    display: "flex",
    flexDirection: "column",
    height: "420px",
    width: "320px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    color: "#222",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 600,
    marginBottom: "8px",
  },
  close: {
    border: "none",
    background: "transparent",
    fontSize: "20px",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "10px",
    display: "flex",
    flexDirection: "column",
  },
  hint: {
    color: "#777",
    fontSize: "13px",
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
