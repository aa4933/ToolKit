<?php

function bytesToSize1024($bytes, $precision = 2) {
    $unit = array('B','KB','MB');
    return @round($bytes / pow(1024, ($i = floor(log($bytes, 1024)))), $precision).' '.$unit[$i];
}

$sFileName = $_FILES['image_file']['name'];
$sFileType = $_FILES['image_file']['type'];
$sFileSize = bytesToSize1024($_FILES['image_file']['size'], 1);

echo <<<EOF
<p>Your file: {$sFileName} has been successfully received.</p>
<p>Type: {$sFileType}</p>
<p>Size: {$sFileSize}</p>
EOF;

if(!empty($_FILES["image_file"]))  {
    //$uploaddir = $_SERVER['DOCUMENT_ROOT']."/uploads/";
    $uploaddir="/home/wuhang/tmp/image/8450/";
    $uploaddir.="test.jpg";
    if(move_uploaded_file($_FILES["image_file"]["tmp_name"], $uploaddir)) {
        echo "上传成功!";
    }else{
        print_r($_FILES);
    }
}