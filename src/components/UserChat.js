import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "../@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { auth, db } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const UserChat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, "chats", user.uid, "messages"),
          orderBy("timestamp")
        ),
        (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      );
      return () => unsubscribe();
    }
  }, [user]);

  const signIn = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      setUser(result.user);
    } catch (error) {
      setError("Failed to sign in. Please try again.");
    }
  };

  const sendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        await addDoc(collection(db, "chats", user.uid, "messages"), {
          text: inputMessage,
          sender: user.uid,
          timestamp: new Date(),
        });
        setInputMessage("");
      } catch (error) {
        setError("Failed to send message. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value.split("").reverse().join(""));
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          onClick={signIn}
          className="bg-blue-500 text-white rounded px-4 py-2"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat with Me</h1>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.sender === user.uid ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`rounded px-2 py-1 inline-block ${
                message.sender === user.uid
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
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
          className="border rounded p-2 w-full"
          placeholder="Type your message in reverse"
        />
      </div>
      <button
        onClick={sendMessage}
        className="w-full bg-blue-500 text-white rounded px-4 py-2"
      >
        Send Message
      </button>
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
