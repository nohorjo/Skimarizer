chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

  if (request.message == "getSelection") {

            var selText = "";
            if (window.getSelection) {  // all browsers, except IE before version 9
                if (document.activeElement && 
                        (document.activeElement.tagName.toLowerCase () == "textarea" || 
                         document.activeElement.tagName.toLowerCase () == "input")) 
                {
                    var text = document.activeElement.value;
                    selText = text.substring (document.activeElement.selectionStart, 
                                              document.activeElement.selectionEnd);
                }
                else {
                    var selRange = window.getSelection ();
                    selText = selRange.toString ();
                }
            }
            else {
                if (document.selection.createRange) { // Internet Explorer
                    var range = document.selection.createRange ();
                    selText = range.text;
                }
            }
	
            if (selText !== "") {
				sessionStorage.setItem('webText',JSON.stringify(selText));
                sendResponse({data: selText});
            }
			else
			{
			

			var articleText = "";
			var article = "";
			var all = document.getElementsByTagName("*");

			for (var i=0, max=all.length; i < max; i++) {
					// Do something with the element here

				var tagName = document.getElementsByTagName("*").item(i).nodeName.toLowerCase(); 
				
				
				if ((tagName == 'p')||(tagName == 'font'))
				{
					
					var tagObj =  document.getElementsByTagName("*").item(i); 
					
					//console.log(tagObj);
						articleText = articleText + tagObj.innerHTML;
					
					
				} 
				
			}

		var array = articleText.split(/<|>/);

		for (var i = 0; i < array.length; i++) {
			if (i%2 == 0)
			{
    				article = article + array[i];
    			}
		}
		sessionStorage.setItem('webText',JSON.stringify(article));
		sendResponse({data:article});
	    }
        
  }
  else {
    sendResponse({}); // snub them.
  }
});

