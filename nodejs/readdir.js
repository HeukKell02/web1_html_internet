const readFolder = 'data/';
const fs = require('fs');

fs.readdir(readFolder,(err,fileList)=>{
    console.log(fileList);
})