import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import GlitchText from "react-glitch-text";
import InfoComponent from "./InfoComponent";

const UserChat = () => {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      const unsubscribe = onSnapshot(
        query(collection(db, "publicChat"), orderBy("timestamp")),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
      return () => unsubscribe();
    }
  }, [isLoggedIn]);

  const validateInput = (input) => {
    return (
      input.trim().length > 0 &&
      input.trim().length <= 20 &&
      /^[a-zA-Z0-9]+$/.test(input)
    );
  };

  const validateMessage = (input) => {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0 || trimmedInput.length > 200) {
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (validateInput(username)) {
      setIsLoggedIn(true);
    } else {
      setError(
        "Please enter a valid username (alphanumeric, 1-20 characters)."
      );
    }
  };

  const sendMessage = async () => {
    if (validateMessage(inputMessage)) {
      try {
        await addDoc(collection(db, "publicChat"), {
          text: inputMessage,
          sender: username,
          timestamp: new Date(),
        });
        setInputMessage("");
      } catch (error) {
        setError("Failed to send message. Please try again.");
      }
    } else {
      setError(
        "Invalid message. Please ensure your message is 1-200 characters."
      );
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value.split("").reverse().join(""));
  };

  const preventPaste = (e) => {
    e.preventDefault();
    setError("Pasting is not allowed!");
  };

  return (
    <div className="p-4 w-[90%] max-w-[44rem] mx-auto relative">
      <InfoComponent />
      {!isLoggedIn ? (
        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleLogin} className="flex flex-col items-center">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              className="border rounded p-2 mb-2 text-white bg-gray-700 outline-none border-none outline-non"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white rounded px-4 py-2 w-full"
            >
              Enter Chat
            </button>
          </form>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6 flex items-center justify-center">
            <GlitchText
              color1="red"
              color2="rgb(59 130 246)"
              className="text-gray-500"
            >
              <div className="text-gray-300">Glitchy Chat</div>
            </GlitchText>
          </h1>
          <div className="bg-gray-700 p-4 rounded-lg mb-4 h-96 overflow-y-auto no-scroll">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${
                  message.sender === username ? "text-right" : "text-left"
                }`}
              >
                <span className="text-xs text-gray-400">
                  {message.sender}:{" "}
                </span>
                <span
                  className={`rounded px-2 py-1 inline-block ${
                    message.sender === username
                      ? "bg-cyan-800 text-white"
                      : "bg-teal-700 text-white"
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={inputMessage}
              onChange={handleInputChange}
              onPaste={preventPaste}
              className="border rounded p-2 w-full text-white bg-gray-700 outline-none border-none"
              placeholder="Type your message in reverse (max 200 characters)"
              maxLength={200}
            />
          </div>
          <button
            onClick={sendMessage}
            className="w-full bg-cyan-800 text-white rounded px-4 py-2"
          >
            Send Message
          </button>
        </>
      )}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UserChat;
