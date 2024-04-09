document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('run').addEventListener('click', function() {
      var keywords = document.getElementById('keywords').value.split(',');
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {keywords: keywords}, function(response) {
          console.log('Keywords sent to content script');
        });
      });
    });
});
  