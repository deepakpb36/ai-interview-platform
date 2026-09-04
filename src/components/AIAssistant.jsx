import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { askAI } from "../services/aiService";

import {
  Bot,
  Send,
  X,
  Sparkles,
  Loader2,
  Trash2,
} from "lucide-react";


function AIAssistant({
  userName = "there",
  category = "Interview",
  currentQuestion = "",
  questionNumber = 1,
  totalQuestions = 5,
}) {

  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);


  /*
   * Initial greeting
   */
  useEffect(() => {

    setMessages([
      {
        role: "assistant",

        content:
          `Hey ${userName}! 👋 I'm your AI Assistant. I'm here to help you with your questions, interview preparation, or anything else you want to ask.`,
      },
    ]);

  }, [userName]);


  /*
   * Scroll to latest message
   */
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, isLoading]);


  /*
   * Focus input when opened
   */
  useEffect(() => {

    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {

      inputRef.current?.focus();

    }, 100);

    return () => clearTimeout(timer);

  }, [isOpen]);


  /*
   * Send message
   */
  const handleSend = async () => {

    const text = message.trim();


    if (!text || isLoading) {
      return;
    }


    /*
     * Save the conversation BEFORE
     * adding the new AI response.
     *
     * This history is sent to OpenRouter.
     */
    const conversationHistory = messages
      .filter(
        (item) =>
          item &&
          typeof item.content === "string" &&
          item.content.trim()
      )
      .map((item) => ({
        role:
          item.role === "assistant"
            ? "assistant"
            : "user",

        content: item.content.trim(),
      }));


    /*
     * Show user message immediately.
     */
    setMessages((previous) => [

      ...previous,

      {
        role: "user",
        content: text,
      },

    ]);


    setMessage("");

    setIsLoading(true);


    try {

      /*
       * Send message + conversation history
       * to the AI service.
       */
      const response = await askAI({

        message: text,

        userName,

        category,

        currentQuestion,

        questionNumber,

        totalQuestions,

        conversationHistory,

      });


      /*
       * Add AI response.
       */
      setMessages((previous) => [

        ...previous,

        {
          role: "assistant",

          content:
            response ||
            "Sorry, I couldn't generate a response.",
        },

      ]);

    } catch (error) {

      console.error(
        "AI Assistant Error:",
        error
      );


      /*
       * Friendly error message.
       */
      setMessages((previous) => [

        ...previous,

        {
          role: "assistant",

          content:
            "Sorry, I couldn't connect to the AI right now. Please try again.",
        },

      ]);

    } finally {

      setIsLoading(false);

    }

  };


  /*
   * Enter = Send
   *
   * Shift + Enter = New line
   */
  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }

  };


  /*
   * Clear conversation
   */
  const clearConversation = () => {

    setMessages([
      {
        role: "assistant",

        content:
          `Hey ${userName}! 👋 I'm your AI Assistant. How can I help you today?`,
      },
    ]);

    setMessage("");

  };


  /*
   * Floating button
   */
  if (!isOpen) {

    return (

      <button
        type="button"

        onClick={() => setIsOpen(true)}

        className="
          fixed
          bottom-6
          right-6
          z-50

          w-16
          h-16

          rounded-full

          bg-blue-600
          hover:bg-blue-700

          text-white

          shadow-2xl

          flex
          items-center
          justify-center

          transition-all
          duration-200

          hover:scale-105
        "

        aria-label="Open AI Assistant"
      >

        <Bot size={30} />


        {/* Online indicator */}

        <span
          className="
            absolute

            -top-1
            -right-1

            w-4
            h-4

            bg-green-500

            border-2
            border-white
            dark:border-slate-900

            rounded-full
          "
        />

      </button>

    );

  }


  return (

    <div
      className="
        fixed

        bottom-6
        right-6

        z-50

        w-[calc(100vw-32px)]

        sm:w-[390px]

        max-w-[390px]

        h-[560px]

        flex
        flex-col

        overflow-hidden

        rounded-3xl

        border
        border-gray-200
        dark:border-slate-700

        bg-white
        dark:bg-slate-900

        shadow-2xl
      "
    >


      {/* =========================
          HEADER
      ========================== */}

      <div
        className="
          flex
          items-center
          justify-between

          px-5
          py-4

          bg-blue-600
          dark:bg-blue-700

          text-white
        "
      >

        <div className="flex items-center gap-3">

          <div
            className="
              w-11
              h-11

              rounded-2xl

              bg-white/15

              flex
              items-center
              justify-center

              relative
            "
          >

            <Bot size={25} />


            {/* Online dot */}

            <span
              className="
                absolute

                -right-1
                -bottom-1

                w-3
                h-3

                rounded-full

                bg-green-400

                border-2
                border-blue-600
              "
            />

          </div>


          <div>

            <div className="flex items-center gap-2">

              <h2 className="font-bold text-base">
                AI Assistant
              </h2>

              <Sparkles size={15} />

            </div>


            <div
              className="
                flex
                items-center
                gap-2
                mt-0.5
              "
            >

              <span
                className="
                  w-2
                  h-2
                  rounded-full
                  bg-green-400
                "
              />

              <span
                className="
                  text-xs
                  text-blue-100
                "
              >
                Online • Ready to help
              </span>

            </div>

          </div>

        </div>


        {/* Header buttons */}

        <div className="flex items-center gap-1">

          <button
            type="button"

            onClick={clearConversation}

            className="
              w-9
              h-9

              rounded-xl

              hover:bg-white/10

              flex
              items-center
              justify-center

              transition
            "

            aria-label="Clear conversation"

            title="Clear conversation"
          >

            <Trash2 size={18} />

          </button>


          <button
            type="button"

            onClick={() => setIsOpen(false)}

            className="
              w-9
              h-9

              rounded-xl

              hover:bg-white/10

              flex
              items-center
              justify-center

              transition
            "

            aria-label="Close AI Assistant"
          >

            <X size={21} />

          </button>

        </div>

      </div>


      {/* =========================
          INTERVIEW CONTEXT
      ========================== */}

      {currentQuestion && (

        <div
          className="
            px-4
            py-3

            border-b
            border-gray-200
            dark:border-slate-800

            bg-gray-50
            dark:bg-slate-950
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-3
            "
          >

            <p
              className="
                text-[11px]
                font-semibold

                text-gray-500
                dark:text-gray-400

                uppercase
                tracking-wide
              "
            >
              Current Question
            </p>


            <span
              className="
                text-[10px]
                font-semibold

                px-2
                py-1

                rounded-full

                bg-blue-100
                dark:bg-blue-900/30

                text-blue-600
                dark:text-blue-400
              "
            >
              {questionNumber}/{totalQuestions}
            </span>

          </div>


          <p
            className="
              mt-1

              text-xs

              text-gray-700
              dark:text-gray-300

              line-clamp-2
            "
          >
            {currentQuestion}
          </p>

        </div>

      )}


      {/* =========================
          MESSAGES
      ========================== */}

      <div
        className="
          flex-1

          overflow-y-auto

          p-4

          space-y-4

          bg-gray-50
          dark:bg-slate-950
        "
      >

        {messages.map((item, index) => (

          <div
            key={`${item.role}-${index}`}

            className={`
              flex

              ${
                item.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }
            `}
          >

            <div
              className={`
                max-w-[85%]

                rounded-2xl

                px-4
                py-3

                text-sm

                leading-relaxed

                whitespace-pre-wrap

                break-words

                ${
                  item.role === "user"

                    ? `
                      bg-blue-600
                      text-white
                      rounded-br-md
                    `

                    : `
                      bg-white
                      dark:bg-slate-900

                      text-gray-800
                      dark:text-gray-200

                      border
                      border-gray-200
                      dark:border-slate-800

                      rounded-bl-md

                      shadow-sm
                    `
                }
              `}
            >

              {item.content}

            </div>

          </div>

        ))}


        {/* =========================
            AI LOADING
        ========================== */}

        {isLoading && (

          <div className="flex justify-start">

            <div
              className="
                flex
                items-center
                gap-2

                px-4
                py-3

                rounded-2xl
                rounded-bl-md

                bg-white
                dark:bg-slate-900

                border
                border-gray-200
                dark:border-slate-800

                text-gray-500
                dark:text-gray-400

                text-sm

                shadow-sm
              "
            >

              <Loader2
                size={17}
                className="animate-spin"
              />

              <span>
                Thinking...
              </span>

            </div>

          </div>

        )}


        <div ref={messagesEndRef} />

      </div>


      {/* =========================
          INPUT
      ========================== */}

      <div
        className="
          p-3

          border-t
          border-gray-200
          dark:border-slate-800

          bg-white
          dark:bg-slate-900
        "
      >

        <div
          className="
            flex
            items-end
            gap-2

            rounded-2xl

            border
            border-gray-300
            dark:border-slate-700

            bg-gray-50
            dark:bg-slate-950

            p-2

            focus-within:border-blue-500

            focus-within:ring-2
            focus-within:ring-blue-500/20

            transition
          "
        >

          <textarea
            ref={inputRef}

            value={message}

            onChange={(event) =>
              setMessage(event.target.value)
            }

            onKeyDown={handleKeyDown}

            placeholder="Ask me anything..."

            rows={1}

            disabled={isLoading}

            className="
              flex-1

              resize-none

              bg-transparent

              border-none

              outline-none

              px-2
              py-2

              text-sm

              text-gray-900
              dark:text-white

              placeholder-gray-400
              dark:placeholder-gray-500

              disabled:opacity-50

              max-h-32
            "
          />


          <button
            type="button"

            onClick={handleSend}

            disabled={
              !message.trim() ||
              isLoading
            }

            className="
              w-10
              h-10

              rounded-xl

              bg-blue-600
              hover:bg-blue-700

              disabled:bg-gray-400

              disabled:cursor-not-allowed

              text-white

              flex
              items-center
              justify-center

              transition

              flex-shrink-0
            "

            aria-label="Send message"
          >

            <Send size={18} />

          </button>

        </div>


        <p
          className="
            text-center

            text-[10px]

            text-gray-400
            dark:text-gray-500

            mt-2
          "
        >
          AI Assistant • English • Hindi • Punjabi • Hinglish
        </p>

      </div>

    </div>

  );
}


export default AIAssistant;