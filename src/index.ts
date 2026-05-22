export interface Env {}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return Response.json({
        ok: true,
        message: "Hello from Cloudflare Workers",
        method: request.method,
        path: url.pathname,
        time: new Date().toISOString(),
      });
    }

    if (url.pathname === "/health") {
      return new Response("ok", {
        headers: {
          "content-type": "text/plain; charset=UTF-8",
        },
      });
    }

    return new Response("Not Found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=UTF-8",
      },
    });
  },
};
