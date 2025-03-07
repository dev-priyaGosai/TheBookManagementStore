import User from "../Models/users";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (user: any) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: "20m",
  });
};

const userResolvers = {
  Mutation: {
    register: async (_: any, { name, email, password }: any) => {
      try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          throw new Error("User already exists");
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        // Generate JWT token
        const token = generateToken(newUser);

        return { token, user: newUser };
      } catch (error :any) {
        throw new Error(error.message);
      }
    },

    login: async (_: any, { email, password }: any) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }

        const token = generateToken(user);

        return { token, user };
      } catch (error:any) {
        throw new Error(error.message);
      }
    },
  },

  Query: {
    me: async (_: any, __: any, { user }: any) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      return await User.findById(user.id);
    },
  },
};

export default userResolvers;
