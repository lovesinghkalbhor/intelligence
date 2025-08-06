import { NextFunction, Request, Response } from "express";
import axios from "axios";
import { asyncHandler } from "../utils/asyncHandler";
import Thread from "../../models/threads";
import { formatContentForGroq } from "../utils/helperFunctions";
import { totalmem } from "os";
// import { ApiResponse } from "../utils/ApiResponse"; // Removed ApiResponse import

const newMessage = async (title: string) => {
  const data = {
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "user",
        content:
          `Your taks is to create a title out of this sentence or word give me short and concise and only give me one title.
          what should not to do: 
          1) do not give more suggestion
          2) do not try to explain
          3) do not give response more then 10 words. 


          Example :
          
          user: give me the list of movies sciencefiction released this year
          response : Latest Sci-Fi Releases: 2023
          
          ` + title,
      },
    ],
  };

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    data,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
};

const handleChatMessage = asyncHandler(async (req: Request, res: Response) => {
  const { threadId, message, imageBase64 } = req.body; // threadId is optional

  if (!message && !imageBase64) {
    // Message OR image is required
    return res.status(400).json({
      success: false,
      message: "Message content or an image is required.",
    });
  }

  let thread;
  console.log(await newMessage(message));

  if (threadId) {
    thread = await Thread.findById(threadId);

    if (thread?.messages.length == 0) {
      thread.title = await newMessage(message);
    }
    if (!thread) {
      return res
        .status(404)
        .json({ success: false, message: "Thread not found." });
    }
  } else {
    // Create a new thread if no threadId is provided
    thread = new Thread({ title: await newMessage(message) }); // Use first message as title
  }

  const currentUserContent: Array<any> = [{ type: "text", text: message }];
  if (imageBase64) {
    currentUserContent.push({
      type: "image_url",
      image_url: {
        url: imageBase64,
      },
    });
  }
  // }
  // Add user's message to the thread in the format consistent with Groq's multimodal needs
  thread.messages.push({ role: "user", content: message });

  const groqMessages = thread.messages.map((msg: any) => {
    // If it's the current message and has an image, send multimodal format
    if (msg.role === "user" && msg.content === message && imageBase64) {
      return {
        role: "user",
        content: [
          { type: "text", text: message },
          {
            type: "image_url",
            image_url: {
              url: imageBase64,
            },
          },
        ],
      };
    }

    return {
      role: msg.role,
      content: formatContentForGroq(msg.content),
    };
  });
  // Call LLM API (reusing logic from newMessage)
  const llmRequestData = {
    model: req.body.model || "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: groqMessages,

    temperature: 0.7,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    stop: null,
    // Filter messages
  };

  const llmResponse = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    llmRequestData,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
      },
    }
  );

  const assistantMessageContent = llmResponse.data.choices[0].message.content;

  // Add LLM's response to the thread
  thread.messages.push({ role: "assistant", content: assistantMessageContent });
  thread.updatedAt = new Date();

  // Save the updated thread
  await thread.save();

  return res.status(200).json({
    success: true,
    data: {
      threadId: thread._id,
      userMessage: message,
      assistantMessage: assistantMessageContent,
    },
    message: "Message processed successfully.",
  });
});

export { newMessage, handleChatMessage }; // Export handleChatMessage
