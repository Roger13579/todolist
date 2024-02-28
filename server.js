const http = require("http");
const {v4: uuidv4} = require("uuid");
const errorHandler = require("./errorHandler");
let todos = [];
const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    }
    let body = "";
    req.on('data', chunk => {
        body += chunk;
    });
    if (req.url === "/todos" && req.method === "GET"){
        res.writeHeader(200, headers);
        res.write(JSON.stringify({
            status: 200,
            data: todos
        }));
        res.end();
    }else if (req.url === "/todos" && req.method === "POST"){
        req.on('end', () =>{
            try {
                let title = JSON.parse(body).title;
                if (title !== undefined){
                    const todo = {
                        title: JSON.parse(body).title,
                        id: uuidv4()
                    }
                    todos.push(todo);
                    res.writeHeader(201, headers);
                    res.write(JSON.stringify({
                        status: "success",
                        data: todos
                    }));
                    res.end();
                }else {
                    errorHandler()
                }
            }catch (error){
                errorHandler(res,headers);
            }
        })
    }else if (req.url.startsWith("/todos") && req.method === "PATCH"){
        req.on('end', () =>{
            try {
                const title = JSON.parse(body).title;
                const id = req.url.split("/").pop();
                const index = todos.findIndex(element => element.id === id);
                if (!(index === -1 || title === undefined)){
                    todos[index] = {
                        title: title,
                        id: id
                    }
                    console.log(todos)
                    res.writeHeader(200, headers);
                    res.write(JSON.stringify({
                        status: "success",
                        data: todos
                    }));
                    res.end();
                }else {
                    errorHandler(res,headers);
                }
            }catch (error){
                errorHandler(res,headers);
            }
        })
    }else if (req.url === "/todos" && req.method === "DELETE"){
        todos.length = 0;
        res.writeHeader(200, headers);
        res.write(JSON.stringify({
            status: "success",
            data: todos
        }));
        res.end();
    }else if (req.url.startsWith("/todos") && req.method === "DELETE"){
        try {
            const id = req.url.split("/").pop();
            const index = todos.findIndex(element => element.id === id);
            if (index !== -1) {
                todos.splice(index, 1);
                res.writeHeader(200, headers);
                res.write(JSON.stringify({
                    status: "success",
                    data: todos
                }));
                res.end();
            } else {
                errorHandler(res, headers);
            }
        }catch (error) {
            errorHandler(res,headers);
        }
    }
}

const server = http.createServer(requestListener);
server.listen(8080);
