document.addEventListener('DOMContentLoaded', function() {
    // Function to set the default values based on the button clicked
    function setDefaultValues(provider) {
        switch(provider) {
            case 'via':
                document.getElementById('searchString1').value = 'Meeting Point:';
                document.getElementById('numWords1').value = 1; 
                addSearchString();
                document.getElementById('searchString2').value = 'Travelers:';
                document.getElementById('numWords2').value = 1;
                addSearchString();
                document.getElementById('searchString3').value = 'Lead Traveler Name:';
                document.getElementById('numWords3').value = 2;
                addSearchString();
                document.getElementById('searchString4').value = 'Phone: (Alternate Phone)';
                document.getElementById('numWords4').value = 1;
                break;
            case 'ts':
                document.getElementById('searchString1').value = 'Meeting Point:';
                document.getElementById('numWords1').value = 1; 
                addSearchString();
                document.getElementById('searchString2').value = 'this link.';
                document.getElementById('numWords2').value = 1;
                addSearchString();
                document.getElementById('searchString3').value = 'First name:';
                document.getElementById('numWords3').value = 1;
                addSearchString();
                document.getElementById('searchString4').value = 'Last name:';
                document.getElementById('numWords4').value = 1;
                addSearchString();
                document.getElementById('searchString5').value = 'Phone number:';
                document.getElementById('numWords5').value = 1;
                break;
            case 'gyg':
                document.getElementById('searchString1').value = 'Option:';
                document.getElementById('numWords1').value = 1; 
                addSearchString();
                document.getElementById('searchString2').value = 'Number of participants:';
                document.getElementById('numWords2').value = 1;
                addSearchString();
                document.getElementById('searchString3').value = 'Main customer:';
                document.getElementById('numWords3').value = 2;
                addSearchString();
                document.getElementById('searchString4').value = 'Phone:';
                document.getElementById('numWords4').value = 1;
                break;
        }
    }

    // Function to add a new search input field
    function addSearchString() {
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
    }

    // Add event listener for dynamically adding search inputs
    document.getElementById('addSearch').addEventListener('click', addSearchString);

    // Add event listener for "VIA" button
    document.getElementById('via').addEventListener('click', function() {
        setDefaultValues('via');
    });
    document.getElementById('ts').addEventListener('click', function() {
        setDefaultValues('ts');
    });
    document.getElementById('gyg').addEventListener('click', function() {
        setDefaultValues('gyg');
    });

    // Event listener for removing search inputs
    document.getElementById('searchInputs').addEventListener('click', function(event) {
        if (event.target.classList.contains('removeSearch')) {
            const searchInputs = document.getElementById('searchInputs');
            if (searchInputs.children.length > 1) { // Only remove if more than one input
                searchInputs.removeChild(searchInputs.lastChild);
            }
        }
    });

    // Event listener for extracting text
    document.getElementById('extractButton').addEventListener('click', function() {
        // Add event listener for extracting text
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

                    let displayText = '';
                    
                    console.log("split string: ", response.extractedText.split(' ')[0]);

                    if (response.extractedText.split(' ')[0] == "Intersport") {
                        document.getElementById('extractedText').innerHTML = response.extractedText.replace('Intersport', '&#x26F0;&#xFE0F;');
                    } else if(response.extractedText.split(' ')[0] == `I'm`) {
                        document.getElementById('extractedText').innerHTML = response.extractedText.replace(`I'm`, '&#x2753;');
                    } else if(response.extractedText.split(' ')[0] == `RECOMMENDED`) {
                        document.getElementById('extractedText').innerHTML = response.extractedText.replace(`RECOMMENDED`, '&#x26F0;&#xFE0F;');
                    } else if(response.extractedText.split(' ')[0] == `Arriving`) {
                        document.getElementById('extractedText').innerHTML = response.extractedText.replace(`Arriving`, '&#x1F17F');
                    } else if(response.extractedText.split(' ')[0] == `Mürren`) {
                        document.getElementById('extractedText').innerHTML = response.extractedText.replace(`Mürren`, '&#x26F0;&#xFE0F;');
                    } else {
                        document.getElementById('extractedText').innerHTML = response.extractedText;
                    }

                    displayText = document.getElementById('extractedText').innerHTML;

                    // Copy the final text to the clipboard
                    navigator.clipboard.writeText(displayText)
                    .then(() => {
                        // Show a quick alert that the text has been copied to clipboard
                        const alertMessage = document.createElement('div');
                        alertMessage.innerHTML = 'Text copied to clipboard!';
                        alertMessage.classList.add('alert');
                        document.body.appendChild(alertMessage);

                        setTimeout(() => {
                            alertMessage.style.display = 'none';
                        }, 3000);
                    })
                    .catch(err => {
                        console.error('Error copying text to clipboard:', err);
                    });

                });
            });
        } else {
            document.getElementById('extractedText').textContent = 'Please enter valid search strings and number of words.';
        }
    });
});
