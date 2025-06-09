import User from "../modules/userModel.js"; // Default import

export const authCallback = async (req, res, next) => {
  try {
    const { id, firstName, lastName, imageUrl, email } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Check if user already exists by Clerk ID
    const user = await User.findOne({ clerkId: id });

    if (!user) {
      // If your schema requires email and it's unique, make sure email is passed
      if (!email) {
        return res.status(400).json({ success: false, message: "Email is required for new users" });
      }

      await User.create({
        clerkId: id,
        fullname: `${firstName || ""} ${lastName || ""}`.trim(),
        imageUrl,
        email,
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in auth callback", error);
    next(error);
  }
};
