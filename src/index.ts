import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import speakerRoutes from "./routes/speakerRoutes.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use("/events", eventRoutes);
app.use("/categories", categoryRoutes);
app.use("/speakers", speakerRoutes);

app.get("/", (req, res) => {
res.send("API INVOFEST");
});

app.listen(port, () => {
console.log(`Server lagi jalan di http://localhost:${port}`);
});