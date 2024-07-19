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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_jwt_1 = require("express-jwt");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 6001;
const JWT_SECRET = "Luciferthereaper25";
const MONGO = "";
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }), express_1.default.json());
app.get("/", (req, res) => {
    res.send("Testing 1 2 3");
});
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield new User_1.default({ username, password });
        const after = yield user.save();
        res.json({ userCreated: after.username });
    }
    catch (e) {
        res.sendStatus(500);
    }
}));
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username });
    if (!user)
        return res.sendStatus(404);
    const handler = (isValidPassword) => {
        if (isValidPassword) {
            res.json({
                jwt: jsonwebtoken_1.default.sign({ user: user.username }, JWT_SECRET, {
                    expiresIn: "6h",
                }),
            });
        }
        else {
            res.sendStatus(401);
        }
    };
    user.validatePassword(password, handler);
}));
app.get("/verify", (0, express_jwt_1.expressjwt)({ secret: JWT_SECRET, algorithms: ["HS256"] }), (req, res) => {
    var _a, _b;
    console.log(req.auth);
    // if (req.auth?.user) res.sendStatus(200);
    if ((_a = req.auth) === null || _a === void 0 ? void 0 : _a.user)
        res.json({ username: (_b = req.auth) === null || _b === void 0 ? void 0 : _b.user, isValid: true });
    else
        res.sendStatus(500);
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(`${MONGO}`); //add database info here
        app.listen(PORT, () => {
            console.log(`Auth server is running on http://localhost:${PORT}`);
        });
    });
}
main();
