import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import turnipRoutes from "./routes/turnipRoutes";

const app: Application = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use("/api", turnipRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

export default app;
