function retrieve_otp_from_gmail_dom(){
    const xpathResult = document.evaluate("/html/body/div[6]/div[3]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[8]/div/div[1]/div[2]/div/table/tbody/tr[1]/td[5]/div[1]/div/span", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null); 
    console.log(xpathResult);
    possible_otp = xpathResult.iterateNext().innerHTML;

    if (possible_otp) {
        console.log(possible_otp);
        otp = possible_otp.match(/[a-z0-9]*\d[a-z0-9]*/);
        console.log(otp);
        return otp;
    }
    return "";
}

function new_gmail_otp_check(sendResponse){
    chrome.tabs.create({url: "https://mail.google.com/mail/u/0/#inbox", active: false}, function(tab){
        chrome.scripting
        .executeScript({
          target : {tabId : tab.id, allFrames : true},
          func : retrieve_otp_from_gmail_dom,
        })
        .then(injectionResults => {
            let res = "";
            for (const {frameId, result} of injectionResults) {
                console.log(`Frame ${frameId} result:`, result[0]);
                res = result[0];
                break;
            }
            chrome.tabs.remove(tab.id);
            sendResponse({otp: res});
        });
    });

}

//when we get an otp request from the content script, we check the gmail page for the otp
//and return it in a message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if (request.otp == "otp"){
        console.log("OTP request received");
        otp = new_gmail_otp_check(sendResponse);
    }
    return true;
});