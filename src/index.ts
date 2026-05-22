export interface Env {}

function renderPage(): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Workers Demo</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Arial, Helvetica, sans-serif;
      }
      body {
        margin: 0;
        background: #f5f7fb;
        color: #1f2937;
      }
      .container {
        max-width: 880px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      h1 {
        margin-bottom: 8px;
      }
      p {
        color: #4b5563;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 16px;
        margin-top: 24px;
      }
      .card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
      }
      button {
        border: 0;
        border-radius: 10px;
        padding: 10px 14px;
        background: #2563eb;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
      }
      button:hover {
        background: #1d4ed8;
      }
      pre {
        margin-top: 14px;
        padding: 12px;
        min-height: 110px;
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        background: #0f172a;
        color: #e2e8f0;
        border-radius: 12px;
      }
      code {
        background: #e5e7eb;
        padding: 2px 6px;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Cloudflare Workers Demo</h1>
      <p>这个页面由 Worker 直接返回，并可调用 3 个接口查看响应结果。</p>
      <div class="grid">
        <section class="card">
          <h2>/api/hello</h2>
          <p>返回一段欢迎信息。</p>
          <button data-path="/api/hello">请求接口</button>
          <pre id="result-hello">等待请求...</pre>
        </section>
        <section class="card">
          <h2>/api/time</h2>
          <p>返回当前时间与请求方法。</p>
          <button data-path="/api/time">请求接口</button>
          <pre id="result-time">等待请求...</pre>
        </section>
        <section class="card">
          <h2>/health</h2>
          <p>返回纯文本健康检查结果。</p>
          <button data-path="/health">请求接口</button>
          <pre id="result-health">等待请求...</pre>
        </section>
      </div>
      <p>你也可以直接在浏览器访问这些接口：<code>/api/hello</code>、<code>/api/time</code>、<code>/health</code></p>
    </div>
    <script>
      const targets = {
        "/api/hello": document.getElementById("result-hello"),
        "/api/time": document.getElementById("result-time"),
        "/health": document.getElementById("result-health")
      };

      async function requestApi(path) {
        const target = targets[path];
        target.textContent = "请求中...";
        try {
          const response = await fetch(path);
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("application/json")) {
            const data = await response.json();
            target.textContent = JSON.stringify(data, null, 2);
            return;
          }
          const text = await response.text();
          target.textContent = text;
        } catch (error) {
          target.textContent = String(error);
        }
      }

      document.querySelectorAll("button[data-path]").forEach((button) => {
        button.addEventListener("click", () => requestApi(button.dataset.path));
      });
    </script>
  </body>
</html>`;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/") {
      return new Response(renderPage(), {
        headers: {
          "content-type": "text/html; charset=UTF-8",
        },
      });
    }

    if (url.pathname === "/api/hello") {
      return Response.json({
        ok: true,
        message: "Hello from Cloudflare Workers",
        method: request.method,
        path: url.pathname,
      });
    }

    if (url.pathname === "/api/time") {
      return Response.json({
        ok: true,
        message: "Current server time",
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
