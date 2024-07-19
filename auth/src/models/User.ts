import { Schema, model } from "mongoose";
import { pbkdf2, timingSafeEqual } from "crypto";
import crypto from "crypto";

interface IUser {
  username: string;
  password: string;
  validatePassword: (
    password: string,
    handler: (isValid: boolean) => void
  ) => void;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", function(next) {
  let user = this;
  if (!user.isModified("password") || !user.isNew) return next();
  try {
    pbkdf2(
      user.password,
      user.username,
      310000,
      32,
      "sha256",
      function(err, hashedPassword) {
        if (err) {
          return next(err);
        }
        user.password = hashedPassword.toString("base64");
        next();
      }
    );
  } catch (e) {
    console.error(e);
  }
});

userSchema.methods.validatePassword = async function(
  triedPassword: string,
  cb: (isValid: boolean) => void
) {
  let user = this;
  pbkdf2(
    triedPassword,
    user.username,
    310000,
    32,
    "sha256",
    function(err, hashedPassword) {
      if (err) {
        cb(false);
      }
      const buffer = Buffer.from(user.password, "base64");
      if (
        buffer.length != hashedPassword.length ||
        // !crypto.timingSafeEqual(buffer, hashedPassword)
        user.password !== hashedPassword.toString("base64")
      ) {
        cb(false);
      } else {
        cb(true);
      }
    }
  );
};

const User = model("User", userSchema);
export default User;