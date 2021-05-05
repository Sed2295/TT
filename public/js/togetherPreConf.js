var TogetherJSConfig_dontShowClicks = true;
var TogetherJSConfig_suppressJoinConfirmation = true;
var TogetherJSConfig_findRoom = getDocumentID();
var TogetherJSConfig_autoStart = true;
var TogetherJSConfig_ignoreForms = true;
var TogetherJSConfig_ignoreMessages = ["form-focus", "cursor-update", "keydown", "scroll-update"];

//Global variables for Together

var docID;

TogetherJSConfig_getUserName = function () {

};

function getDocumentID(){
    $.ajax({
        url: '/document/getSessionDocumentID',
        type: 'POST',
        success: function (response) {
           docID = response.id;
           sessionStorage.getItem('togetherjs-session.status')
            let sesAtr = JSON.parse(sessionStorage.getItem('togetherjs-session.status'));
            sesAtr.shareId = response.id;
            sessionStorage.setItem('togetherjs-session.status', JSON.stringify(sesAtr));
        }
    })
}