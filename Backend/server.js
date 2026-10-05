import app from "./app.js";
import dotenv from "dotenv";
import databaseconection from "./config/conection.db.js";
dotenv.config();

const PORT = process.env.PORT || 8888;

databaseconection()
  .then(
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    }),
  )
  .catch((error) => {
    console.error("Database connection error:", error);
  });
