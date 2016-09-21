/*
 如果在html模版中修改了div的id，则需要修改这里所有使用原生js选择的选择器
 */
// 公共参数设置，主要对于上传限制设置
var iBytesUploaded = 0;
var iBytesTotal = 0;
var iPreviousBytesLoaded = 0;
var iMaxFilesize = 1048576; // 1MB
var oTimer = 0;
var sResultFileSize = '';

function secondsToTime(secs) { // 此方法用于基本的时间处理显示
    var hr = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600)) / 60);
    var sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if (hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    if (hr) {
        hr = "00";
    }
    return hr + ':' + min + ':' + sec;
};

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB'];
    if (bytes == 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

function fileSelected() {

    // 隐藏所有初始化警告信息
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    document.getElementById('upload_response').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('error2').style.display = 'none';
    document.getElementById('abort').style.display = 'none';
    document.getElementById('warnsize').style.display = 'none';

    // 获取文件选择的div
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    var oFile = document.getElementById('image_file').files[0];

    // 过滤基本格式
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    var rFilter = /^(image\/bmp|image\/gif|image\/jpeg|image\/png|image\/tiff)$/i;
    if (!rFilter.test(oFile.type)) {
        document.getElementById('error').style.display = 'block';
        return;
    }

    //过滤文件大小
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    if (oFile.size > iMaxFilesize) {
        document.getElementById('warnsize').style.display = 'block';
        return;
    }

    // 此处用于文件的基本展示
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    var oImage = document.getElementById('preview');

    //html5文件读取流
    var oReader = new FileReader();
    oReader.onload = function (e) {

        // 获取内存读取的图片
        oImage.src = e.target.result;

        oImage.onload = function () { // 回调事件

            // 展示图片所有信息
            // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
            sResultFileSize = bytesToSize(oFile.size);
            document.getElementById('fileinfo').style.display = 'block';
            document.getElementById('filename').innerHTML = 'Name: ' + oFile.name;
            document.getElementById('filesize').innerHTML = 'Size: ' + sResultFileSize;
            document.getElementById('filetype').innerHTML = 'Type: ' + oFile.type;
            document.getElementById('filedim').innerHTML = 'Dimension: ' + oImage.naturalWidth + ' x ' + oImage.naturalHeight;
        };
    };

    //读取选中的文件地址
    oReader.readAsDataURL(oFile);
}

function startUploading() {
    // 开始上传准备，需要清除所有上传警告信息
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    iPreviousBytesLoaded = 0;
    document.getElementById('upload_response').style.display = 'none';
    document.getElementById('error').style.display = 'none';
    document.getElementById('error2').style.display = 'none';
    document.getElementById('abort').style.display = 'none';
    document.getElementById('warnsize').style.display = 'none';
    document.getElementById('progress_percent').innerHTML = '';
    var oProgress = document.getElementById('progress');
    oProgress.style.display = 'block';
    oProgress.style.width = '0px';

    // 获取表单的POST提交数据，使用ajax的原生原理代码提交
    //var vFD = document.getElementById('upload_form').getFormData(); // for FF3
    var vFD = new FormData(document.getElementById('upload_form'));

    // 创建XML请求对象，提交数据
    var oXHR = new XMLHttpRequest();
    oXHR.upload.addEventListener('progress', uploadProgress, false);
    oXHR.addEventListener('load', uploadFinish, false);
    oXHR.addEventListener('error', uploadError, false);
    oXHR.addEventListener('abort', uploadAbort, false);
    //POST请求的数据位置
    // -----------------------------------------------此处必须修改---------------------------------------------
    oXHR.open('POST', 'upload.php');
    oXHR.send(vFD);

    // set inner timer
    oTimer = setInterval(doInnerUpdates, 300);
}

function doInnerUpdates() { // 此处用于速度的展示
    var iCB = iBytesUploaded;
    var iDiff = iCB - iPreviousBytesLoaded;

    // 如果不存在，退出
    if (iDiff == 0)
        return;

    iPreviousBytesLoaded = iCB;
    iDiff = iDiff * 2;
    var iBytesRem = iBytesTotal - iPreviousBytesLoaded;
    var secondsRemaining = iBytesRem / iDiff;

    // 速度格式转换
    var iSpeed = iDiff.toString() + 'B/s';
    if (iDiff > 1024 * 1024) {
        iSpeed = (Math.round(iDiff * 100 / (1024 * 1024)) / 100).toString() + 'MB/s';
    } else if (iDiff > 1024) {
        iSpeed = (Math.round(iDiff * 100 / 1024) / 100).toString() + 'KB/s';
    }

    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    document.getElementById('speed').innerHTML = iSpeed;
    document.getElementById('remaining').innerHTML = '| ' + secondsToTime(secondsRemaining);
}

function uploadProgress(e) { // 上传进度流展示
    if (e.lengthComputable) {
        iBytesUploaded = e.loaded;
        iBytesTotal = e.total;
        var iPercentComplete = Math.round(e.loaded * 100 / e.total);
        var iBytesTransfered = bytesToSize(iBytesUploaded);

        // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
        document.getElementById('progress_percent').innerHTML = iPercentComplete.toString() + '%';
        document.getElementById('progress').style.width = (iPercentComplete * 4).toString() + 'px';
        document.getElementById('b_transfered').innerHTML = iBytesTransfered;
        if (iPercentComplete == 100) {
            // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
            var oUploadResponse = document.getElementById('upload_response');
            oUploadResponse.innerHTML = '<h1>Please wait...processing</h1>';
            oUploadResponse.style.display = 'block';
        }
    } else {
        // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
        document.getElementById('progress').innerHTML = 'unable to compute';
    }
}

function uploadFinish(e) { //上传成功以后

    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    var oUploadResponse = document.getElementById('upload_response');
    oUploadResponse.innerHTML = e.target.responseText;
    oUploadResponse.style.display = 'block';

    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    document.getElementById('progress_percent').innerHTML = '100%';
    document.getElementById('progress').style.width = '400px';
    document.getElementById('filesize').innerHTML = sResultFileSize;
    document.getElementById('remaining').innerHTML = '| 00:00:00';

    clearInterval(oTimer);
}

function uploadError(e) { // 上传失败
    //情况极其少见
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    document.getElementById('error2').style.display = 'block';
    clearInterval(oTimer);
}

function uploadAbort(e) { //上传终止
    //情况极其少见
    // -----------------------------------------------此处如果修改id则需要修改---------------------------------------------
    document.getElementById('abort').style.display = 'block';
    clearInterval(oTimer);
}