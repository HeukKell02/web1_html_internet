const http = require('http');
const fs = require('fs');
const url = require('url');

/**
 * 기초적인 HTML 골격에서 입력한 내용을 바탕으로 HTML을 반환합니다.
 * @param {String} title 웹사이트 제목
 * @param {<li>} list 주제 리스트
 * @param {<HTML>} body 내용으로 들어갈 내용
 * @returns {<HTML>} 입력된 값이 적용된 HTML 반환
 */
function templeteHTML(title,list,body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
    </body>
    </html>
    `
}

/**
 * 입력된 배열로 HTML <li> 태그를 만들어 반환합니다.
 * @param {Array} filelist 주제이름을 담고있는 string배열을 입력해줍니다.[string,string,string...]
 * @returns <ul><li>string</li><li>string</li>...</ul>
 */
function templeteList(filelist){
    var list = '<ul>';
    var i = 0;

    while(i<filelist.length){
        //file 개수 만큼 반복
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i+1;
    }
    list = list+'</ul>'; //내용물 추가하고 마지막에 닫는 태그 추가

    return list;
}

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
                var list=templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
                var templete=templeteHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);
                
                response.writeHead(200);
                response.end(templete);
            })

        }
        else
        {//querySelector 가 있을때
            
            fs.readdir('./data',(err,_filelist)=>{
                var list=templeteList(_filelist); // 파일명으로 주제를 담은 배열을 만들어 <li> 태그화
                
                fs.readFile(`data/${queryData.id}`,'utf8',(err,description)=>{
                    var title = queryData.id;
                    var templete = templeteHTML(title,list,`<h2>${title}</h2><p>${description}</p>`);                
             
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