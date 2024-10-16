// Receber dados do background.js e atualizar o popup
chrome.runtime.onMessage.addListener(function(message) {
    console.log("Recebendo dados do background.js:", message); // Verifica se isso aparece no console
  
    document.getElementById('thirdPartyConnections').innerText = message.thirdPartyConnections.length ? message.thirdPartyConnections.join(", ") : "Nenhuma";
    document.getElementById('cookiesInfo').innerText = message.cookiesInfo || "Nenhum";
    document.getElementById('localStorageInfo').innerText = message.localStorageInfo || "Nenhum";
    document.getElementById('canvasFingerprint').innerText = message.canvasFingerprint;
  });
  