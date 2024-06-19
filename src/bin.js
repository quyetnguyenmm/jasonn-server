#!/usr/bin/env node

import { faker } from "@faker-js/faker";
import fs from "fs";
import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import queryString from "query-string";
import yup from "yup";

const DB_PATH = process.argv.find((arg) => arg.includes(".json"));
const flag = process.argv.findIndex((arg) => arg.includes("--port"));
const PORT = flag !== -1 ? process.argv[flag + 1] : 8080;
const PRIVATE_KEY = "j2434229-a489-sa78-ocaf-nbf2a2589bc7";
const SECONDS_PER_DAY = 60 * 60 * 24;

const server = jsonServer.create();
const router = jsonServer.router(`${DB_PATH}`);
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use(jsonServer.bodyParser);

function protectedRoute(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "You have to log in first" });
    }

    const accessToken = authHeader.split(" ")[1];
    jwt.verify(accessToken, PRIVATE_KEY);
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Access token is not valid or expired." });
  }
}

server.post("/api/login", async (req, res) => {
  const loginSchema = yup.object().shape({
    username: yup
      .string()
      .required()
      .min(6, "Username should have at least 6 characters"),

    password: yup
      .string()
      .required()
      .min(8, "Password should have at least 8 characters"),
  });

  try {
    await loginSchema.validate(req.body);
  } catch (error) {
    return res
      .status(400)
      .jsonp({ error: error.errors?.[0] || "Invalid username or password" });
  }

  const { username, password } = req.body;
  const token = jwt.sign({ sub: username }, PRIVATE_KEY, {
    expiresIn: SECONDS_PER_DAY,
  });
  const expiredAt = new Date(Date.now() + SECONDS_PER_DAY * 1000).getTime();

  return res.status(200).jsonp({ accessToken: token, expiredAt });
});

server.get("/api/profile", protectedRoute, (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(" ")[1];
    const payload = jwt.decode(accessToken);
    return res.status(200).json({
      username: payload.sub,
      city: faker.location.city(),
      email: faker.internet.email({
        firstName: payload.sub,
        provider: "gmail.com",
      }),
    });
  } catch (error) {
    console.log("failed to parse token", error);
    return res.status(400).json({ message: "Failed to parse token." });
  }
});

server.get("/db", (req, res) => {
  const data = JSON.parse(fs.readFileSync(`${DB_PATH}`, "utf8"));
  return res.json(data);
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
    req.body.updatedAt = Date.now();
  } else if (req.method === "PATCH") {
    req.body.updatedAt = Date.now();
  }

  next();
});

router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCount = headers["x-total-count"];
  const queryParams = queryString.parse(req._parsedUrl.query);

  if (req.method === "GET" && totalCount) {
    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalCount),
      },
    };

    return res.jsonp(result);
  }

  res.jsonp(res.locals.data);
};

server.use("/api", router);

server.listen(PORT, () => {
  console.log(`🚀  Server ready at: ${PORT}`);
});
