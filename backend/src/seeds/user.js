import mongoose from "mongoose";
import { config } from "dotenv";
import User from "../modules/userModel.js";

config(); // Load .env variables

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await User.deleteMany({});

    // Create users without friends first
    const createdUsers = await User.insertMany([
      {
        clerkId: "clerk_01",
        fullname: "Zarhan Khan",
        imageUrl: "/images/zarhan.jpg",
      },
      {
        clerkId: "clerk_02",
        fullname: "Ayesha Noor",
        imageUrl: "/images/ayesha.jpg",
      },
      {
        clerkId: "clerk_03",
        fullname: "Rayaan Ali",
        imageUrl: "/images/rayaan.jpg",
      },
      {
        clerkId: "clerk_04",
        fullname: "Fatima Siddiqui",
        imageUrl: "/images/fatima.jpg",
      },
      {
        clerkId: "clerk_05",
        fullname: "Hamza Sheikh",
        imageUrl: "/images/hamza.jpg",
      },
    ]);

    // Add friends manually using ObjectIds
    createdUsers[0].friends = [createdUsers[1]._id, createdUsers[2]._id]; // Zarhan -> Ayesha, Rayaan
    createdUsers[1].friends = [createdUsers[0]._id, createdUsers[3]._id]; // Ayesha -> Zarhan, Fatima
    createdUsers[2].friends = [createdUsers[0]._id];                      // Rayaan -> Zarhan
    createdUsers[3].friends = [createdUsers[1]._id];                      // Fatima -> Ayesha
    createdUsers[4].friends = [createdUsers[0]._id, createdUsers[2]._id]; // Hamza -> Zarhan, Rayaan

    // Save updated users
    await Promise.all(createdUsers.map(user => user.save()));

    console.log("✅ User database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding user data:", error);
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
