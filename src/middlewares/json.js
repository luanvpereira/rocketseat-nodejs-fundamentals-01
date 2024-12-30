export async function json(req, res) {
  const contentType = req.headers["content-type"];

  if (!contentType || contentType.includes("application/json")) {
    const buffers = [];

    for await (const chunk of req) {
      buffers.push(chunk);
    }

    try {
      req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
      req.body = null;
    }

    return req;
  }

  return req;
}
