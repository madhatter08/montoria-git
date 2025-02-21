import express from "express"
import cors from "cors"
import 'dotenv/config'
import cookieParser from "cookie-parser"
import connectdb from "./config/mongodb.js"
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import schoolRouter from "./routes/schoolRoutes.js";

const app = express()
const port = process.env.PORT || 4000
connectdb()

const allowedOrigins = ['http://localhost:5173']

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.get('/', (req, res) => res.send("api working")) //for testing purposes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/school", schoolRouter);

app.listen(port, () => console.log(`Server listening on PORT: ${port}`))
