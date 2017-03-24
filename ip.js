var domainList = {};
var ipList = {};
var key = "show";
var isShow = true;
{
    chrome.storage.local.get(key, function (item) {
        isShow = item[key];
        // console.debug(isShow);
    });
}
chrome.runtime.onMessage.addListener(function (detail) {
        // console.debug(detail);
        if (detail.url != undefined) {
            var start = detail.url.indexOf("//");
            var end = detail.url.indexOf("/", start + 2);
            var url = detail.url.substring(start + 2, end);
            if(url=="ip.taobao.com"){
                return;
            }
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
        + '</a></td><td><a target="_blank" class="ip" href="http://wap.ip138.com/ip_search138.asp?ip='
        + domain.ip + '">' + domain.ip + '</td><td>' + domain.count
        + '</td></tr>';
}
$.ajaxSetup({
    async: false
});

var IpUtil =
{
    api: "http://ip.taobao.com/service/getIpInfo.php",
    getIpInfo: function (ip) {
        var info;
        $.getJSON(IpUtil.api,{ip: ip},
            function (data) {
                // console.debug(data);
                if(data.code==0) {
                    info = data.data.country;
                    info += " "+data.data.area;
                    info += " "+data.data.region;
                    info += " "+data.data.city;
                }
                // console.debug(info);
            }
        );
        return info;
    }
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

    $("#chrome-IP").delegate("a.ip", "mouseover", function (e) {
        // console.debug(e);
        var ip = e.currentTarget.text;
        var address = ipList[ip];
        if (address == null) {
            address = IpUtil.getIpInfo(ip);
            // console.debug(address);
            ipList[ip]=address;
        }
        e.currentTarget.title = address;
    })
});
