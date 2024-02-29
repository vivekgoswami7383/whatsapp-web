import dotenv from "dotenv";
dotenv.config();

export const constants = {
  AUTHENTICATION: {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
  },
};
