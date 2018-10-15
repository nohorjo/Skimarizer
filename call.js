function changeHandler(e) {
    var text = document.getElementById('text');
    var slider = document.getElementById('slider');
    text.innerHTML = createText(JSON.parse(sessionStorage.getItem('sentEnt')), (100 - slider.value));
}
function clickHandlerButton(e) {
    if (document.getElementById('spinner').style.display == 'none') {
        myWindow = window.open('window.html', '', 'width=500,height=500');
    }
}
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('newbutton').addEventListener('click', clickHandlerButton);
    document.getElementById('slider').addEventListener('change', changeHandler);
});
function replacing(word) {
    var newWord = word.replace('¬', '');
    newWord = newWord.replace(' ', '');
    if (newWord == "length") {
        newWord = "Length";
    }
    return newWord
}
function makeDictionary(text) {
    var tuple = new Object();
    var n = text.replace(/\&nbsp;/g, "");
    paran = n.replace(/\!/g, "!¬");
    question = paran.replace(/\?/g, "?¬");
    punc = question.replace(/\./g, ".¬");
    var myDict = new Array();
    var myDictWithoutThree = new Array();
    var pureEntropy = new Array();
    var splitText = punc.split(/(?=[\s¬,;:"])+/);
    var countForWordLength = 0;
    //creating dictionary of words in text and their equivalent count
    splitText.forEach(function(item) {
        var newWord = replacing(item);
        if (myDict.hasOwnProperty(newWord)) {
            myDict[newWord] = myDict[newWord] + 1;
        } else {
            myDict[newWord] = 1;
        }
    });
    tuple.wordCount = splitText.length;
    tuple.dictionaryWord = myDict;
    tuple.pureEntropy = pureEntropy;
    return tuple
}
function makeEntropy(tuple) {
    i = 0;
    for (var word in tuple.dictionaryWord) {
        var probabilityWord = tuple.dictionaryWord[word] / tuple.wordCount;
        var entropy = -(probabilityWord * (Math.log(probabilityWord) / (Math.log(2))));
        //if (word.length > 4)
        if (word.length > 1) {
            tuple.dictionaryWord[word] = entropy;
            //creating an entropy array to sort
            tuple.pureEntropy[i] = entropy;
            i = i + 1;
        }
    }
}
function wordByword(aSentence, tuple) {
    var tupleSentence = new Object();
    tupleSentence.entropy = 0;
    tupleSentence.sentence = '';
    //var tempCheckDic = new Object();
    var s = aSentence.replace(/\&nbsp;/g, "");
    (s.split(/(?=[\s,;:"])+/)).forEach(function(word) {
        var newWord = replacing(word);
        //if (tempCheckDic.hasOwnProperty(word) === false)
        //{
        if (newWord != '') {
            //tempCheckDic[newWord] = tuple.dictionaryWord[newWord];
            if (!isNaN(tuple.dictionaryWord[newWord])) {
                tupleSentence.entropy = tupleSentence.entropy + tuple.dictionaryWord[newWord];
            }
        }
        //}
        var top20 = JSON.parse(sessionStorage.getItem('top20Words'));
        if (top20.hasOwnProperty(newWord)) {
            tupleSentence.sentence = tupleSentence.sentence + ' ' + newWord.bold();
        } else {
            tupleSentence.sentence = tupleSentence.sentence + ' ' + newWord;
        }
    });
    //for (var key in tempCheckDic) {
    //delete tempCheckDic[key];
    //}
    return tupleSentence
}
function sentenceEntropy(tuple, text) {
    paran = text.replace(/\!/g, "!¬");
    question = paran.replace(/\?/g, "?¬");
    punc = question.replace(/\./g, ".¬");
    var sentenceArray = punc.split("¬");
    var sentenceEntropyDic = new Object();
    var sentencesSelection = (sentenceArray.length) / 7;
    var sec1 = sentencesSelection;
    var sec2 = 2 * sentencesSelection;
    var sec3 = 3 * sentencesSelection;
    var sec4 = 4 * sentencesSelection;
    var sec5 = 5 * sentencesSelection;
    var sec6 = 6 * sentencesSelection;
    var len = 0;
    sentenceArray.forEach(function(sentence) {
        if (sentence != '') {
            var sentEntropy = wordByword(sentence, tuple);
            if (len < sec1) {
                sentenceEntropyDic[sentEntropy.sentence] = 1.6 * sentEntropy.entropy;
            } else if (len < sec2) {
                sentenceEntropyDic[sentEntropy.sentence] = 1.4 * sentEntropy.entropy;
            } else if (len < sec3) {
                sentenceEntropyDic[sentEntropy.sentence] = 1.2 * sentEntropy.entropy;
            } else if (len < sec4) {
                sentenceEntropyDic[sentEntropy.sentence] = sentEntropy.entropy;
            } else if (len < sec5) {
                sentenceEntropyDic[sentEntropy.sentence] = 1.2 * sentEntropy.entropy;
            } else if (len < sec6) {
                sentenceEntropyDic[sentEntropy.sentence] = 1.4 * sentEntropy.entropy;
            } else {
                sentenceEntropyDic[sentEntropy.sentence] = 1.6 * sentEntropy.entropy;
            }
        }
        len = len + 1;
    });
    return sentenceEntropyDic
}
function findMax(sEntropy) {
    var maxArray = new Array();
    i = 0;
    for (var index in sEntropy) {
        maxArray[i] = sEntropy[index];
        i = i + 1;
    }
    var sortedArray = maxArray.sort(function(a, b) {
        return b - a
    });
    return sortedArray[0]
}
function createText(sentenceEntropy, sliderAmount) {
    var text = '';
    for (var index in sentenceEntropy) {
        var maxVal = 0;
        maxVal = sessionStorage.getItem('max');
        if ((sentenceEntropy[index] / maxVal) > (sliderAmount * 0.01)) {
            if (text != '') {
                text = text + '<div>' + '<p>' + index + '</p>' + '</div>';
            } else {
                text = index;
            }
        }
    }
    var topWords = JSON.parse(sessionStorage.getItem('top20thWords'));
    return text.replace(" ,", ",")
}
function getTop20Entropy(tuple) {
    tuple.pureEntropy.sort(function(a, b) {
        return b - a
    });
    return topIMPwords(tuple, tuple.pureEntropy[0]);
}
function topIMPwords(tuple, topentropy) {
    var wordsCUTleft = new Object();
    var words = new Object();
    var wordArray = new Array();
    console.log("tope: " + topentropy);
    articleLength = tuple.pureEntropy.length;
    for (var word in tuple.dictionaryWord) {
        if ((tuple.dictionaryWord[word] / topentropy) <= ((45.15 / (Math.log(articleLength) - 4) + (74.5 / articleLength + 12.46)) / 100)) {
            var newValue = (Math.min((Math.round(Math.log(7.))), (Math.log(word.length))) * 0.75) + (0.25 * Math.log(tuple.dictionaryWord[word]));
            if (newValue < 0) {
                newValue = 0;
            }
            wordsCUTleft[word] = newValue;
            //change entropy value to new improved value for not capped words
            tuple.dictionaryWord[word] = newValue;
        } else {
            //set value of word to zero
            tuple.dictionaryWord[word] = 0;
        }
    }
    j = 0;
    for (var index in wordsCUTleft) {
        wordArray[j] = wordsCUTleft[index];
        j = j + 1;
    }
    var sortedWordArray = wordArray.sort(function(a, b) {
        return b - a
    });
    console.log(sortedWordArray[20]);
    i = 0;
    for (var leftcutWord in wordsCUTleft) {
        if ((wordsCUTleft[leftcutWord] >= sortedWordArray[20]) && (i <= 20)) {
            words[leftcutWord] = i;
            //console.log(leftcutWord + " " + tuple.dictionaryWordWithoutThree[leftcutWord]);
            i = i + 1;
        }
    }
    for (var key in words) {
        console.log('topentropywords: ' + key);
    }
    return words
}
function top20thWordEntropy(tuple, entropyComparison) {
    var words = new Object();
    //console.log("entropyComparison " + entropyComparison);
    i = 0;
    for (var word in tuple.dictionaryWord) {
        //console.log(word + " " + tuple.dictionaryWordWithoutThree[word]);
        if (tuple.dictionaryWord[word] >= entropyComparison) {
            words[word] = i;
            i = i + 1;
        }
    }
    for (var key in words) {
        //console.log('top20words: ' + key);
    }
    return words
}
function pdfToText(data) {
    var div = document.getElementById('viewer');
    // render the first pages
    var pdf = new PDFJS.PDFDoc(data);
    var total = pdf.numPages;
    for (i = 1; i <= total; i++) {
        var page = pdf.getPage(i);
        var canvas = document.createElement('canvas');
        canvas.id = 'page' + i;
        canvas.style.display = 'none';
        canvas.mozOpaque = true;
        div.appendChild(canvas);
        canvas.width = page.width;
        canvas.height = page.height;
        var context = canvas.getContext('2d');
        context.save();
        context.fillStyle = 'rgb(255, 255, 255)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.restore();
        var textLayer = document.createElement('div');
        textLayer.className = 'textLayer';
        textLayer.style.display = 'none';
        document.body.appendChild(textLayer);
        page.startRendering(context, startRendering(total), textLayer);
    }
    setTimeout(function() {
        getTextOffDiv()
    }, 10000);
}
function isPDF(tabLink) {
    if ((tabLink.indexOf(".pdf")) == -1) {
        return false
    } else {
        return true
    }
}
function modifyURLforDocs(theUrl) {
    if ((theUrl.indexOf("docs.google.com")) == -1) {
        return theUrl
    } else {
        var urlStart = theUrl.indexOf("url=") + 4;
        console.log(theUrl.slice(urlStart));
        return theUrl.slice(urlStart)
    }
}
function httpGet(theUrl) {
    var xhr = new XMLHttpRequest;
    xhr.open('GET', modifyURLforDocs(theUrl), true);
    xhr.responseType = "arraybuffer";
    xhr.onload = function(event) {
        pdfToText(xhr.response);
    };
    xhr.send();
}
function checkFurtherDiv(divs) {
    if (divs.childNode == null) {
        return false
    } else {
        return true
    }
}
var articleT = "";
function getTextOffDiv() {
    var nodes = document.querySelectorAll("div");
    for (var j = 0; j < nodes.length; j++) {
        if (checkFurtherDiv(nodes[j]) == false) {
            articleT = articleT + (nodes[j].textContent + "\n");
        } else {
            for (var k = 0; k < nodes.childNodes.length; k++) {
                if (checkFurtherDiv(nodes.childNodes[k]) == false) {
                    articleT = articleT + (nodes[j].childNodes[k].textContent + "\n");
                } else {
                    for (var l = 0; l < nodes.childNodes[k].childNodes.length; l++) {
                        articleT = articleT + (nodes[j].childNodes[k].childNodes[l].textContent + "\n");
                    }
                }
            }
        }
    }
    createPDFText(articleT);
}
function createPDFText(textPDF) {
    console.log(textPDF);
    document.getElementById('wait').innerHTML = "";
    document.getElementById('spinner').style.display = 'none';
    var tupleVal = new Object();
    tupleVal = makeDictionary(textPDF);
    makeEntropy(tupleVal);
    sessionStorage.setItem('top20Words', JSON.stringify(getTop20Entropy(tupleVal)));
    var dic = sentenceEntropy(tupleVal, (textPDF));
    sessionStorage.setItem('sentEnt', JSON.stringify(dic));
    sessionStorage.setItem('max', findMax(sentenceEntropy(tupleVal, (textPDF))));
    var text = document.getElementById('text');
    var summarizedText = createText(JSON.parse(sessionStorage.getItem('sentEnt')), 50);
    text.innerHTML = summarizedText;
}
chrome.tabs.query({
    currentWindow: true,
    active: true
}, (function(tab) {
    chrome.tabs.sendMessage(tab[0].id, {
        message: "getSelection"
    }, function(response) {
        sessionStorage.clear(); //everything gone!
        var tablink = tab[0].url;
        sessionStorage.setItem('url', tablink);
        if (isPDF(tablink) == false && response) {
            var tupleVal = new Object();
            tupleVal = makeDictionary(response.data);
            makeEntropy(tupleVal);
            sessionStorage.setItem('top20Words', JSON.stringify(getTop20Entropy(tupleVal)));
            var dic = sentenceEntropy(tupleVal, (response.data));
            sessionStorage.setItem('sentEnt', JSON.stringify(dic));
            sessionStorage.setItem('max', findMax(sentenceEntropy(tupleVal, (response.data))));
            var text = document.getElementById('text');
            var summarizedText = createText(JSON.parse(sessionStorage.getItem('sentEnt')), 50);
            document.getElementById('wait').innerHTML = "";
            document.getElementById('spinner').style.display = 'none';
            text.innerHTML = summarizedText;
            var pageTitle = tab[0].title.bold();
            sessionStorage.setItem('title', pageTitle);
            document.getElementById('title').innerHTML = pageTitle;
        } else {
            httpGet(tablink);
        }
    });
}));
