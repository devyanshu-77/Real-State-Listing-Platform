import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const PORT = process.env.PORT;

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });
}

startServer();
