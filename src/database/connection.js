import mongoose from "mongoose";
import { constants } from "../helpers/constants.js";

export default () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(constants.AUTHENTICATION.DATABASE_URL)
      .then(() => {
        resolve(true);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
