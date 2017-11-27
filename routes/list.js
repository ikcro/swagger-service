const express = require('express');
const router = express.Router();
const pathUtils = require('../src/utils/PathUtils');
const fileUtils = require('../src/utils/FileUtils');
const config = require('../config/config').config;
const multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

/* GET list page. */
router.get('/:requestPath', function(req, res, next){
    try {

        let requestPath_ = req.params.requestPath;

        //还原请求路径
        let requestPathArr = requestPath_.split('_');
        let requestPath = '';
        for(let i=0;i<requestPathArr.length;i++){
            requestPath = requestPath + '/' + requestPathArr[i] ;
        }

        //需获取的文件路径
        let filePath = config.uploadFilePath + requestPath;
        let fileLists = fileUtils.getFileInfoList(filePath);


        //组装顶部目录文件路径和名称
        let pathDirObj = [];
        for(let i=0;i<requestPathArr.length;i++){
            let name = requestPathArr[i];
            let path = '';
            if(undefined === pathDirObj[i-1]){
                path = requestPathArr[i];
            }else{
                path = pathDirObj[i-1].path + '_' + requestPathArr[i];
            }
            let obj = {
                name:name,
                path:path
            }
            pathDirObj[i] = obj;
        }

        let render = {
            filePath:filePath,
            currentDir:filePath,
            fileLists:fileLists,
            requestP:requestPath_,
            requestRP:requestPath,
            pathDirObj:pathDirObj,
            config:config
        };

        console.info('render:'+JSON.stringify(render,null,2));
        res.render('list', render);
    }catch(e){
        res.render('error', {
            message:'访问出错！',
            error:{
                status:'',
                stack:'',
            }
        });
        console.error(JSON.stringify(e));
    }
});

/**
 * 文件上传
 */
router.post('/upload/', function(req, res, next){
    let params = req.query;
    // parse a file upload
    let form = new multiparty.Form();
    //设置编辑
    form.encoding = 'utf-8';
    //设置文件存储路径
    form.uploadDir = config.uploadFilePath + params.dir;
    //设置单文件大小限制
    form.maxFilesSize = 2 * 1024 * 1024;
    form.parse(req, function(err, fields, files) {
        //同步重命名文件名
        for(let i=0;i<files.file.length;i++){
            let file = files.file[i];
            console.log(file.path);
            fs.renameSync(file.path,form.uploadDir+'/'+file.originalFilename);
        }
        res.json({
            success:true
        });
        res.end(util.inspect({fields: fields, files: files}));
    });
    return;
});


/**
 * 删除文件
 */
router.get('/delFile/:filePath', function(req, res, next) {
    let filePath = req.params.filePath;
    //还原请求路径
    let requestPathArr = filePath.split('_');
    let requestPath = '';
    for(let i=0;i<requestPathArr.length;i++){
        requestPath = requestPath + '/' + requestPathArr[i] ;
    }
    let filePathDel = config.uploadFilePath + requestPath;
    console.info('删除文件：'+filePathDel);
    //读取文件/文件夹
    fs.stat(filePathDel, function (err, stats) {
        if(stats.isFile()){
            fs.unlink(filePathDel,(err)=>{
                if(err){
                    console.error(err)
                    res.json({
                        success:false
                    });
                    console.info('err');
                }else{
                    res.json({
                        success:true
                    });
                    console.info('success');
                }
                return ;
            });
        }else if(stats.isDirectory()){
            fs.rmdir(filePathDel,(err)=>{
                if(err){
                    console.error(err)
                    res.json({
                        success:false
                    });
                    console.info('err');
                }else{
                    res.json({
                        success:true
                    });
                    console.info('success');
                }
                return ;
            })
        }
    })


});

/**
 * 创建文件夹
 */
router.get('/mkdir/:dirPath', function(req, res, next) {
    let dirPath = req.params.dirPath
    //还原请求路径
    let requestPathArr = dirPath.split('_');
    let requestPath = '';
    for(let i=0;i<requestPathArr.length;i++){
        requestPath = requestPath + '/' + requestPathArr[i] ;
    }
    let realyDirPath = config.uploadFilePath+requestPath;
    console.info(realyDirPath);
    fs.mkdir(realyDirPath,(err)=>{
        if(err){
            console.error(err)
            res.json({
                success:false
            });
            console.info('err');
        }else{
            res.json({
                success:true
            });
            console.info('success');
        }
        return;
    });
});


module.exports = router;
