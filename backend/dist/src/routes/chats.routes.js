"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const chatRouter = (0, express_1.Router)();
exports.chatRouter = chatRouter;
const chats_controllers_1 = require("../controllers/chats.controllers");
chatRouter.route("/").get(chats_controllers_1.newMessage);
chatRouter.route("/message").post(chats_controllers_1.handleChatMessage);
//# sourceMappingURL=chats.routes.js.map