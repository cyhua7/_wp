const http = require("http");
const fs = require("fs");
const path = require("path");

const products = [
    {
        id: 1,
        name: "白色 T-shirt",
        price: 300,
        category: "上半身",
        img: "/T-shirt.jpg"
    },
    {
        id: 2,
        name: "潮流帽子",
        price: 500,
        category: "配飾",
        img: "/cap.jpg"
    },
    {
        id: 1,
        name: "黑色 T-shirt",
        price: 300,
        category: "上半身",
        img: "/T-shirt2.jpg"
    },
    {
        id: 2,
        name: "項鍊",
        price: 600,
        category: "配飾",
        img: "/necklace.jpg"
    },
    {
        id: 3,
        name: "運動鞋",
        price: 2000,
        category: "鞋子",
        img: "/shoe.jpg"
    }
];

// 注意：所有的 req 邏輯都必須在 createServer 的大括號內！
const server = http.createServer((req, res) => {

    console.log("收到請求:", req.url); // 這行可以幫你在終端機檢查誰在連線



    if (req.url === "/products") {

        res.writeHead(200, {

            "Content-Type": "application/json",

            "Access-Control-Allow-Origin": "*"

        });

        res.end(JSON.stringify(products));

    }

    // 處理首頁

    // 處理首頁
else if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
        if (err) {
            res.writeHead(500);
            return res.end("Error loading index.html");
        }
        // --- 修改這下面這一行 ---
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
    });
}

// server.js 裡面處理購物車請求的部分
else if (req.url === "/cart.html") {
    fs.readFile(path.join(__dirname, "cart.html"), (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end("Cart page not found");
        }
        // --- 修改這下面這一行 ---
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(data);
    });
}

    // 處理 CSS

    else if (req.url === "/style.css") {

        fs.readFile(path.join(__dirname, "style.css"), (err, data) => {

            res.writeHead(200, { "Content-Type": "text/css" });

            res.end(data);

        });

    }

    // 處理 JS

    else if (req.url === "/script.js") {

        fs.readFile(path.join(__dirname, "script.js"), (err, data) => {

            res.writeHead(200, { "Content-Type": "application/javascript" });

            res.end(data);

        });

    }

    else if (req.url.startsWith("/")) {

        const filePath = path.join(__dirname, req.url);



        const ext = path.extname(filePath).toLowerCase();



        fs.readFile(filePath, (err, data) => {

            if (err) {

                res.writeHead(404);

                return res.end("Image not found");

            }



            let type = "image/jpeg";

            if (ext === ".png") type = "image/png";

            if (ext === ".jpg" || ext === ".jpeg") type = "image/jpeg";



            res.writeHead(200, { "Content-Type": type });

            res.end(data);

        });

    }

    // server.js 裡面處理請求的部分


    else {

        res.writeHead(404);

        res.end("Not Found");

    }

});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});