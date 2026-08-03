import express from "express";
const app = express();
import cookieParser from "cookie-parser";

import userRoutes from "./routes/auth.routes.js";
import listngRoutes from "./routes/listing.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import globalErrorHandler from "./middlewares/global.error.handler.js";

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

app.use("/api/auth", userRoutes);
app.use("/api/property", listngRoutes);
app.use("/api/admin", adminRoutes);

app.use(globalErrorHandler);

export default app;
