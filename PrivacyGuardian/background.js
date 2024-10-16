// Armazenamento dos dados detectados
let thirdPartyConnections = [];
let firstPartyCookies = 0;
let thirdPartyCookies = 0;
let localStorageItems = 0;
let canvasFingerprintDetected = false;

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
    updatePopup();
  });
}

// Verifica o uso de armazenamento local
function checkLocalStorage(tabId) {
  chrome.tabs.executeScript(tabId, {
    code: 'Object.keys(localStorage).length'
  }, function(result) {
    localStorageItems = result[0];
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
  
  chrome.tabs.executeScript(tabId, { code });
  updatePopup();
}

// Atualizar o popup com as informações coletadas
function updatePopup() {
  chrome.runtime.sendMessage({
    thirdPartyConnections: thirdPartyConnections,
    cookiesInfo: `${firstPartyCookies} / ${thirdPartyCookies}`,
    localStorageInfo: localStorageItems,
    canvasFingerprint: canvasFingerprintDetected ? "Sim" : "Não"
  });
  console.log("Enviando dados para o popup...");
}

// Monitorar mudanças na aba
let currentTabDomain = '';
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    currentTabDomain = getDomain(tab.url);
    console.log("Domínio atual da aba:", currentTabDomain);

    thirdPartyConnections = [];
    countCookies(tab.url);
    checkLocalStorage(tabId);
    detectCanvasFingerprinting(tabId);
  }
});
