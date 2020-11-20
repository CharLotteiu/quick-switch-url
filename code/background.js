var zhPattern = /^(https:\/\/docs.pingcap.com\/)(zh\/)(.*)$/;
var enPattern = /^(https:\/\/docs.pingcap.com\/)(?!zh\/)(.*)$/;
var zhReplace = "$1$3";
var enReplace = "$1zh/$2";
var pairs = [[zhPattern.toString(), zhReplace],[enPattern.toString(), enReplace]]

chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
        Pairs: pairs
    })
});

chrome.commands.onCommand.addListener(function(command) {

    if (command === 'toggle-tags') {
        var currentURL = '';
        chrome.tabs.getSelected(null, function (tab) {
            currentURL = tab.url
            currentTab = tab.index
            var flag = 0
            chrome.storage.local.get(['Pairs'], function (res) {
                pairs = res.Pairs
                pairs.forEach(function (pair) {
                    regexPattern = /^\//
                    if(!regexPattern.test(pair[0])){ //如果不是正则表达式，直接匹配网址字符串
                        if(currentURL===pair[0]){
                            gotoURL = pair[1]
                            chrome.tabs.create({"url": gotoURL, "selected": true, "index": currentTab+1})
                            flag = 1
                        }
                        else if(currentURL===pair[1]){
                            gotoURL = pair[0]
                            chrome.tabs.create({"url": gotoURL, "selected": true, "index": currentTab+1})
                            flag = 1
                        }
                    }
                    else {//如果是正则表达式，先把字符串转为正则表达式，再进行匹配替换
                        var regex = eval(pair[0])
                        rule = pair[1]
                        if(regex.test(currentURL)){
                            gotoURL = currentURL.replace(regex, rule)
                            chrome.tabs.create({"url": gotoURL, "selected": true, "index": currentTab+1})
                            flag = 1
                        }
                    }
                })
                if(!flag){
                    alert('暂未配置该网站相关匹配信息')
                }
            })
        });
    }
})