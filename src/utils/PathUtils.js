

/**
 * 地址转换
 */
let pathSp = (allPath)=>{
    return allPath.split('_');
};

let getCurrentDir = ( pathArr )=>{
    let currentDir = 'E:/WorkSpace/WebStorm/swagger-service/public/upload/pro1/';
    for(let i=0;i<pathArr.length;i++){
        currentDir = currentDir + '/' +pathArr[i]
    }
    return currentDir;
};





module.exports = {
    pathSp,
    getCurrentDir
}