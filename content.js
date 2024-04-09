// content.js

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'extractText') {
        const searchStrings = message.searchStrings;
        const numWords = message.numWords;
        const pageText = document.body.innerText;
        let combinedResults = '';

        // Function to split text by spaces and "\nt"
        function splitText(text) {
            return text.split(/\s+|\nt/);
        }

        for (let i = 0; i < searchStrings.length; i++) {
            const searchString = searchStrings[i];
            const numWord = numWords[i];
            const index = pageText.indexOf(searchString);
            if (index !== -1) {
                // Extract text starting from the next character without space separation
                const wordsArray = splitText(pageText.substring(index + searchString.length));
                // Join the first numWord words found after the search string
                const extractedWords = wordsArray.slice(0, numWord).join(' ');
                combinedResults += extractedWords + ' ';
            }
        }
        sendResponse({ extractedText: combinedResults.trim() });
    }
});
