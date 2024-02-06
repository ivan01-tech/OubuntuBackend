import { CorsOptions } from "cors";
import { allowedOrigns } from "./allowedOrigin.js";

export const corsOptions: CorsOptions = {
  origin: function (origin, cb) {
    const ori = origin || "";
    if (allowedOrigns.includes(ori) || !origin) {
      cb(null, true);
    } else {
      cb(new Error("Not Allowed By CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};
