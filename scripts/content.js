chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.keywords) {
      // Extract email content and search for keywords
      // Perform actions based on keywords
      console.log('Received keywords:', message.keywords);
    }
});