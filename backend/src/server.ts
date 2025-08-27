import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
import cors from "cors";
import turnipRoutes from "./routes/turnipRoutes";

const app: Application = express();

const allowedOrigins = process.env.NODE_ENV === "test" 
  ? "*" 
  : ["http://localhost:5173", "https://turnip-trader.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/api", turnipRoutes);

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

if (require.main === module || process.env.PLAYWRIGHT) {
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}

export default app;
