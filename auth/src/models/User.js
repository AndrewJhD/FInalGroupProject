"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crypto_1 = require("crypto");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
userSchema.pre("save", function (next) {
    let user = this;
    if (!user.isModified("password") || !user.isNew)
        return next();
    try {
        (0, crypto_1.pbkdf2)(user.password, user.username, 310000, 32, "sha256", function (err, hashedPassword) {
            if (err) {
                return next(err);
            }
            user.password = hashedPassword.toString("base64");
            next();
        });
    }
    catch (e) {
        console.error(e);
    }
});
userSchema.methods.validatePassword = function (triedPassword, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        (0, crypto_1.pbkdf2)(triedPassword, user.username, 310000, 32, "sha256", function (err, hashedPassword) {
            if (err) {
                cb(false);
            }
            const buffer = Buffer.from(user.password, "base64");
            if (buffer.length != hashedPassword.length ||
                // !crypto.timingSafeEqual(buffer, hashedPassword)
                user.password !== hashedPassword.toString("base64")) {
                cb(false);
            }
            else {
                cb(true);
            }
        });
    });
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
