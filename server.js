import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import logger from "morgan";
import { auth } from "./app/routers";

//run db connect
import "./app/core/connect";

const app = express();
app.use(express.json);
app.use(express.urlencoded({ extended: false }));
app.use(cors);
app.use(cookieParser);
app.use(logger("dev"));

app.use("/auth", auth);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server is running on port ${port}!`));
