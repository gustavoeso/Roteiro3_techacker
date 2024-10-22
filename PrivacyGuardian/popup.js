// Função para alternar a visibilidade das third-party connections com efeito
function toggleThirdPartyConnections() {
  const list = document.getElementById('thirdPartyConnectionsList');
  const toggleButton = document.getElementById('toggleConnections');
  
  if (list.classList.contains('hidden')) {
    list.classList.remove('hidden');
    list.classList.add('visible');  // Adiciona o efeito de cortina
    toggleButton.classList.add('rotated');  // Aplica o efeito de rotação
  } else {
    list.classList.remove('visible');
    list.classList.add('hidden');  // Oculta com efeito de cortina
    toggleButton.classList.remove('rotated');  // Remove o efeito de rotação
  }
}

// Atualizar a lista de conexões de terceiros no popup
function updateThirdPartyConnections(connections) {
  const list = document.getElementById('thirdPartyConnectionsList');
  const count = document.getElementById('thirdPartyConnectionsCount');

  count.innerText = connections.length;

  // Limpar lista antes de atualizar
  list.innerHTML = '';
  
  connections.forEach(connection => {
    const listItem = document.createElement('li');
    listItem.innerText = connection;
    list.appendChild(listItem);
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
  // Coletar as informações do DOM atualizadas
  const thirdPartyConnections = document.getElementById('thirdPartyConnectionsList').children.length;
  const thirdPartyCookies = parseInt(document.getElementById('cookiesInfo').innerText.split("/")[1].trim());
  const localStorageItems = parseInt(document.getElementById('localStorageInfo').innerText.trim());
  const canvasFingerprint = document.getElementById('canvasFingerprint').innerText;

  // Garantir que as informações estão sendo obtidas corretamente
  console.log("Dados para o cálculo da pontuação:", {
    thirdPartyConnections,
    thirdPartyCookies,
    localStorageItems,
    canvasFingerprint,
    hijackingCount
  });

  // Calcular a pontuação de privacidade
  const privacyScore = calculatePrivacyScore(thirdPartyConnections, thirdPartyCookies, localStorageItems, canvasFingerprint, hijackingCount);
  
  // Atualizar o texto e a largura da barra de progresso
  const scoreBar = document.getElementById('scoreBar');
  const scoreText = document.getElementById('scoreText');
  
  scoreBar.style.width = `${privacyScore}%`;
  scoreText.innerText = `Privacy Score: ${privacyScore}%`;

  // Atualizar a cor da barra com base na pontuação
  if (privacyScore >= 75) {
    scoreBar.style.backgroundColor = "green";
  } else if (privacyScore >= 50) {
    scoreBar.style.backgroundColor = "orange";
  } else {
    scoreBar.style.backgroundColor = "red";
  }
}

// Função para atualizar o número de tentativas de hijacking por domínio
function updateHijackingCount() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const domain = new URL(tabs[0].url).hostname;
    console.log("Recuperando tentativas de hijacking para o domínio:", domain);
    
    chrome.storage.local.get(['hijackingPerDomain'], function(result) {
      console.log("Dados de hijacking no storage:", result.hijackingPerDomain);
  
      let hijackingCount = result.hijackingPerDomain && result.hijackingPerDomain[domain] ? result.hijackingPerDomain[domain] : 0;
      
      document.getElementById('hijackingDetected').innerText = hijackingCount > 0 
        ? `${hijackingCount} tentativas no domínio` 
        : "No";

      updatePrivacyScore(hijackingCount); // Sempre atualizar o score após verificar hijacking
    });
  });
}

// Receber as mensagens do background.js e atualizar o popup
chrome.runtime.onMessage.addListener(function(message) {
  const thirdPartyConnections = message.thirdPartyConnections || [];
  const cookiesInfo = message.cookiesInfo || "Nenhum";
  const localStorageInfo = message.localStorageInfo || "Nenhum";
  const canvasFingerprint = message.canvasFingerprint || "Não";

  updateThirdPartyConnections(thirdPartyConnections);
  document.getElementById('cookiesInfo').innerText = cookiesInfo;
  document.getElementById('localStorageInfo').innerText = localStorageInfo;
  document.getElementById('canvasFingerprint').innerText = canvasFingerprint;

  updateHijackingCount(); // Atualizar o hijacking e o score após qualquer mudança
});

// Adicionar listener para alternar a visibilidade das conexões de terceiros
document.getElementById('toggleConnections').addEventListener('click', toggleThirdPartyConnections);

// Adicionar listeners para os botões
document.getElementById('resetHijacking').addEventListener('click', resetHijackingCount);
document.getElementById('reloadPage').addEventListener('click', reloadPage);

// Atualizar o número de tentativas de hijacking ao carregar o popup
updateHijackingCount();
