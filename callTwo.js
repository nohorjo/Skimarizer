function createText(sentenceEntropy,sliderAmount){

	var texts = '';
	
	for(var index in sentenceEntropy){

		var maxVal = sessionStorage.getItem('max');

		if ((sentenceEntropy[index]/maxVal) > (sliderAmount * 0.01))
		{
		  if (texts != '')
		  {
		    texts = texts + '<div>'  + '<p>' + index + '</p>' + '</div>'; 
		  }
		  else
		  {
		    texts = index;
		  }
		} 
	}

	var topWords = JSON.parse(sessionStorage.getItem('top20thWords'));
		

	return texts.replace(" ,",",")
}

function changeHandler(e) {

  var textArticle = document.getElementById('textTwo');
  var slider = document.getElementById('sliderTwo');
  
  textArticle.innerHTML = createText(JSON.parse(sessionStorage.getItem('sentEnt')),(100 - slider.value));
  
}

document.addEventListener('DOMContentLoaded', function () {
  
  document.getElementById('textTwo').innerHTML = createText(JSON.parse(sessionStorage.getItem('sentEnt')),50);
  document.getElementById('title').innerHTML = sessionStorage.getItem('title');
  document.getElementById('url').innerHTML = sessionStorage.getItem('url');
  document.getElementById('url').href = sessionStorage.getItem('url');
  document.getElementById('sliderTwo').addEventListener('change', changeHandler);
});


 