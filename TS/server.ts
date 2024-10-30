import * as http from "http";

interface Post {
  id: number;
  title: string;
  body: string;
}
let nextId = 4;

const posts: Post[] = [
  {
    id: 1,
    title:
      "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
  },
  {
    id: 2,
    title: "qui est esse",
    body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla",
  },
  {
    id: 3,
    title: "ea molestias quasi exercitationem repellat qui ipsa sit aut",
    body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut",
  },
];

const server = http.createServer(
  (request: http.IncomingMessage, response: http.ServerResponse) => {
    if (!request.url) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.write(JSON.stringify({ error: "Bad Request" }));
      response.end();
      return;
    }
    //console.log(request.url);

    const url = new URL(request.url, `http://${request.headers.host}`);
    //console.log(url);
    //console.log(request);

    if (url.pathname === "/posts") {
      //console.log("aqui");

      switch (request.method) {
        case "GET":
          response.writeHead(200, { "Content-Type": "application/json" });
          response.write(JSON.stringify(posts));
          response.end();
          break;

        case "POST":
          let body: string = "";

          request.on("data", (chunk) => {
            body += chunk.toString();
          });

          request.on("end", () => {
            if (!body) {
              response.writeHead(400, { "Content-Type": "plain/text" });
              response.write("Post data not provided");
              response.end();
            }
            const post: Post = { id: nextId++, ...JSON.parse(body) };
            posts.push(post);

            response.writeHead(200, { "Content-Type": "plain/text" });
            response.write(`Post id ${post.id} created`);
            response.end();
          });
          break;

        case "PUT":
          let putBody: string = "";
          request.on("data", (chunk) => {
            putBody += chunk.toString();
          });

          request.on("end", () => {
            const putData: Post = JSON.parse(putBody);
            const index = posts.findIndex((post) => post.id === putData.id);
            if (index !== -1) {
              posts[index] = putData;
              response.writeHead(200, { "Content-Type": "plain/text" });
              response.write("Post updated");
            } else {
              response.writeHead(404, { "Content-Type": "plain/text" });
              response.write("Post not found");
            }
            response.end();
          });
          break;

        case "PATCH":
          let patchBody: string = "";
          request.on("data", (chunk) => {
            patchBody += chunk.toString();
          });

          request.on("end", () => {
            const patchData: Partial<Post> = JSON.parse(patchBody);
            const index = posts.findIndex((post) => post.id === patchData.id);
            if (index !== -1) {
              posts[index] = { ...posts[index], ...patchData };
              response.writeHead(200, { "Content-Type": "plain/text" });
              response.write("Post partially updated");
            } else {
              response.writeHead(404, { "Content-Type": "plain/text" });
              response.write("Post not found");
            }
            response.end();
          });
          break;

        case "DELETE":
          let deleteId = url.searchParams.get("id");
          if (!deleteId) {
            response.writeHead(400, { "Content-Type": "application/json" });
            response.write(
              JSON.stringify({ error: "Post ID is required for deletion" })
            );
            response.end();
            return;
          }

          let index = posts.findIndex((post) => {
            return post.id === Number(deleteId);
          });
          //console.log(index)
          if (index !== -1) {
            posts.splice(index, 1);
            response.writeHead(200, { "Content-Type": "plain/text" });
            response.write("Post removed");
            response.end();
          } else {
            response.writeHead(404, { "Content-Type": "plain/text" });
            response.write("Post not found");
            response.end();
            return;
          }
          break;

        default:
          response.writeHead(405, { "Content-Type": "application/json" });
          response.write(JSON.stringify({ error: "Method Not Allowed" }));
          response.end();
      }

      return;
    }
    response.writeHead(404, { "Content-Type": "text/html" });
    response.write("<h2>404 - Page not Found</h2>");
    response.end();
  }
);

const PORT = 3000;
server.listen(PORT, () => {
  console.log("Server is running in PORT", PORT);
});
