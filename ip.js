var domainList = {};
var key = "show";
var isShow = true;
{
    chrome.storage.local.get(key, function (item) {
        isShow = item[key];
        console.debug(isShow);
    });
}
chrome.runtime.onMessage.addListener(function (detail) {
        // console.debug(detail);
        if (detail.url != undefined) {
            var start = detail.url.indexOf("//");
            var end = detail.url.indexOf("/", start + 2);
            var url = detail.url.substring(start + 2, end);
            if (domainList[url] == undefined) {
                var domain = {};
                domain.url = url;
                domain.ip = detail.ip;
                domain.count = 1;
                domain.urls = [detail.url];
                domainList[url] = domain;
            } else {
                var domain = domainList[url];
                domain.urls.push(detail.url);
                ++domain.count;
            }
            if (isShow && $("#chrome-IP").length == 1) {
                renderHtml();
            }
        }
    }
);

function renderHtml() {
    var display = "";
    for (var o in domainList) {
        var domain = domainList[o];
        display += getDomainHtml(domain);
    }
    $("#chrome-IP .ipList").html(display);
}

function getDomainHtml(domain) {
    var title = "";
    for (var i in domain.urls) {
        title += domain.urls[i] + "\n";
    }
    return '<tr><td class="ip" title=\'' + title + '\'><a target="_blank" href="http://'
        + domain.url
        + '">'
        + domain.url
        + '</a></td><td><a target="_blank" title="点击查询IP' + domain.ip + '" href="http://wap.ip138.com/ip_search138.asp?ip='
        + domain.ip + '">' + domain.ip + '</td><td>' + domain.count
        + '</td></tr>';
}

$(function () {
    $("body")
        .append(
            '<div id="chrome-IP" class="chrome_right">' +
            '<table class="ipList"></table>' +
            '<div class="float-right"><span id="show">显示</span><span' +
            ' id="hidden">隐藏</span><span' +
            ' class="close">关闭</span></div></div>');

    $(".close", "#chrome-IP").click(function () {
        $("#chrome-IP").hide()
    });
    $("#show", "#chrome-IP").click(function () {
        $("#chrome-IP .ipList").show();
        renderHtml();
        chrome.storage.local.set({"show": true});
    });
    $("#hidden", "#chrome-IP").click(function () {
        $("#chrome-IP .ipList").hide();
        chrome.storage.local.set({"show": false});
    });
});
