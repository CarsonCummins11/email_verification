const xpathResult = document.evaluate("/html/body/div[6]/div[3]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[8]/div/div[1]/div[2]/div/table/tbody/tr[1]/td[5]/div[1]/div/span", document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null); 
console.log(xpathResult);
possible_otp = xpathResult.iterateNext().innerHTML;

if (possible_otp) {
    console.log(possible_otp);
    otp = possible_otp.match(/[a-z0-9]*\d[a-z0-9]*/);
    otp = otp[0];
    console.log(otp);
    alert("otp found!!")
    return otp;
}