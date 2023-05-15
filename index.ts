import express, { Request, Response } from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import axios from "axios";
import cors from "cors";

const app = express();
const port = 3001;
const coinGeckoBaseUrl = "https://api.coingecko.com/api/v3/";

// Define routes

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.get("/prices", fetchPrices);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let val = 0;

io.on("connection", (socket: Socket) => {
  console.log("A user connected");
  // console.log(socket);
  // setInterval(function timeout() {
  //   val++;
  //   socket.emit("message", val);
  //   console.log(val, "VALUE");
  // }, 2000);
  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

async function fetchPrices(req: Request, res: Response) {
  try {
    console.log("inside fetchPrices");
    const totalCoins = await fetchCoinList();
    const response = await axios.get(
      `${coinGeckoBaseUrl}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&price_change_percentage=24h`
    );
    console.log(response.data, "REPSONE");
    res.send({ totalCoins: totalCoins.length, data: response.data });
  } catch (err) {
    res.send("ERROR");
  }
}

async function fetchCoinList() {
  try {
    const res = await axios.get(`${coinGeckoBaseUrl}coins/list`);
    return res.data;
  } catch (err) {
    throw new Error("ERROR");
  }
}
