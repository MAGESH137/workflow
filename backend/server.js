import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

import sampleRoute from "./routes/sampleRoute.js";
app.use("/api/sample", sampleRoute);

app.get("/", (req, res) => res.send("Backend running successfully 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
