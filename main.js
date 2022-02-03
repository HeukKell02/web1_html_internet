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
                        `<a href="/create">create<a>
                         <a href="/update?id=${title}">update<a>
                         <form action="/delete_process" method="post">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                         </form>
                         `);                
             
                    response.writeHead(200);
                    response.end(template);
                    })
            });
        }
    }
    else if(pathname === '/create')
    {
        fs.readdir('./data',(err,_filelist)=>{
            var title = 'welcome - create';
            var description = 'Hello, Node.js';
            var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
            var template=templatelib.templeteHTML(title,list,
            `
                <form action="/create_process" method="post">
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
                    response.writeHead(302,{Location:`/?id=${title}`}); //redirection, 페이지 이동.
                    response.end();
                    console.log(`success file write "${title}"`);
                }
            });

        })
    }
    else if(pathname === '/update')
    {   // 업데이트 요청시
        fs.readdir('./data',(err,_filelist)=>{
            var list=templatelib.templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
            
            fs.readFile(`data/${queryData.id}`,'utf8',(err,description)=>{
                var title = queryData.id;
                var template = templatelib.templeteHTML(title,list,
                    `
                    <form action="/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" style="width:200px" placeholder="title" value="${title}"></p>
                    <p><textarea name="description" style="width:200px;height:300px" placeholder="description">${description}</textarea></p>
                    <input type="submit"></input>
                    </form>                    
                    `,
                    `<a href="/create">create<a> <a href="/update?id=${title}">update<a>`);                
         
                response.writeHead(200);
                response.end(template);
                })
        });
    }
    else if(pathname === '/update_process')
    {
        var body = '';

        request.on('data',(data)=>{
            // 조각난 데이터 받기
            body += data;
        })
        request.on('end',()=>{
            var updatedData = qs.parse(body); // body 를 분석한 데이터를 받아.
            // {id,title,description} 담겨있는데, id 에 해당하는 파일 삭제 하고, title 로 다시 만들고 안에는 description 넣고.
            var oldFileName = updatedData.id;
            var NewFileName = updatedData.title;
            var description = updatedData.description;

            fs.rename(`data/${oldFileName}`,`data/${NewFileName}`,(err)=>{
                if(err){ /*에러처리 해야함 */};

                fs.writeFile(`data/${NewFileName}`,description,`utf8`,(err)=>{
                    if(err){/*에러처리 해야함 */};

                    response.writeHead(302,{Location:`/?id=${NewFileName}`}); //redirection, 페이지 이동.
                    response.end();
                })
            })
        })
    }
    else if(pathname === '/delete_process')
    {   
        var body = '';

        request.on('data',(data)=>{
            // 조각난 데이터 받기
            body += data;
        })
        request.on('end',()=>{
            var updatedData = qs.parse(body); // body 를 분석한 데이터를 받아.
            // {id} 만 담겨있다.
            var deleteFileName = updatedData.id;
            
            fs.unlink(`data/${deleteFileName}`,(err)=>{
                if(err){/*에러 코드 작성*/}

                response.writeHead(302,{Location:`/`}); //redirection, 페이지 이동.
                response.end();
            })
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