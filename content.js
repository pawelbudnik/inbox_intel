// content.js

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'extractText') {
        const searchStrings = message.searchStrings;
        const numWords = message.numWords;
        const pageText = document.body.innerText;
        let combinedResults = '';
        for (let i = 0; i < searchStrings.length; i++) {
            const searchString = searchStrings[i];
            const numWord = numWords[i];
            const index = pageText.indexOf(searchString);
            if (index !== -1) {
                const wordsArray = pageText.substring(index + searchString.length).trim().split(' ');
                const extractedWords = wordsArray.slice(0, numWord).join(' ');
                combinedResults += extractedWords + ' ';
            }
        }
        sendResponse({ extractedText: combinedResults.trim() });
    }
});