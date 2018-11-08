// JavaScript source code

function displayNotificationDiv() {
    $("#NotificationContainer").css("visibility", "visible");
}

function hideNotificationDiv() {
    $("#NotificationContainer").css("visibility", "hidden");
}



function displayMenuProfilDiv() {
    $("#imgArrowBannerDiv").animate({ transform: "rotate(90deg)" }, 200, function () {
        $("#MenuProfil").css("visibility", "visible");
    });
    
}

function hideMenuProfilDiv() {
    $("#MenuProfil").css("visibility", "hidden");
    $("#imgArrowBannerDiv").animate({ "transform": "rotate(0deg)" }, 200, function () {
     
    });
    
}



$(document).mouseup(function (e) {

    if (!$("#NotificationContainer").is(e.target) && $("#NotificationContainer").has(e.target).length === 0) {
        hideNotificationDiv();
    }

    /*if (!$("#MenuProfil").is(e.target) && $("#MenuProfil").has(e.target).length === 0) {
        hideNotificationDiv();
    }*/
});
