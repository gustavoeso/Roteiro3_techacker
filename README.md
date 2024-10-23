
---

# **PrivacyGuardian**

## Descrição do Projeto (Português)

**PrivacyGuardian** é uma extensão de navegador desenvolvida como parte de um projeto de faculdade do INSPER, para a disciplina **TecHacker** (Roteiro 3). A extensão é voltada para a proteção da privacidade do usuário durante a navegação na web, oferecendo uma visão clara de como os sites interagem com o navegador e com os dados do usuário. Ela detecta e exibe informações sobre conexões de terceiros, uso de cookies, itens armazenados localmente, fingerprints e tentativas de hijacking.

A extensão já está publicada e pode ser encontrada no [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/privacyguardiangustavoeso/).

### Funcionalidades Principais

1. **Detecção de Conexões de Terceiros**:
   - Detecta e exibe todas as conexões de terceiros feitas pelos sites visitados. O número total de conexões é mostrado, e os domínios podem ser visualizados clicando em um botão para expandir a lista.
   - Permite que o usuário saiba quantas e quais conexões externas estão sendo feitas, ajudando a avaliar a exposição dos seus dados.

2. **Monitoramento de Cookies (Primeira e Terceira Parte)**:
   - Exibe o número de cookies de primeira e terceira parte armazenados durante a navegação no site.
   - Ajuda a entender o nível de rastreamento por cookies em cada site.

3. **Armazenamento Local (Local Storage)**:
   - Mostra quantos itens estão sendo armazenados localmente no navegador.
   - Facilita o controle sobre o uso de armazenamento local, uma técnica comum de armazenamento persistente de dados.

4. **Canvas Fingerprinting**:
   - Detecta se o site está utilizando técnicas de Canvas Fingerprinting, uma prática comum para rastrear usuários.
   - Notifica o usuário quando o Canvas Fingerprinting é detectado, oferecendo uma visão sobre o rastreamento invisível.

5. **Tentativas de Hijacking**:
   - Monitora e detecta injeções de scripts suspeitas que podem indicar tentativas de hijacking.
   - Exibe alertas no caso de hijacking detectado e permite o reset das contagens de tentativas.

6. **Pontuação de Privacidade**:
   - Avalia o nível de privacidade de cada site com base em conexões de terceiros, cookies, fingerprints e tentativas de hijacking.
   - A pontuação varia de 0 a 100%, sendo visualmente representada por uma barra de progresso que muda de cor conforme a nota.

### Como Rodar Localmente

Para testar a extensão localmente com modificações, siga os passos abaixo:

1. **Clone o Repositório** ou baixe os arquivos da extensão.

2. **Carregue a Extensão no Firefox**:
   - Abra o Firefox e digite `about:debugging` na barra de endereço.
   - Clique em **"This Firefox"** no menu lateral.
   - Clique em **"Load Temporary Add-on..."** e selecione o arquivo `manifest.json` da pasta da extensão.

3. **Faça Modificações**:
   - Edite os arquivos necessários (`popup.js`, `background.js`, `styles.css`, etc.).
   - Recarregue a extensão na mesma página de depuração clicando no botão de recarregar.

### Publicação

A extensão está publicada e disponível para instalação através deste [link](https://addons.mozilla.org/en-US/firefox/addon/privacyguardiangustavoeso/).

---

## Project Description (English)

**PrivacyGuardian** is a browser extension developed as part of a college project at **INSPER** for the **TecHacker** course (Project 3). The extension focuses on protecting user privacy during web browsing, providing clear insights into how websites interact with the browser and user data. It detects and displays information about third-party connections, cookies, local storage items, fingerprints, and hijacking attempts.

The extension is now live and can be found on [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/privacyguardiangustavoeso/).

### Key Features

1. **Third-Party Connections Detection**:
   - Detects and displays all third-party connections made by the visited websites. The total number of connections is shown, and the domains can be expanded by clicking a button.
   - Helps users understand how many and which external connections are made without their knowledge, allowing them to assess data exposure.

2. **Cookies Monitoring (First-Party and Third-Party)**:
   - Displays the number of first-party and third-party cookies stored during a browsing session.
   - Helps users understand the level of cookie tracking on each site.

3. **Local Storage Monitoring**:
   - Shows how many items are being stored locally in the browser.
   - Helps monitor the use of local storage, a common technique for persistent data storage.

4. **Canvas Fingerprinting Detection**:
   - Detects if the site is using Canvas Fingerprinting techniques, a common practice for tracking users.
   - Notifies users when Canvas Fingerprinting is detected, offering insights into invisible tracking practices.

5. **Hijacking Attempts**:
   - Monitors and detects suspicious script injections that may indicate hijacking attempts.
   - Alerts the user when hijacking is detected and allows resetting of the attempt count.

6. **Privacy Score**:
   - Evaluates the privacy level of each site based on third-party connections, cookies, fingerprints, and hijacking attempts.
   - The score ranges from 0 to 100%, visually represented by a progress bar that changes color according to the score.

### Running Locally

To test the extension locally with modifications, follow these steps:

1. **Clone the Repository** or download the extension files.

2. **Load the Extension in Firefox**:
   - Open Firefox and type `about:debugging` in the address bar.
   - Click on **"This Firefox"** from the side menu.
   - Click on **"Load Temporary Add-on..."** and select the `manifest.json` file from the extension folder.

3. **Make Modifications**:
   - Edit the necessary files (`popup.js`, `background.js`, `styles.css`, etc.).
   - Reload the extension from the debugging page by clicking the reload button.

### Publication

The extension is live and available for installation at this [link](https://addons.mozilla.org/en-US/firefox/addon/privacyguardiangustavoeso/).

---
