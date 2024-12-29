import { randomUUID } from "node:crypto";
import { Database } from "../database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/users",
    handler: (req, res) => {
      const { search } = req.query;

      const users = database.select(
        "users",
        search
          ? {
              name: search,
              email: search,
            }
          : null
      );

      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(users));
    },
  },
  {
    method: "POST",
    path: "/users",
    handler: (req, res) => {
      const { name, email } = req.body;

      if (!name || !email) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Some fields are missing",
          })
        );
      }

      const user = {
        id: randomUUID(),
        name,
        email,
      };

      database.insert("users", user);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: "/users/:id",
    handler: (req, res) => {
      const { id } = req.params;
      const { name, email } = req.body;

      try {
        database.update("users", id, {
          name,
          email,
        });

        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: error.message,
          })
        );
      }
    },
  },
  {
    method: "DELETE",
    path: "/users/:id",
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete("users", id);

        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: error.message,
          })
        );
      }
    },
  },
];
