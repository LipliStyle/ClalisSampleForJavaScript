//=======================================================================
//  ClassName : Clalis HTML5+Javascriptサンプル
//  概要      : ClalisAPIサンプル
//
//  LiplisWeb
//  Copyright(c) 2013-2013 sachin. All Rights Reserved. 
//=======================================================================

///-----------------------------------------------------------------------
///
///                                初期化
///
///-----------------------------------------------------------------------

function init()
{
	document.getElementById("inputClalisMecab").value="今日はお天気がいいですね。お洗濯にはもってこいです！";
	document.getElementById("inputClalisMecabPlus").value="今日はお天気がいいですね。お洗濯にはもってこいです！";
	document.getElementById("inputClalisEmotional").value="今日はお天気がいいですね。お洗濯にはもってこいです！";
	document.getElementById("inputClalisTone").value="今日はお天気がいいですね。お洗濯にはもってこい！";
	document.getElementById("inputClalisToneUrl").value="http://liplis.mine.nu/xml/Tone/LiplisLili.xml";
	document.getElementById("inputClalisToneEmotional").value="今日はお天気がいいですね。お洗濯にはもってこい！";
	document.getElementById("inputClalisToneEmotionalUrl").value="http://liplis.mine.nu/xml/Tone/LiplisLili.xml";
	document.getElementById("inputClalisWebExtractJp").value="http://www.yahoo.co.jp/";
	document.getElementById("inputClalisWebExtractJpSentenceList").value="http://www.yahoo.co.jp/";
	document.getElementById("inputClalisWebExtractJpSentenceRelevanceList").value="http://www.yahoo.co.jp/";
}

///-----------------------------------------------------------------------
///
///                          イベントハンドラ
///
///-----------------------------------------------------------------------
function ClalisMecab() {
	clalisMecab(document.getElementById("inputClalisMecab").value);
}

function ClalisMecabPlus() {
	clalisMecabFull(document.getElementById("inputClalisMecabPlus").value);
}

function ClalisEmotional() {
	clalisEmotional(document.getElementById("inputClalisEmotional").value);
}

function ClalisTone() {
	clalisTone(document.getElementById("inputClalisTone").value,document.getElementById("inputClalisToneUrl").value);
}

function ClalisToneEmotionnal() {
	clalisToneEmotional(document.getElementById("inputClalisToneEmotional").value,document.getElementById("inputClalisToneEmotionalUrl").value);
}

function ClalisWebExtractJp() {
	clalisWebExtractJp(document.getElementById("inputClalisWebExtractJp").value);
}

function ClalisWebExtractJpSentenceList() {
	clalisWebExtractJpSentenceList(document.getElementById("inputClalisWebExtractJpSentenceList").value);
}

function ClalisWebExtractJpSentenceRelevanceList() {
	clalisWebExtractJpSentenceRelevanceList(document.getElementById("inputClalisWebExtractJpSentenceRelevanceList").value);
}

///-----------------------------------------------------------------------
///
///                              一般処理
///
///-----------------------------------------------------------------------

///----------------------------------------------
/// getUserAgent
/// ユーザーエージェントを取得する
/// 引数   : なし
/// 戻り値 : なし
///----------------------------------------------
function getUserAgent() {
    var userAgent = window.navigator.userAgent.toLowerCase();

    if (userAgent.indexOf('opera') != -1) {
        return 'opera';
    } else if (userAgent.indexOf('msie') != -1) {
        return 'ie'
    } else if (userAgent.indexOf('chrome') != -1) {
        return 'chrome'
    } else if (userAgent.indexOf('safari') != -1) {
        return 'safari'
    } else if (userAgent.indexOf('gecko') != -1) {
        return 'gecko'
    } else {
        return 'other'
    }
}

/// <summary>
/// タイムスタンプを取得する
/// </summary>
function getTimeText() {
	var date = new Date();
    
    return date.getFullYear() + (date.getMonth() + 1)+ date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
}


///-----------------------------------------------------------------------
///
///                        Clalis APIアクセス処理
///
///-----------------------------------------------------------------------

///----------------------------------------------
/// clalisMecab
/// 対象の日本語の文章を形態素解析して、単語に分解します
/// 引数   : 対象の日本語の文章
/// 戻り値 : なし
///----------------------------------------------
function clalisMecab(sentence) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisMecab.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisMecabIe(sentence);
	}
	else {
		clalisMecabFx(sentence);
	}
	
	///--------------------------
	/// clalisMecabFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabFx(sentence) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisMecabSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence);
	}
	
	///--------------------------
	/// clalisMecabIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabIe(pSentence) {
		var xdr = new XDomainRequest();
		xdr.onerror = function () {
			alert("error");
		}

		xdr.onload = function () {
			clalisMecabSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence));
	}
	
	///--------------------------
	/// clalisMecabSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabSetResult(jsonDoc)
	{
		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + "単語:" + jsonDoc.resWordList[i].name + " , 品詞:" + jsonDoc.resWordList[i].pos + " , 品詞細分類1:" + jsonDoc.resWordList[i].pos1 + "\n";
		}
		
		document.getElementById("resultClalisMecab").value = result;
	}
}



