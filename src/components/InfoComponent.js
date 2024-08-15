import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import GlitchText from "react-glitch-text";

const InfoComponent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleInfo = () => setIsOpen(!isOpen);

  return (
    <>
      <button
        onClick={toggleInfo}
        className="fixed top-4 right-4 z-50 text-white rounded-full p-2 shadow-lg"
      >
        <Info size={24} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 text-white rounded-lg p-6 max-w-md w-full mx-4 relative"
            >
              <button
                onClick={toggleInfo}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold mb-4 text-center">
                <GlitchText color1="cyan" color2="white">
                  Glitchy Chat Guide
                </GlitchText>
              </h2>
              <p className="mb-4">
                Welcome to Glitchy Chat! Type in reverse to send messages.
              </p>
              <h3 className="text-xl font-semibold mb-2">How to Type:</h3>
              <p className="mb-2">
                1. Start normal
                <br />
                2. Switch direction after each letter
              </p>
              <h3 className="text-xl font-semibold mb-2">Examples:</h3>
              <ul className="list-disc list-inside mb-4 space-y-2">
                <li>
                  <span className="font-bold">hello</span> → type as{" "}
                  <span className="font-bold text-cyan-400">lelho</span>
                </li>
                <li>
                  <span className="font-bold">glitch</span> → type as{" "}
                  <span className="font-bold text-cyan-400">
                    iltgc-[space]-h
                  </span>
                </li>
              </ul>
              <p className="text-sm italic">
                Embrace the glitch and have fun chatting!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InfoComponent;
