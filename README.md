# 🤖 INTELLIGENCE my own ai assistance with Groq Integration
[Intelligence](https://intelligence.projects.growthifyservices.in)
Try this out

This is a **full-stack AI chat application** that allows users to have conversations with a Groq-powered large language model. The application supports both **text-based messages** and **multimodal messages** that include an image, with **conversation history stored in MongoDB**.

---

## 🌟 Features

- **Multimodal Chat:** Send messages with both text and an image.
- **Persistent Chat History:** Conversations are saved to a MongoDB database, allowing users to resume chats.
- **Optimistic UI Updates:** User messages appear instantly, with an optimistic state update before the AI's response is received.
- **Dynamic Chat Titles:** The title of a new chat is automatically generated from the first message sent.
- **Seamless Groq API Integration:** The backend communicates with Groq's API to process chat messages and generate responses.
- **Robust Error Handling:** The backend uses `asyncHandler` to gracefully manage errors from the API or database.

---

## 💻 Technologies Used

### Frontend (React)

- **React** – Building the UI
- **TypeScript** – Type safety
- **Vite** – Fast development and builds
- **Hooks (`useCallback`, `useState`)** – State & performance management
- **Fetch API** – Communicating with backend

### Backend (Express.js)

- **Express.js** – Web server
- **TypeScript** – Type safety
- **Mongoose** – ODM for MongoDB
- **Groq SDK** (or `axios`) – Interacting with Groq API
- **asyncHandler** – Clean error handling

---

## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/) running locally or MongoDB Atlas
- A valid **Groq API Key**

---
## 📦 Install Dependencies

```bash
# Install backend dependencies
npm install
# or
yarn

# Navigate to frontend folder
cd src/client # or your frontend directory
npm install
# or
yarn
```

---

## ⚙️ Configuration

Create a `.env` file in your **backend root** and add:

```env
# Groq API Key
AI_API_KEY=your_groq_api_key_here

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string_here
```

---

## 🏃‍♂️ Running the Project

### Start the Backend

```bash
npm run dev
# or
yarn dev
```

Runs on: `http://localhost:3000`

---

### Start the Frontend

```bash
cd src/client # or your frontend directory
npm run dev
# or
yarn dev
```

Runs on: `http://localhost:5173`

---

## 📄 API Endpoint

### `POST /api/v1/chat/message`

#### Request Body (JSON)

```json
{
  "threadId": "optional_existing_chat_id",
  "message": "Hello, what is your name?",
  "imageBase64": "optional_data_url_of_the_image"
}
```

- `threadId`: *(Optional)* If omitted, a new conversation thread is created.
- `message`: The text content of the user’s message.
- `imageBase64`: *(Optional)* Base64-encoded image string (e.g., `data:image/jpeg;base64,...`).

#### Response Body

```json
{
  "success": true,
  "data": {
    "threadId": "667e11680eddead95dbb9e1d",
    "userMessage": "Hello, what is your name?",
    "assistantMessage": "I am a large language model, trained by Google."
  },
  "message": "Message processed successfully."
}
```

---

## 🧱 Project Structure

```
frontend-ai-chat/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── utils/
│   ├── styles/
│   ├── models/           # Mongoose schemas (e.g., threads.ts)
│   ├── controllers/      # Express route handlers
│   ├── types/            # TypeScript type definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── vite.config.ts
├── package.json
└── tsconfig.json
```



