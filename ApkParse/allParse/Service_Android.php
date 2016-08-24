<?php
namespace APP\Helper;
/**
 * please thanks
 * This wulihh write by 17:37 2016 08 23
 *
 * @version  mobile_2.0
 */
class Service_Android
{
	/**
	* 获取Apk包信息
	*
	* 需要/usr/bin/aapt
	*
	* @param $apkFile
	* @return array
	*/
public function getApkInfo($apkFile)
{
	try {
		exec('/usr/bin/aapt dump badging ' . $apkFile, $out, $return);
	$apkInfo = array();
	foreach ($out as $line) {
				$lineana = array();
	$a = explode(":", $line);
	$key = trim($a[0]);
	$value = trim($a[1]);
	preg_match_all('/((?P<key>\S+)=)?\'(?P<value>.*?)\'/', $value, $matches, PREG_SET_ORDER);
	foreach ($matches as $match) {
						if ($match['key']) {
							$lineana[$match['key']] = $match['value'];
	} else {
						$lineana[] = $match['value'];
	}
	}
	$apkInfo[$key][] = $lineana;
	}
	//checkRet会把上面读出来的配置整理一下
	$ret = $this->checkRet($apkInfo);
	} catch (\Exception $e) {
				echo $e->getMessage();
	$ret = array();
	}
	return $ret;
	}

	/**
		* 从Apk包中提取指定文件,并移到$toFile
		*
		* @param $apkFile apk文件
		* @param $sourceFile apk文件中相应文件路径
		* @param $toFile 输出文件
		* @return bool
		*/
	function getFileFromApk($apkFile, $sourceFile, $toFile)
	{
			exec('unzip ' . $apkFile . ' $sourceFile -d /tmp', $out, $return);
	if (rename("/tmp/" . $sourceFile, $toFile)) {
				return true;
	} else {
				return false;
	}
	}

	/**
		* 辅助函数,处理Apk信息数组
		*
		* @param $info
		* @return mixed
	 */
	function checkRet($info)
	{
			foreach ($info as $key => $lineana) {
				if (is_array($lineana)) {
					$info[$key] = $this->checkRet($lineana);
	if (count($info[$key]) == 1) {
						$info[$key] = current($info[$key]);
	}
	} else {
					}
	}
	return $info;
	}
}
