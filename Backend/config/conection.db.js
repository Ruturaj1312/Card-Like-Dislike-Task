import mongoose from "mongoose";

async function databaseconection() {
  try {
    const conectioninstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`,
    );
    console.log("MongoDB connected : ", conectioninstance.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

export default databaseconection;
