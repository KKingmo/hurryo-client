export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://hurryo-sever.herokuapp.com"
    : "http://localhost:5000";
