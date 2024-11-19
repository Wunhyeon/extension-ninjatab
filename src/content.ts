console.log("we are on google.com");

const images = document.querySelectorAll("img");

images.forEach((_image) => {
  // image.src = "https://i.imgflip.com/5mmtwr.jpg";
});

//
// await chrome.scripting.executeScript([
//   {
//     target: [{tabId : 5}],
//     files: ['content-script.js']
//   }
// ])
