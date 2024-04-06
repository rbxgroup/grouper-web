import { pack_date_bigint, unpack_date_bigint } from "../../util/dateutil";
import {} from "@cloudflare/workers-types";
import { Hono } from "hono";

const app = new Hono();

app.delete("/destroy", function (ctx) {});

app.post("/create", function (ctx) {});

app.patch("/start", function (ctx) {});

app.patch("/edit", function (ctx) {
  return ctx.text("Hello World!");
});

export default app;