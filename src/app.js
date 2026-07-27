import express from "express";
const app = express();
import userRoutes from "./routes/auth.routes.js";
import globalErrorHandler from "./middlewares/global.error.handler.js";
app.use(express.json({ limit: "16kb" }));
app.use("/api/user", userRoutes);
app.use(globalErrorHandler);
export default app;