///----------------------------------------------
/// clalisMecabFull
/// 対象の日本語の文章を形態素解析して、単語に分解します。
/// このメソッドはMecabが返してくる全ての情報を取得します。
/// 引数   : 対象の日本語の文章
/// 戻り値 : なし
///----------------------------------------------
function clalisMecabFull(sentence) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisMecabFull.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisMecabFullIe(sentence);
	}
	else {
		clalisMecabFullFx(sentence);
	}
	
	///--------------------------
	/// clalisMecabFullFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabFullFx(sentence) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisMecabFullSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence);
	}
	
	///--------------------------
	/// clalisMecabFullIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabFullIe(sentence) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisMecabFullSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence));
	}
	
	///--------------------------
	/// clalisMecabFullSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisMecabFullSetResult(jsonDoc)
	{
		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + 			"単語:" +  jsonDoc.resWordList[i].name + " , 品詞:" +  jsonDoc.resWordList[i].pos
				+ " , 品詞細分類1:" +  jsonDoc.resWordList[i].pos1 + " , 品詞細分類2:" +  jsonDoc.resWordList[i].pos2
				+ " , 品詞細分類3:" +  jsonDoc.resWordList[i].pos3 + " , 活用形:" +  jsonDoc.resWordList[i].infetted1
				+ " , 活用形:" +  jsonDoc.resWordList[i].infetted2 + " , 原形:" +  jsonDoc.resWordList[i].prototype
				+ " , 読み:" +  jsonDoc.resWordList[i].read + " , 発音:" +  jsonDoc.resWordList[i].pronunciation + "\n";
		}
		
		document.getElementById("resultClalisMecabPlus").value = result;
	}
}


///----------------------------------------------
/// clalisEmotional
/// 対象の文章にメタ感情を付与して結果を返します。
/// 引数   : 対象の日本語の文章
/// 戻り値 : なし
///----------------------------------------------
function clalisEmotional(sentence) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisEmotional.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisEmotionalIe(sentence);
	}
	else {
		clalisEmotionalFx(sentence);
	}
	
	///--------------------------
	/// clalisEmotionalFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalFx(sentence) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisEmotionalSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence);
	}
	
	///--------------------------
	/// clalisEmotionalIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalIe(sentence) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisEmotionalSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence));
	}
	
	///--------------------------
	/// clalisEmotionalSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisEmotionalSetResult(jsonDoc)
	{

		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + "単語:" + jsonDoc.resWordList[i].name + " , 感情:" + jsonDoc.resWordList[i].emotion + " , 感情値:" + jsonDoc.resWordList[i].point + "\n";
		}
				
		document.getElementById("resultClalisEmotional").value = result;
	}
}


///----------------------------------------------
/// clalisTone
/// 対象の文章を口調変換ルールファイルに従って変換します。
/// 引数   : 対象の日本語の文章
///          口調変換ルールURL
/// 戻り値 : なし
///----------------------------------------------
function clalisTone(sentence, rureUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/ClalisTone.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisToneIe(sentence, rureUrl);
	}
	else {
		clalisToneFx(sentence, rureUrl);
	}
	
	///--------------------------
	/// clalisToneFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneFx(sentence, rureUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				
				var jsonDoc = eval( '(' + xmlhttp.responseText + ')' );
				document.getElementById("resultClalisTone").value = jsonDoc.result;
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneIe(sentence, rureUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			var jsonDoc = eval( '(' + xdr.responseText + ')' );
			document.getElementById("resultClalisTone").value = jsonDoc.result;
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence) + "&toneFileUrl=" + rureUrl);
	}
}


