import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
); // Enable CORS for all origins

app.use(express.json()); // Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded()); // Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.static("public")); // Serve static files from the "public" directory
app.use(cookieParser()); // Parse cookies

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

//Job Routes
import jobRouter from "./routes/job.routes.js";
app.use("/api/v1/jobs", jobRouter);

export default app;
