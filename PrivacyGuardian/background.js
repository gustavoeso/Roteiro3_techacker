// Armazenamento dos dados detectados
let thirdPartyConnections = [];
let firstPartyCookies = 0;
let thirdPartyCookies = 0;
let localStorageItems = 0;
let canvasFingerprintDetected = false;
let currentTabDomain = '';

// Função para extrair o domínio base de uma URL
function getDomain(url) {
  let link = document.createElement('a');
  link.href = url;
  return link.hostname;
}

// Monitoramento de conexões de terceiros
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const requestDomain = getDomain(details.url);
    if (requestDomain !== currentTabDomain && currentTabDomain !== '') {
      if (!thirdPartyConnections.includes(requestDomain)) {
        thirdPartyConnections.push(requestDomain);
      }
    }
    console.log("Conexões de terceiros atualizadas:", thirdPartyConnections);
    updatePopup();
  },
  {urls: ["<all_urls>"]}
);

// Função para contar cookies por domínio
function countCookies(tabUrl) {
  chrome.cookies.getAll({url: tabUrl}, function(cookies) {
    firstPartyCookies = 0;
    thirdPartyCookies = 0;

    cookies.forEach(cookie => {
      const cookieDomain = cookie.domain.replace(/^\./, '');
      const tabDomain = getDomain(tabUrl);

      if (cookieDomain === tabDomain) {
        firstPartyCookies++;
      } else {
        thirdPartyCookies++;
      }
    });
    console.log("Cookies atualizados:", firstPartyCookies, thirdPartyCookies);
    updatePopup();
  });
}

// Verifica o uso de armazenamento local
function checkLocalStorage(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: 'Object.keys(localStorage).length'
  }, function(result) {
    localStorageItems = result[0];
    console.log("Itens no Local Storage atualizados:", localStorageItems);
    updatePopup();
  });
}

// Injetar script para monitorar o uso de Canvas
function detectCanvasFingerprinting(tabId) {
  const code = `
    (function() {
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function() {
        canvasFingerprintDetected = true;
        return originalGetContext.apply(this, arguments);
      };
    })();
  `;
  
  chrome.tabs.executeScript(tabId, { code }, () => {
    console.log("Canvas Fingerprinting detectado:", canvasFingerprintDetected);
    updatePopup();
  });
}

// Função para detectar hijacking e armazenar por domínio
function detectHijacking(tabId) {
  const code = `
    (function() {
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(function(node) {
              if (node.tagName === 'SCRIPT') {
                const scriptSrc = node.src || 'Script inline detectado';
                console.log('Script injetado detectado:', scriptSrc);

                // Enviar mensagem para o background.js ao detectar hijacking
                chrome.runtime.sendMessage({ hijackingDetected: true, scriptUrl: scriptSrc });
              }
            });
          }
        });
      });

      observer.observe(document.documentElement, { childList: true, subtree: true });
      console.log('MutationObserver ativo para detectar injeções de script.');
    })();
  `;

  chrome.tabs.executeScript(tabId, { code });
}

// Receber a mensagem de detecção de hijacking e atualizar o armazenamento
chrome.runtime.onMessage.addListener(function(message) {
  if (message.hijackingDetected) {
    console.log('Hijacking detectado:', message.scriptUrl);

    // Armazenar alertas de hijacking por domínio
    chrome.storage.local.get(['hijackingPerDomain'], function(result) {
      let hijackingPerDomain = result.hijackingPerDomain || {};
      const domain = currentTabDomain;
      console.log('Domínio atual:', domain);
      console.log('Valor anterior de hijacking:', hijackingPerDomain[domain]);

      hijackingPerDomain[domain] = (hijackingPerDomain[domain] || 0) + 1;

      chrome.storage.local.set({ hijackingPerDomain: hijackingPerDomain }, function() {
        console.log('Hijacking atualizado para o domínio:', domain, hijackingPerDomain[domain]);
        updatePopup(); // Atualizar o popup com o novo estado de hijacking
      });
    });
  }
});


// Função para enviar todos os dados de uma vez para o popup
function updatePopup() {
  // Certificar-se de que todos os dados estão definidos, mesmo que estejam vazios
  chrome.runtime.sendMessage({
    thirdPartyConnections: thirdPartyConnections || [],
    cookiesInfo: `${firstPartyCookies || 0} / ${thirdPartyCookies || 0}`,
    localStorageInfo: localStorageItems || "Nenhum",
    canvasFingerprint: canvasFingerprintDetected ? "Sim" : "Não"
  });
  console.log("Enviando dados para o popup:", {
    thirdPartyConnections: thirdPartyConnections,
    cookiesInfo: `${firstPartyCookies} / ${thirdPartyCookies}`,
    localStorageInfo: localStorageItems,
    canvasFingerprint: canvasFingerprintDetected ? "Sim" : "Não"
  });
}

// Monitorar mudanças na aba
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    currentTabDomain = getDomain(tab.url);
    console.log("Domínio atual da aba:", currentTabDomain);

    thirdPartyConnections = [];
    countCookies(tab.url);
    checkLocalStorage(tabId);
    detectCanvasFingerprinting(tabId);
    detectHijacking(tabId);

    setTimeout(updatePopup, 500);
  }
});
