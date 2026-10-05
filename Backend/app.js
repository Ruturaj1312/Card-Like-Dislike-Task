import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
import userRoutes from "./routes/user.route.js";
import cardRoutes from "./routes/card.route.js";

const apiV1 = "/api/v1";

app.use(`${apiV1}/user`, userRoutes);
app.use(`${apiV1}/card`, cardRoutes);

export default app;
