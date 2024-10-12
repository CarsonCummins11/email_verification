function create_autofill_popup(input_to_populate, otp){

    if (document.getElementById("otp_popup_uuid_abc_256")){
        document.getElementById("otp_popup_uuid_abc_256").innerHTML = otp;
        return;
    }
    //create a popup to autofill the OTP
    var popup = document.createElement("button");
    popup.style.position = "fixed";
    popup.style.top = input_to_populate.getBoundingClientRect().bottom + "px";
    popup.style.left = input_to_populate.getBoundingClientRect().left + "px";
    popup.style.backgroundColor = "white";
    popup.style.border = "1px solid black";
    popup.style.padding = "10px";
    popup.style.zIndex = "1000";
    popup.style.display = "block";
    popup.style.cursor = "pointer";
    popup.id = "otp_popup_uuid_abc_256";

    popup.onclick = function(){
        input_to_populate.value = otp;
        popup.style.display = "none";
    }

    popup.innerHTML = otp;

    document.body.appendChild(popup);


}


function get_gmail_otp(input_to_populate){
    //call service worker to message us with the OTP
    response = chrome.runtime.sendMessage({otp: "otp"},(response) => {
        console.log("OTP received: ", response.otp);
        if (response.otp){
            create_autofill_popup(input_to_populate, response.otp);
        }
});
}

function register_get_otp_autofill_on_click(el){
    el.addEventListener("click", function(){
        if (el.value){
            return;
        }
        get_gmail_otp(el, 5);
    });
}

window.onload = function() {
    // if there's an input that should be populated with the OTP
    // we get the OTP from the gmail page and populate the input
    
    console.log("looking for autocompletable OTP fields");
    //get elements where autocomlete="one-time-code"
    var inputs = document.querySelectorAll('input[autocomplete="one-time-code"]');
    if (inputs.length > 0) {
        //get the first one
        input_to_populate = inputs[0];
        register_get_otp_autofill_on_click(input_to_populate);
        return;
    }

    //try text inputs with id containing "code"

    var inputs = document.querySelectorAll('input[id*="code"]');
    if (inputs.length > 0) {
        //get the first one
        input_to_populate = inputs[0];
        register_get_otp_autofill_on_click(input_to_populate);
        return;
    }


    //try text inputs with name containing "code"
    var inputs = document.querySelectorAll('input[name*="code"]');
    if (inputs.length > 0) {
        //get the first one
        input_to_populate = inputs[0];
        register_get_otp_autofill_on_click(input_to_populate);
        return;
    }
}