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

      // Atualizar a pontuação de privacidade com os dados mais recentes
      updatePrivacyScore(hijackingCount);
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

// Função para recarregar a página
function reloadPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
}

// Função para calcular a pontuação de privacidade
function calculatePrivacyScore(thirdPartyConnections, thirdPartyCookies, localStorageItems, canvasFingerprint, hijackingCount) {
  let score = 100;

  // Conexões de terceiros
  if (thirdPartyConnections.length >= 10) {
    score -= 20;
  }

  // Cookies de terceira parte
  if (thirdPartyCookies >= 10) {
    score -= 20;
  }

  // Local Storage
  if (localStorageItems >= 6) {
    score -= 20;
  }

  // Canvas Fingerprint
  if (canvasFingerprint === "Sim") {
    score -= 20;
  }

  // Tentativas de Hijacking
  if (hijackingCount > 0) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score)); // Garantir que a pontuação fique entre 0 e 100
}

// Função para atualizar a pontuação de privacidade no popup
function updatePrivacyScore(hijackingCount) {
  const thirdPartyConnections = document.getElementById('thirdPartyConnections').innerText.split(",").filter(item => item !== "Nenhuma");
  const thirdPartyCookies = parseInt(document.getElementById('cookiesInfo').innerText.split("/")[1].trim());
  const localStorageItems = parseInt(document.getElementById('localStorageInfo').innerText.trim());
  const canvasFingerprint = document.getElementById('canvasFingerprint').innerText;

  chrome.storage.local.get(['hijackingDetected'], function(result) {
    let hijackingDetected = result.hijackingDetected || hijackingCount > 0;
    
    const privacyScore = calculatePrivacyScore(thirdPartyConnections, thirdPartyCookies, localStorageItems, canvasFingerprint, hijackingDetected ? 1 : hijackingCount);
    document.getElementById('privacyScore').innerText = `Privacy Score: ${privacyScore}%`;
  });
}

// Adicionar listeners para os botões
document.getElementById('resetHijacking').addEventListener('click', resetHijackingCount);
document.getElementById('reloadPage').addEventListener('click', reloadPage);

// Receber as mensagens do background.js e atualizar o popup
chrome.runtime.onMessage.addListener(function(message) {
  const thirdPartyConnections = message.thirdPartyConnections || [];
  const cookiesInfo = message.cookiesInfo || "Nenhum";
  const localStorageInfo = message.localStorageInfo || "Nenhum";
  const canvasFingerprint = message.canvasFingerprint || "Não";

  document.getElementById('thirdPartyConnections').innerText = thirdPartyConnections.length ? thirdPartyConnections.join(", ") : "Nenhuma";
  document.getElementById('cookiesInfo').innerText = cookiesInfo;
  document.getElementById('localStorageInfo').innerText = localStorageInfo;
  document.getElementById('canvasFingerprint').innerText = canvasFingerprint;

  updateHijackingCount();
});

// Atualizar o número de tentativas de hijacking ao carregar o popup
updateHijackingCount();
