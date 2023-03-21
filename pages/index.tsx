import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { Markdown } from "@/components/Markdown";
import { ChatGPTMessage } from "@/utils/OpenAIStream";
import * as React from "react";

interface indexProps {}

const IndexPage: React.FC<indexProps> = ({}) => {
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatGPTMessage[]>([]);
  const [prompt, setPrompt] = React.useState("");

  const responseRef = React.useRef<null | HTMLDivElement>(null);
  const inputRef = React.useRef<null | HTMLInputElement>(null);

  const scrollToResponse = () => {
    if (inputRef.current !== null) {
      inputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const generateResponse = async (prompt: string) => {
    setLoading(true);
    const controller = new AbortController();
    const { signal } = controller;
    try {
      const result = await fetch("/api/open_ai", {
        method: "POST",
        signal,
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

      // add event listener to button click event
      const abortButton = document.getElementById("abort-button");
      if (abortButton) {
        abortButton.addEventListener("click", () => {
          controller.abort();
        });
      }

      setMessages((prev) => [...prev, { role: "system", content: "" }]);
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (signal.aborted) {
          done = true;
          controller.abort();
        }

        const chunkValue = decoder.decode(value);

        setMessages((prev) => {
          let lastResponse = prev.pop();

          if (lastResponse) {
            lastResponse.content += chunkValue;
            return [...prev, lastResponse];
          }
          return prev;
        });
        scrollToResponse();
      }
      setLoading(false);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Aborted");
        setLoading(false);
      }
    }
  };

  return (
    <main className="h-screen overflow-y-auto">
      <div className="w-[648px] max-w-full min-h-full pb-24 mx-auto flex justify-end flex-col text-lg leading-relaxed ">
        <div className="space-y-8">
          {messages.map(({ role, content }, i) => (
            <div className={role === "user" ? "text-right" : ""}>
              <Markdown markdown={content} key={i} />
            </div>
          ))}
          <div ref={responseRef} />
        </div>
        <Input
          //@ts-ignore
          ref={inputRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onEnter={(e: any) => {
            generateResponse(e.target.value);
            setPrompt("");
          }}
          loading={loading}
        />
      </div>
      <div className="absolute left-8 bottom-8 space-y-4">
        <IconButton
          icon="trash"
          label="Empty conversation"
          size={24}
          onClick={() => setMessages([])}
        />
        <IconButton
          id="abort-button"
          icon="close"
          label="Stop answer"
          size={24}
          onClick={() => {}}
        />
      </div>
    </main>
  );
};
export default IndexPage;
