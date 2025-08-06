import { Router } from "express";

const chatRouter = Router();
import {
  newMessage,
  handleChatMessage,
} from "../controllers/chats.controllers";

chatRouter.route("/").get(newMessage);
chatRouter.route("/message").post(handleChatMessage);

export { chatRouter };
