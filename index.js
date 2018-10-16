module.exports = function(text, length = 50) {
    const tupleVal = makeDictionary(text);
    makeEntropy(tupleVal);
    const top20 = getTop20Entropy(tupleVal);
    const dic = sentenceEntropy(tupleVal, text);
    
    return createText(dic, 100 - length);

    function replacing(word) {
        let newWord = word.replace(/[¬ ]/g, '');
        if (newWord == "length") {
            newWord = "Length";
        }
        return newWord;
    }

    function makeDictionary(text) {
        const myDict =  [];
        const splitText = text.replace(/\&nbsp;/g, "").replace(/\!/g, "!¬").replace(/\?/g, "?¬").replace(/\./g, ".¬").split(/(?=[\s¬,;:"])+/);
        //creating dictionary of words in text and their equivalent count
        splitText.forEach(function(item) {
            const newWord = replacing(item);
            myDict[newWord] = myDict[newWord] + 1 || 1;
        });
        return {
            wordCount: splitText.length,
            dictionaryWord: myDict,
            pureEntropy: []
        };
    }

    function makeEntropy(tuple) {
        let i = 0;
        Object.entries(tuple.dictionaryWord).forEach(([word, count]) => {
            const probabilityWord = count / tuple.wordCount;
            const entropy = -(probabilityWord * (Math.log(probabilityWord) / (Math.log(2))));
            if (word.length > 1) {
                tuple.dictionaryWord[word] = entropy;
                //creating an entropy array to sort
                tuple.pureEntropy[i] = entropy;
                i = i + 1;
            }
        });
    }

    function wordByword(aSentence, tuple) {
        const tupleSentence = {
            entropy: 0,
            sentence: '',
        };
        aSentence.replace(/\&nbsp;/g, "").split(/(?=[\s,;:"])+/).forEach(function(word) {
            const newWord = replacing(word);
            if (newWord && !isNaN(tuple.dictionaryWord[newWord])) {
                tupleSentence.entropy += tuple.dictionaryWord[newWord];
            }
            tupleSentence.sentence += ' ' + (top20.hasOwnProperty(newWord)? newWord.bold() : newWord);
        });
        return tupleSentence;
    }

    function sentenceEntropy(tuple, text) {
        const sentenceArray = text.replace(/\!/g, "!¬").replace(/\?/g, "?¬").replace(/\./g, ".¬").split("¬");
        const sentenceEntropyDic = {};
        const sentencesSelection = (sentenceArray.length) / 7;
        const sec1 = sentencesSelection;
        const sec2 = 2 * sentencesSelection;
        const sec3 = 3 * sentencesSelection;
        const sec4 = 4 * sentencesSelection;
        const sec5 = 5 * sentencesSelection;
        const sec6 = 6 * sentencesSelection;
        sentenceArray.forEach(function(_sentence, len) {
            if (_sentence) {
                const { sentence, entropy } = wordByword(_sentence, tuple);
                let multiplyer;
                if (len < sec1) {
                    multiplyer = 1.6;
                } else if (len < sec2) {
                    multiplyer = 1.4;
                } else if (len < sec3) {
                    multiplyer = 1.2;
                } else if (len < sec4) {
                    multiplyer = 1;
                } else if (len < sec5) {
                    multiplyer = 1.2;
                } else if (len < sec6) {
                    multiplyer = 1.4;
                } else {
                    multiplyer = 1.6;
                }
                sentenceEntropyDic[sentence] = multiplyer * entropy;
            }
        });
        return sentenceEntropyDic;
    }

    function createText(sentenceEntropy, length) {
        let text = '';
        for (var index in sentenceEntropy) {
            if ((sentenceEntropy[index] / Math.max(...Object.values(dic))) > (length * 0.01)) {
                if (text) {
                    text += '<div>' + '<p>' + index + '</p>' + '</div>';
                } else {
                    text = index;
                }
            }
        }
        return text.replace(" ,", ",");
    }

    function getTop20Entropy(tuple) {
        tuple.pureEntropy.sort((a, b) => b - a);
        const topentropy = tuple.pureEntropy[0];
        const wordsCUTleft = {};
        const words = {};
        const articleLength = tuple.pureEntropy.length;
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
        const twentiethWord = Object.values(wordsCUTleft).sort((a, b) => b - a)[20];
        let i = 0;
        for (var leftcutWord in wordsCUTleft) {
            if ((wordsCUTleft[leftcutWord] >= twentiethWord) && (i <= 20)) {
                words[leftcutWord] = i;
                i++;
            }
        }
        return words;
    }
}
