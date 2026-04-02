"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const app = (0, express_1.default)();
const port = process.env.port || 5000;
app.use((0, cors_1.default)({ origin: "*", credentials: true }));
app.use(express_1.default.json({ limit: "10mb" }));
const chats_routes_1 = require("./routes/chats.routes");
// import { asyncHandler } from "./utils/asyncHandler";
const threads_routes_1 = require("./routes/threads.routes");
app.use("/api/v1/chat", chats_routes_1.chatRouter);
app.use("/api/v1/threads", threads_routes_1.threadRouter);
app.use((err, req, res, next) => {
    console.log("Error Caught by middleware", err);
});
app.listen(port, () => {
    console.log(`Server listening at ${port}`);
    connectDB();
});
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || "");
        console.log("connected to data base ");
    }
    catch (error) {
        console.log("failed to conned to database", error);
    }
};
//# sourceMappingURL=server.js.map