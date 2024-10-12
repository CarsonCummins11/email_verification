class OTPCache {
    constructor() {
        this.cache = null;
    }

    set(otp) {
        this.cache["otp"] = otp;
        this.cache["timestamp"] = Date.now();
    }

    get(sendResponse) {
        if (this.cache && this.cache["otp"] && this.cache["timestamp"] > Date.now() - 60000) {
            sendResponse(this.cache["otp"]);
        }else{
            this.cache = null;
            retrieve_otp_from_gmail_dom(sendResponse);
            return null;
        }
    }
}

otp_cache = new OTPCache();

function retrieve_otp_from_gmail_dom(fr_sendResponse){

    gmail_injectable_script = {
        js: ["scripts/gmail_injectable.js"],
        matches: ["*://mail.google.com/*"],
        persistAcrossSessions: false,
        id: "gmail_injectable"
    }
    const iframeHosts = [
        "https://mail.google.com/*"
      ];
    const RULE = {
        id: 1,
        priority: 1,
        condition: {
            //initiatorDomains: [chrome.runtime.id],
            //requestDomains: iframeHosts,
            resourceTypes: ['sub_frame'],
        },
        action: {
            type: 'modifyHeaders',
            responseHeaders: [
            {header: 'X-Frame-Options', operation: 'remove'},
            {header: 'Frame-Options', operation: 'remove'},
            // Uncomment the following line to suppress `frame-ancestors` error
            // {header: 'Content-Security-Policy', operation: 'remove'},
            ],
        },
    };
    console.log("frame options header stripping rule added");
    chrome.scripting.registerContentScripts([gmail_injectable_script], () => {
        console.log("Gmail injectable script registered");
            chrome.offscreen.createDocument({
                url: 'scripts/gmail_iframe.html',
                reasons: ['DOM_SCRAPING'],
                justification: 'Find OTP in Gmail DOM',
            });
            console.log("Offscreen document created");
        
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                if(request.otp_provide){
                    console.log("OTP received from gmail_injectable: ", message.otp);
        
                    chrome.scripting.unregisterContentScript(gmail_injectable_script);
                    chrome.webRequest.onHeadersReceived.removeListener(strip_frame_options);
                    chrome.offscreen.closeDocument();
                    fr_sendResponse(message.otp);
                }
            });
            console.log("Message listener added");
            });
}

//when we get an otp request from the content script, we check the gmail page for the otp
//and return it in a message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    console.log("OTP request received");
    if (request.otp_ask) {
        console.log("otp ask request")
        otp_cache.get(sendResponse);
    } 
});