import prisma from "../prisma.js";
import jwt from "jsonwebtoken";

const createTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // For development with different ports, use sameSite: "lax" and secure: false
  // For production, use sameSite: "none" and secure: true
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
};

export const devSignup = async (req, res) => {
  try {
    console.log("Signup request received:", req.body);
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    let fullUser = await prisma.user.findUnique({ where: { email } });

    if (!fullUser) {
      fullUser = await prisma.user.create({
        data: { email, name: name || email.split("@")[0] },
      });
      console.log("New user created:", fullUser.id);
    } else {
      console.log("Existing user found:", fullUser.id);
    }

    // Create token using full user object
    createTokenAndSetCookie(res, fullUser);

    // Return selected user fields for consistency with /me endpoint
    const user = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      avatarUrl: fullUser.avatarUrl
    };

    console.log("Signup successful for user:", user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const devLogin = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const fullUser = await prisma.user.findUnique({ where: { email } });
    if (!fullUser) {
      console.log("Login failed: User not found for email:", email);
      return res.status(401).json({ error: "User not found" });
    }

    // Create token using full user object
    createTokenAndSetCookie(res, fullUser);

    // Return selected user fields for consistency with /me endpoint
    const user = {
      id: fullUser.id,
      name: fullUser.name,
      email: fullUser.email,
      avatarUrl: fullUser.avatarUrl
    };

    console.log("Login successful for user:", user.id);
    res.status(200).json({ user });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
};
