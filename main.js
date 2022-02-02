const http = require('http');
const fs = require('fs');
const url = require('url');
const templatelib = require('./lib/templeteHTML.js');

const app = http.createServer((request,response)=>{
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname; // querySelector 를 제외한 경로
    //console.log(url.parse(_url,true)); // debugging

    if(pathname === '/'){

        if(queryData.id === undefined)
        {//querySelector 가 없을때

            fs.readdir('./data',(err,_filelist)=>{
                var title = 'welcome';
                var description = 'Hello, Node.js';
                var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
                var template=templatelib.templeteHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                
                response.writeHead(200);
                response.end(template);
            })

        }
        else
        {//querySelector 가 있을때
            
            fs.readdir('./data',(err,_filelist)=>{
                var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
                
                fs.readFile(`data/${queryData.id}`,'utf8',(err,description)=>{
                    var title = queryData.id;
                    var template = templatelib.templeteHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);                
             
                    response.writeHead(200);
                    response.end(template);
                    })
            });
        }
    }
    else{
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000,()=>{
    console.log(`Webserver is running on port 3000`);
});