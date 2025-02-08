import dotenvSafe from "dotenv-safe";

dotenvSafe.config({
  path: `.env.${process.env.NODE_ENV || "development"}`, // Load the appropriate env file
});
