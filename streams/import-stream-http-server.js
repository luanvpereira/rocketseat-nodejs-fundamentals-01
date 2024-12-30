import http from "node:http";

import { parse } from "csv-parse";

const server = http.createServer(async (req, res) => {
  const contentType = req.headers["content-type"];

  if (req.method === "PUT" && contentType === "multipart/form-data") {
    const parser = req.pipe(parse());
    const registers = [];

    let index = 0;

    for await (const record of parser) {
      if (index > 0) {
        const [title, description] = record;

        registers.push(
          fetch("http://localhost:3333/tasks", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              description,
            }),
          })
        );
      }

      index++;
    }

    Promise.allSettled(registers).then((results) => {
      results.forEach((result, index) => {
        console.log(`${index + 1} status: ${result.status}`);
      });
    });

    return res.writeHead(200).end();
  }

  return res.writeHead(400).end(
    JSON.stringify({
      message: "It's not impossible import the file",
    })
  );
});

server.listen(3334);
