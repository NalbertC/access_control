import "dotenv/config";

export const authConfig = {
  secret: String(process.env.APP_SECRET),
  expiresIn: "7d",
};
