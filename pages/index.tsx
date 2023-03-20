import { Markdown } from "@/components/Markdown";
import { ChatGPTMessage } from "@/utils/OpenAIStream";
import * as React from "react";
import ReactMarkdown from "react-markdown";

interface indexProps {}

const IndexPage: React.FC<indexProps> = ({}) => {
  const [loading, setLoading] = React.useState(false);
  const [response, setResponse] = React.useState("");
  const [messages, setMessages] = React.useState<ChatGPTMessage[]>([]);
  const [prompt, setPrompt] = React.useState("");

  const responseRef = React.useRef<null | HTMLDivElement>(null);

  const scrollToResponse = () => {
    if (responseRef.current !== null) {
      responseRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Generate a response based on the prompt when the user presses enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        // generateResponse();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generateResponse = async (prompt: string) => {
    setResponse("");
    setLoading(true);
    const result = await fetch("/api/open_ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        previousMessages: JSON.stringify(messages),
      }),
    });

    if (!result.ok) {
      throw new Error(result.statusText);
    }
    setMessages((prev) => [...prev, { role: "user", content: prompt }]);

    // This data is a ReadableStream
    const data = result.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let text = "";

    setMessages((prev) => [...prev, { role: "system", content: "" }]);
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      setMessages((prev) => {
        let lastResponse = prev.pop();
        console.log(lastResponse);

        if (lastResponse) {
          lastResponse.content += chunkValue;
          return [...prev, lastResponse];
        }
        return prev;
      });
      // text += chunkValue;
    }
    // setMessages((prev) => [...prev, { role: "system", content: text }]);
    scrollToResponse();
    setLoading(false);
  };

  return (
    <main className="flex justify-end h-screen flex-col">
      <div className="w-[648px] max-w-full mx-auto space-y-8">
        {messages.map(({ role, content }, i) => (
          <div className={role === "user" ? "text-right" : ""}>
            <Markdown markdown={content} key={i} />
          </div>
        ))}
      </div>
      {loading && <div>loading...</div>}
      <div className="border-t border-white w-full p-4 mt-8">
        <input
          className="bg-transparent focus:outline-none text-lg w-full"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // @ts-ignore
              generateResponse(e.target.value);
              setPrompt("");
            }
          }}
        />
      </div>
    </main>
  );
};
export default IndexPage;
