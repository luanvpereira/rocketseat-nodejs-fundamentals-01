import { randomUUID } from "node:crypto";
import { Database } from "../database.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (_, res) => {
      const tasks = database.select("tasks");

      return res
        .setHeader("Content-type", "application/json")
        .end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        return res.writeHead(400).end(
          JSON.stringify({
            message: "Some fields are missing",
          })
        );
      }

      const now = new Date();

      const newTask = {
        id: randomUUID(),
        title,
        description,
        created_at: now,
        completed_at: null,
        updated_at: now,
      };

      database.insert("tasks", newTask);

      return res.writeHead(201).end();
    },
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;

      try {
        database.update("tasks", id, {
          title,
          description,
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
    method: "PATCH",
    path: "/tasks/:id/complete",
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.update("tasks", id, {
          completed_at: new Date(),
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
    path: "/tasks/:id",
    handler: (req, res) => {
      const { id } = req.params;

      try {
        database.delete("tasks", id);

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
