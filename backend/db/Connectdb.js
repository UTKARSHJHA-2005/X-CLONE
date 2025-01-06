import mongoose from "mongoose";

// MongoDB connection string
const uri = "mongodb+srv://jhautkarsh2005:sZiCwT1iWdxre9H6@cluster0.kzili.mongodb.net/twitter-db?retryWrites=true&w=majority";

// Mongoose connection options
const clientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export const connectdb = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("Connected to MongoDB successfully!");
    const isAlive = await mongoose.connection.db.admin().command({ ping: 1 });
    if (isAlive.ok) {
      console.log("Pinged the database: Connection is active.");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
