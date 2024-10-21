// Função para atualizar o número de tentativas de hijacking por domínio
function updateHijackingCount() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const domain = new URL(tabs[0].url).hostname;
    console.log("Recuperando tentativas de hijacking para o domínio:", domain);
    
    chrome.storage.local.get(['hijackingPerDomain'], function(result) {
      console.log("Dados de hijacking no storage:", result.hijackingPerDomain);
  
      let hijackingCount = result.hijackingPerDomain && result.hijackingPerDomain[domain] ? result.hijackingPerDomain[domain] : 0;
      
      document.getElementById('hijackingDetected').innerText = hijackingCount > 0 
        ? `Yes - ${hijackingCount} tentativas detectadas no domínio` 
        : "No";
    });
  });
}

// Função para resetar tentativas de hijacking
function resetHijackingCount() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const domain = new URL(tabs[0].url).hostname;
    chrome.storage.local.get(['hijackingPerDomain'], function(result) {
      let hijackingPerDomain = result.hijackingPerDomain || {};
      hijackingPerDomain[domain] = 0;  // Resetar as tentativas para o domínio atual

      chrome.storage.local.set({ hijackingPerDomain: hijackingPerDomain }, function() {
        console.log(`Tentativas de hijacking resetadas para o domínio: ${domain}`);
        updateHijackingCount(); // Atualizar a exibição após resetar
      });
    });
  });
}

// Adicionar listener para o botão de reset
document.getElementById('resetHijacking').addEventListener('click', resetHijackingCount);

// Receber as mensagens do background.js
chrome.runtime.onMessage.addListener(function(message) {
  console.log("Mensagem recebida do background:", message);

  // Atualizar o popup com as informações mais recentes
  const thirdPartyConnections = message.thirdPartyConnections || [];
  const cookiesInfo = message.cookiesInfo || "Nenhum";
  const localStorageInfo = message.localStorageInfo || "Nenhum";
  const canvasFingerprint = message.canvasFingerprint || "Não";

  document.getElementById('thirdPartyConnections').innerText = thirdPartyConnections.length ? thirdPartyConnections.join(", ") : "Nenhuma";
  document.getElementById('cookiesInfo').innerText = cookiesInfo;
  document.getElementById('localStorageInfo').innerText = localStorageInfo;
  document.getElementById('canvasFingerprint').innerText = canvasFingerprint;

  // Atualizar o número de tentativas de hijacking
  updateHijackingCount();
});

// Chamar a função para exibir as tentativas de hijacking ao carregar o popup
updateHijackingCount();
