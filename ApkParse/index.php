<?php
include_once 'allParse/Service_Android.php';
include_once 'easyParse/ApkParser.php';

//简单解析APK
$appObj = new ApkParser();
$targetFile = $uploaddir;//apk所在的路径地址
$appObj->open($targetFile);
//$res['appName']=$appObj->getAppName();     // 应用名称
//$res['package']=$appObj->getPackage();    // 应用包名
//$res['versionName']=$appObj->getVersionName();  // 版本名称
//$res['VersionCode']=$appObj->getVersionCode();  // 版本代码


//完全解析APK
$apk = $uploaddir;
$iconFile = '/home/wuhang/tmp/a.png';
/** @var Service_Android $android */
$android = new Service_Android();
$res = $android->getApkInfo($apk);
$packageName = $res['package']['name'];
$appName = $res['application-label'];
$android->getFileFromApk($apk, $res['application']['icon'], $iconFile);


print_r($res);