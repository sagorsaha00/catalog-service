import config from "config";
import mongoose from "mongoose";

export const initDb = async () => {
  try {
    const dbUrl: string = config.get("database.url");
    console.log("Database URL:", dbUrl);

    await mongoose.connect(dbUrl);

    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
