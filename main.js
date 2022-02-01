const http = require('http');
const fs = require('fs');
const url = require('url');

const app = http.createServer((request,response)=>{
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname; // querySelector 를 제외한 경로
    //console.log(url.parse(_url,true)); // debugging

    if(pathname === '/'){

        if(queryData.id === undefined)
        {//querySelector 가 없을때

            fs.readdir('./data',(err,filelist)=>{
                console.log(filelist);
                var title = 'welcome';
                var description = 'Hello, Node.js';
                var list = '<ul>';
                var i = 0;
                while(i<filelist.length){
                    //file 개수 만큼 반복
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i+1;
                }

                list = list+'</ul>'; //내용물 추가하고 마지막에 닫는 태그 추가

                var templete=`
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${description}</p>
                    </body>
                    </html>
                    `;
                response.writeHead(200);
                response.end(templete);
            })

        }
        else
        {//querySelector 가 있을때
            
            fs.readdir('./data',(err,filelist)=>{

                var list = '<ul>';
                var i = 0;
                while(i<filelist.length)
                {
                    list = list+`<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i++;
                }
                list = list+'</ul>';
                

                fs.readFile(`data/${queryData.id}`,'utf8',(err,description)=>{
                    var title = queryData.id;
                    var templete=`
                        <!doctype html>
                        <html>
                        <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        <h2>${title}</h2>
                        <p>${description}</p>
                        </body>
                        </html>
        
                        `;
                
                    response.writeHead(200);
                    response.end(templete);
        
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