chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message == "getSelection") {
        var selText = "";
        if (window.getSelection) { // all browsers, except IE before version 9
            if (document.activeElement &&
                (document.activeElement.tagName.toLowerCase() == "textarea" ||
                    document.activeElement.tagName.toLowerCase() == "input")) {
                var text = document.activeElement.value;
                selText = text.substring(document.activeElement.selectionStart,
                    document.activeElement.selectionEnd);
            } else {
                var selRange = window.getSelection();
                selText = selRange.toString();
            }
        } else {
            if (document.selection.createRange) { // Internet Explorer
                var range = document.selection.createRange();
                selText = range.text;
            }
        }
        if (selText !== "") {
            sessionStorage.setItem('webText', JSON.stringify(selText));
            sendResponse({
                data: selText
            });
        } else {
            const data = Array.from(document.querySelectorAll('p, font')).reduce((acc, p) => acc + p.innerText, '');;
            sessionStorage.setItem('webText', JSON.stringify(data));
            sendResponse({ data });
        }
    } else {
        sendResponse({}); // snub them.
    }
});
