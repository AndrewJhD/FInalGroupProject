import mongoose from "mongoose";
import express, { Application, Request, Response } from "express";
import User from "./models/User";
import jwt from "jsonwebtoken";
import { expressjwt, Request as JWTRequest } from "express-jwt";
import cors from "cors";
const app: Application = express();
const PORT: number = 6001;
const JWT_SECRET = "Luciferthereaper25";

const MONGO = "";

app.use(cors());
app.use(express.urlencoded({ extended: true }), express.json());

app.get("/", (req, res) => {
    res.send("Testing 1 2 3");
});

app.post("/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await new User({ username, password });
      const after = await user.save();
      res.json({ userCreated: after.username });
    } catch (e) {
      res.sendStatus(500);
    }
  });
  
  app.post("/login", async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.sendStatus(404);
    const handler = (isValidPassword: boolean) => {
      if (isValidPassword) {
        res.json({
          jwt: jwt.sign({ user: user!.username }, JWT_SECRET, {
            expiresIn: "6h",
          }),
        });
      } else {
        res.sendStatus(401);
      }
    };
    user!.validatePassword(password, handler);
  });
  
  app.get(
    "/verify",
    expressjwt({ secret: JWT_SECRET, algorithms: ["HS256"] }),
    (req: JWTRequest, res) => {
      console.log(req.auth);
      // if (req.auth?.user) res.sendStatus(200);
      if (req.auth?.user) res.json({ username: req.auth?.user, isValid: true });
      else res.sendStatus(500);
    }
  );

async function main() {
    await mongoose.connect(`${MONGO}`);  //add database info here
    app.listen(PORT, () => {
      console.log(`Auth server is running on http://localhost:${PORT}`);
    });
  }
main();