import express from "express";
import router from "./routes";
import { collectMetricsMiddleware } from "./metrics";

const app = express();
app.use(express.json());
app.use(collectMetricsMiddleware)
app.use("/api", router);

export default app;