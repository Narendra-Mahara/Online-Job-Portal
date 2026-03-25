import "dotenv/config";
import app from "./app.js";
import connectDB from "./db/index.js";

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
