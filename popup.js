let provider; // Define provider as a global variable

document.addEventListener('DOMContentLoaded', function() {
    // Function to set the default values based on the button clicked
    function setDefaultValues(providerValue) {
        provider = providerValue; // Set the provider value
        switch(provider) {
            case 'VIA':
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
            case 'TS':
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
            case 'GYG':
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

        document.getElementById('extractButton').click();
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
    document.getElementById('VIA').addEventListener('click', function() {
        setDefaultValues('VIA');
    });
    document.getElementById('TS').addEventListener('click', function() {
        setDefaultValues('TS');
    });
    document.getElementById('GYG').addEventListener('click', function() {
        setDefaultValues('GYG');
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
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'extractText', searchStrings: searchStrings, numWords: numWords }, function (response) {
                    let displayText = '';
        
                    // Modify extracted text based on provider
                    switch (provider) {
                        case 'VIA':
                            displayText = response.extractedText.replace(response.extractedText.split(' ')[0], '\u26F0\uFE0F');
                            break;
                        case 'TS':
                            if (response.extractedText.split(' ')[0] == 'RECOMMENDED') {
                                displayText = response.extractedText.replace(response.extractedText.split(' ')[0], '\u26F0\uFE0F');
                            } else if (response.extractedText.split(' ')[0] == 'Arriving') {
                                displayText = response.extractedText.replace(response.extractedText.split(' ')[0], '\u1F17F');
                            } else {
                                displayText = response.extractedText.replace(response.extractedText.split(' ')[0], '\u2753');
                            }
                            break;
                        case 'GYG':
                            displayText = response.extractedText.replace(response.extractedText.split(' ')[0], '\u26F0\uFE0F');
                            break;
                    }
        
                    // Insert the provider variable between elements 1 and 2
                    let textArray = displayText.split(' ');
                    textArray.splice(3, 0, `(${provider})`);
                    displayText = textArray.join(' ');
        
                    console.log("Display text: ", displayText);
        
                    // Copy the final text to the clipboard
                    navigator.clipboard.writeText(displayText)
                        .then(() => {
                            // Show a quick alert that the text has been copied to clipboard
                            const alertMessage = document.createElement('div');
                            // TODO: add location details in alert
                            alertMessage.innerHTML = 'Text copied to clipboard!';
                            alertMessage.classList.add('alert');
                            document.body.appendChild(alertMessage);
        
                            // Add event listener to remove alert on click away
                            document.body.addEventListener('click', function () {
                                alertMessage.style.display = 'none';
                            }, { once: true }); // Remove event listener after one click
                        })
                        .catch(err => {
                            console.error('Error copying text to clipboard:', err);
                        });
        
                    // Update the extracted text on the page
                    document.getElementById('extractedText').innerHTML = displayText;
                });
            });
        } else {
            document.getElementById('extractedText').textContent = 'Please enter valid search strings and number of words.';
        }
    });
});