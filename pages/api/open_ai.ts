import {
  ChatGPTMessage,
  OpenAIStream,
  OpenAIStreamPayload,
} from "../../utils/OpenAIStream";

if (!process.env.OPEN_AI_TOKEN) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request): Promise<Response> => {
  const { prompt, previousMessages } = (await req.json()) as {
    prompt?: string;
    previousMessages?: string;
  };

  if (!prompt) {
    return new Response("No prompt in the request", { status: 400 });
  }
  if (!previousMessages) {
    return new Response("No previous messages in the request", { status: 400 });
  }

  const messages: ChatGPTMessage[] = [
    {
      role: "system",
      content: "All responses should be formated as markdown",
    },
    ...(JSON.parse(previousMessages) || []),
    { role: "user", content: prompt },
  ];

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 2000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
};

export default handler;
