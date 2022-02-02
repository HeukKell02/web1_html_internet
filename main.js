const http = require('http');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const templatelib = require('./lib/templeteHTML.js');

const app = http.createServer((request,response)=>{
    var _url = request.url;
    var queryData = url.parse(_url,true).query;
    var pathname = url.parse(_url,true).pathname; // querySelector 를 제외한 경로

    if(pathname === '/'){

        if(queryData.id === undefined)
        {//querySelector 가 없을때
         //Home 일때.   

            fs.readdir('./data',(err,_filelist)=>{
                var title = 'welcome';
                var description = 'Hello, Node.js';
                var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
                var template=templatelib.templeteHTML(title,list,
                    `<h2>${title}</h2><p>${description}</p>`,
                    `<a href="/create">create<a>`);
                
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
                    var template = templatelib.templeteHTML(title,list,
                        `<h2>${title}</h2><p>${description}</p>`,
                        `<a href="/create">create<a> <a href="/update">update<a>`);                
             
                    response.writeHead(200);
                    response.end(template);
                    })
            });
        }
    }
    else if(pathname === '/create'){
        fs.readdir('./data',(err,_filelist)=>{
            var title = 'welcome - create';
            var description = 'Hello, Node.js';
            var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
            var template=templatelib.templeteHTML(title,list,
            `
                <form action="http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" style="width:200px" placeholder="title"></p>
                    <p><textarea name="description" style="width:200px;height:300px" placeholder="description"></textarea></p>
                    <input type="submit"></input>
                </form>
            `,'');
            
            response.writeHead(200);
            response.end(template);
        })
    }
    else if(pathname ==='/create_process')
    {
        var body = '';

        request.on('data',(data)=>{
            // 조각난 데이터가 올때마다 호출
            body += data ; // 데이터 모음
            
        })
        request.on('end',()=>{
            var postData = qs.parse(body); // data 분석
            //console.log(postData);
            var title = postData.title;
            var description = postData.description;
            
            // 파일 쓰기
            fs.writeFile(`data/${title}`,description,'utf8',(err)=>{
                if(err){
                    console.log(err); 
                    throw err;

                }
                else{
                    response.writeHead(302,{Location:`/?id=${title}`});
                    response.end();
                    console.log(`success file write "${title}"`);
                }
            });

        })
    }
    else{
        response.writeHead(404);
        response.end('Not found');
    }
});

app.listen(3000,()=>{
    console.log(`Webserver is running on port 3000`);
});