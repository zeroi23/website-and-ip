var domainList = {};

chrome.runtime.onMessage.addListener(function(detail) {
//	console.debug(detail.url);
	if (detail.url != undefined) {
		var start = detail.url.indexOf("//");
		var end = detail.url.indexOf("/", start + 2);
		var url = detail.url.substring(start + 2, end);
		if (domainList[url] == undefined) {
			var domain = new Object();
			domain.url=url;
			domain.ip = detail.ip;
			domain.count = 1;
			domain.urls=[detail.url];
			domainList[url] = domain;
		} else {
			var domain=domainList[url];
			domain.urls.push(detail.url);
			++domain.count;
		}
		if ($("#chrome-IP").length == 1) {
			var display = "";
			for ( var o in domainList) {
				var domain = domainList[o];
				display += getDomainHtml(domain);
			}
			$("#chrome-IP .ipList").html(display);
		}
	}
});

function getDomainHtml(domain) {
	var title="";
	for(var i in domain.urls){
		title+=domain.urls[i]+"\n";
	}
	return '<tr><td class="ip" title=\''+title+'\'><a target="_blank" href="http://'
			+ domain.url
			+ '">'
			+ domain.url
			+ '</a></td><td><a target="_blank" href="http://wap.ip138.com/ip_search138.asp?ip='
			+ domain.ip + '">' + domain.ip + '</td><td>' + domain.count
			+ '</td></tr>';
}

$(function() {
	$("body")
			.append(
					'<div id="chrome-IP" class="chrome_right"><table class="ipList"></table><span class="close">关闭</span></div>');

	$(".close", "#chrome-IP").click(function() {
		$("#chrome-IP").hide();
	});
});
