const templete={
    
    /**
     * 기초적인 HTML 골격에서 입력한 내용을 바탕으로 HTML을 반환합니다.
     * @param {String} title 웹사이트의 제목을 입력해줍니다.
     * @param {<li>} list 입력된 값으로 목차를 표현합니다. (ol,ul,li,a)로 조합된 값을 넣어주세요.
     * @param {<HTML>} body body 태그 안에 들어갈 내용
     * @param {<HTML>} control 파일을 생성("/create"),업데이트("/update"),제거("/delete") 하기위한 a 태그를 입력해줍니다. 
     * @returns {<HTML>} 입력된 값이 적용된 HTML 반환
     */
    templeteHTML:function(title,list,body,control){
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
        ${control}
        ${body}
        </body>
        </html>
        `
    },

    /**
     * 입력된 배열로 HTML <li> 태그를 만들어 반환합니다.
     * @param {Array} filelist 주제이름을 담고있는 string배열을 입력해줍니다.[string,string,string...]
     * @returns <ul><li>string</li><li>string</li>...</ul>
     */
     templeteList:function(filelist){
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

}

module.exports = templete;