///----------------------------------------------
/// clalisToneEmotional
/// 対象の文章を口調変換ルールファイルに従って変換します。さらに、感情付与を行います。
/// 引数   : 対象の日本語の文章
///          口調変換ルールURL
/// 戻り値 : なし
///----------------------------------------------
function clalisToneEmotional(sentence, rureUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/ClalisToneEmotional.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisToneEmotionalIe(sentence, rureUrl);
	}
	else {
		clalisToneEmotionalFx(sentence, rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalFx(sentence, rureUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisToneEmotionalSetResult(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("sentence=" + sentence + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalIe(sentence, rureUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisToneEmotionalSetResult(eval( '(' + xdr.responseText + ')' ));
		}
		
		xdr.open('POST', url);
		xdr.send("sentence=" + encodeURI(sentence) + "&toneFileUrl=" + rureUrl);
	}
	
	///--------------------------
	/// clalisToneEmotionalSetResult
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisToneEmotionalSetResult(jsonDoc)
	{

		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + "単語:" + jsonDoc.resWordList[i].name + " , 感情:" + jsonDoc.resWordList[i].emotion + " , 感情値:" + jsonDoc.resWordList[i].point + "\n";
		}
				
		document.getElementById("resultClalisToneEmotional").value = result;
	}
}


///----------------------------------------------
/// clalisWebExtractJp
/// 対象のURLのサイトから日本語を抽出して返します。
/// 引数   : 対象のサイトURL
/// 戻り値 : なし
///----------------------------------------------
function clalisWebExtractJp(targetUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisWebExtractJp.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisWebExtractJpIe(targetUrl);
	}
	else {
		clalisWebExtractJpFx(targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpFx(targetUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var jsonDoc = eval( '(' + xmlhttp.responseText + ')' );
				document.getElementById("resultClalisWebExtractJp").value = jsonDoc.result;
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("url=" + targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpIe
	/// IE用メソッド
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpIe(targetUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			var jsonDoc = eval( '(' + xdr.responseText + ')' );
			document.getElementById("resultClalisWebExtractJp").value = jsonDoc.result;
		}
		xdr.open('POST', url);
		xdr.send("url=" + targetUrl);
	}
}


///----------------------------------------------
/// clalisWebExtractJpSentenceList
/// 対象のURLのサイトから日本語を文章ごとに抽出して返します。
/// 引数   : 対象のサイトURL
/// 戻り値 : なし
///----------------------------------------------
function clalisWebExtractJpSentenceList(targetUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisWebExtractJpSentenceList.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisWebExtractJpSentenceListIe(targetUrl);
	}
	else {
		clalisWebExtractJpSentenceListFx(targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceListFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象のURL
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceListFx(targetUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisWebExtractJpSentenceListSetResul(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("url=" + targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceListIe
	/// IE用メソッド
	/// 引数   : 対象のURL
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceListIe(targetUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisWebExtractJpSentenceListSetResul(eval( '(' + xdr.responseText + ')' ));
		}
		xdr.open('POST', url);
		xdr.send("url=" + targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceListSetResul
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceListSetResul(jsonDoc)
	{

		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + jsonDoc.resWordList[i] + "\n";
		}
				
		document.getElementById("resultClalisWebExtractJpSentenceList").value = result;
	}
}


///----------------------------------------------
/// clalisWebExtractJpSentenceRelevanceList
/// 対象のURLのサイトから日本語を文章ごとに抽出し、重要な文章の順番に並べて返します。
/// 引数   : 対象のサイトURL
/// 戻り値 : なし
///----------------------------------------------
function clalisWebExtractJpSentenceRelevanceList(targetUrl) {
	//ClalisApiUrl
	var url = 'http://liplis.mine.nu/Clalis/v30/Post/Json/clalisWebExtractJpSentenceRelevanceList.aspx';

	//ユーザーエージェントによって処理を切り替え
	if (getUserAgent() == 'ie') {
		clalisWebExtractJpSentenceRelevanceListIe(targetUrl);
	}
	else {
		clalisWebExtractJpSentenceRelevanceListFx(targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceRelevanceListFx
	/// Firefoxとその他ブラウザ用メソッド
	/// 引数   : 対象のURL
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceRelevanceListFx(targetUrl) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open('POST', url, true);
		
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				clalisWebExtractJpSentenceRelevanceListSetResul(eval( '(' + xmlhttp.responseText + ')' ));
			}
		}
		
		xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
		xmlhttp.send("url=" + targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceRelevanceListIe
	/// IE用メソッド
	/// 引数   : 対象のURL
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceRelevanceListIe(targetUrl) {
		var xdr = new XDomainRequest();
		
		xdr.onerror = function () {
			alert("error");
		}
		
		xdr.onload = function () {
			clalisWebExtractJpSentenceRelevanceListSetResul(eval( '(' + xdr.responseText + ')' ));
		}
		xdr.open('POST', url);
		xdr.send("url=" + targetUrl);
	}
	
	///--------------------------
	/// clalisWebExtractJpSentenceRelevanceListSetResul
	/// ClalisApiから取得した結果をテキストエリアに入れる。
	/// 引数   : 対象の日本語の文章
	/// 戻り値 : なし
	///---------------------------
	function clalisWebExtractJpSentenceRelevanceListSetResul(jsonDoc)
	{
		var i = 0;
		var result = "";
		
		for(i = 0; i < jsonDoc.resWordList.length; i++)
		{
			result = result + jsonDoc.resWordList[i] + "\n";
		}
				
		document.getElementById("resultClalisWebExtractJpSentenceRelevanceList").value = result;
	}
}