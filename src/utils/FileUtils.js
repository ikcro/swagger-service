let fs = require('fs');


let isFile = (path) => {
    return exists(path) && fs.statSync(path).isFile();
};

let isDir = (path) => {
    return exists(path) && fs.statSync(path).isDirectory();
};

/**
 * 获取文件夹文件列表
 */
let getFileInfoList = (filePath)=>{
    let fileInfoList = [];
    let fileArr = fs.readdirSync(filePath);
    let fileCount = fileArr.length;
    console.info(fileArr);
    for (let i=0;i<fileCount;i++) {
        let eleInfo = fs.statSync(filePath +'/'+ fileArr[i]);
        fileInfoList[i] = {
            valueOf:eleInfo.ctime.valueOf(),
            name :fileArr[i],
            size:eleInfo.size,
            type:eleInfo.isDirectory() === true ? 'dir' : 'file',
            atime:eleInfo.atime.toLocaleString(),
            ctime:eleInfo.ctime.toLocaleString(),
            mtime:eleInfo.mtime.toLocaleString()
        }
    }

    //根据文件类型排序
    fileInfoList.sort((v1,v2)=>{
        if(v1.type === 'dir'){
            return -1;
        }else{
            return 1;
        }
    });

    return fileInfoList;
};

module.exports = {
    isFile,
    isDir,
    getFileInfoList
};