"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
let nextID = 4;
const posts = [
    {
        id: 1,
        title: "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
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
const server = http.createServer((request, response) => {
    if (!request.url) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.write(JSON.stringify({ error: "Bad Request" }));
        response.end();
        return;
    }
    //console.log(request.url);
    const url = new URL(request.url, `http://${request.headers.host}`);
    console.log(url);
    if (url.pathname === "/posts") {
        //console.log("aqui");
        switch (request.method) {
            case "GET":
                response.writeHead(200, { "Content-Type": "application/json" });
                response.write(JSON.stringify(posts));
                response.end();
                break;
            case "POST":
                let body = "";
                request.on("data", (chunk) => {
                    body = chunk.toString();
                });
                request.on("end", () => {
                    if (!body) {
                        response.writeHead(400, { "Content-Type": "plain/text" });
                        response.write("Post data not provided");
                        response.end();
                    }
                    const post = Object.assign({ id: nextID++ }, JSON.parse(body));
                    posts.push(post);
                    response.writeHead(200, { "Content-Type": "plain/text" });
                    response.write(`Post id ${post.id} created`);
                    response.end();
                });
                break;
            case "DELETE":
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
});
const PORT = 3000;
server.listen(PORT, () => {
    console.log("Server is running in PORT", PORT);
});
