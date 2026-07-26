import express from "express";
const app = express();
import userRoutes from "./routes/auth.routes.js";

app.use(express.json({ limit: "16kb" }));

app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  res.status(500).send("Internal server error");
});

export default app;
