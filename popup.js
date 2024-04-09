// popup.js

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for dynamically adding search inputs
    document.getElementById('addSearch').addEventListener('click', function() {
        const searchInputs = document.getElementById('searchInputs');
        const numSearches = searchInputs.children.length;
        const newSearchDiv = document.createElement('div');
        newSearchDiv.className = 'searchRow'; // Add class for styling
        newSearchDiv.innerHTML = `
            <label for="searchString${numSearches + 1}">Search String ${numSearches + 1}:</label>
            <input type="text" id="searchString${numSearches + 1}" name="searchString${numSearches + 1}">
            <label for="numWords${numSearches + 1}">Number of words to extract:</label>
            <input type="number" id="numWords${numSearches + 1}" name="numWords${numSearches + 1}" min="1">
            <button class="removeSearch" data-index="${numSearches + 1}">Remove</button>
        `;
        searchInputs.appendChild(newSearchDiv);
    });

    // Add event listener for removing search inputs
    document.getElementById('searchInputs').addEventListener('click', function(event) {
        if (event.target.classList.contains('removeSearch')) {
            const searchInputs = document.getElementById('searchInputs');
            if (searchInputs.children.length > 1) { // Only remove if more than one input
                searchInputs.removeChild(searchInputs.lastChild);
            }
        }
    });

    // Add event listener for extracting text
    document.getElementById('extractButton').addEventListener('click', function() {
        const searchStrings = [];
        const numWords = [];
        const searchInputs = document.getElementById('searchInputs').children;
        for (let i = 0; i < searchInputs.length; i++) {
            const searchString = document.getElementById(`searchString${i + 1}`).value.trim();
            const numWord = parseInt(document.getElementById(`numWords${i + 1}`).value);
            if (searchString !== '' && numWord > 0) {
                searchStrings.push(searchString);
                numWords.push(numWord + 1);
            }
        }
        if (searchStrings.length > 0) {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'extractText', searchStrings: searchStrings, numWords: numWords}, function(response) {

                    console.log("response: ", response);
                    console.log("num words: ", numWords);

                    if (response && response.extractedText) {
                        document.getElementById('extractedText').textContent = response.extractedText;
                    } else {
                        document.getElementById('extractedText').textContent = 'No matching text found.';
                    }
                });
            });
        } else {
            document.getElementById('extractedText').textContent = 'Please enter valid search strings and number of words.';
        }
    });
});
