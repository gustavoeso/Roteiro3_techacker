chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      console.log("Requisição feita para: ", details.url);
      // Lógica para monitorar domínios de terceiros
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
  );
  