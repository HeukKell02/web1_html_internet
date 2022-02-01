const http = require('http');
const fs = require('fs');
const app = http.createServer((request,response)=>{
    var url = request.url;

    if(request.url === '/')
    {
        url = '/index.html';
    }
    if(request.url === '/favion.ico')
    {
        return response.writeHead(404);
    }
    response.writeHead(200);
    response.end(fs.readFileSync(__dirname+url));
});

app.listen(3000);