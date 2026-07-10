import { Bot, Sparkles, MessageSquare } from "lucide-react";

function AIAssistant() {
  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 shadow-lg">

      <div className="flex items-center gap-3">

        <div className="bg-white/20 p-3 rounded-xl">
          <Bot size={28} className="text-white" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white">
            AI Interview Assistant
          </h2>

          <p className="text-blue-100">
            Practice smarter with AI
          </p>
        </div>

      </div>

      <div className="mt-8 space-y-4">

        <button className="w-full flex items-center gap-3 bg-white/15 hover:bg-white/25 transition rounded-xl p-4 text-white">

          <Sparkles />

          Generate Interview Questions

        </button>

        <button className="w-full flex items-center gap-3 bg-white/15 hover:bg-white/25 transition rounded-xl p-4 text-white">

          <MessageSquare />

          Start Mock Interview

        </button>

      </div>

      <div className="mt-8 bg-white/10 rounded-xl p-4">

        <p className="text-blue-100 text-sm">
          💡 Tip of the Day
        </p>

        <p className="text-white mt-2">
          Explain every answer with confidence and give real-world examples whenever possible.
        </p>

      </div>

    </div>
  );
}

export default AIAssistant;