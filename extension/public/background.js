// extension/public/background.js
console.log("Privacy Guardian background service worker running.");

// Example: Listen for extension install/update
chrome.runtime.onInstalled.addListener(() => {
    console.log('Privacy Guardian extension installed.');
});

// You can add more background logic here, like handling context menus
// or managing cached summaries.