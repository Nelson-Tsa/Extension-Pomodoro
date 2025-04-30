/**
 * Reader Mode Essential
 * Ce fichier contient les fonctionnalités essentielles du mode lecteur
 * pour une intégration facile dans une autre extension Chrome.
 */

(function() {
    // Styles pour le mode lecteur
    const READER_STYLES = `
      body.reader-mode {
        overflow: auto !important;
        max-width: 800px !important;
        margin: 0 auto !important;
        padding: 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 18px !important;
        line-height: 1.6 !important;
        color: #333 !important;
        background-color: #fff !important;
      }
  
      body.reader-mode.dark-mode {
        color: #eee !important;
        background-color: #222 !important;
      }
  
      body.reader-mode * {
        max-width: 100% !important;
      }
  
      body.reader-mode img, 
      body.reader-mode video {
        display: block !important;
        margin: 1em auto !important;
        max-width: 90% !important;
        height: auto !important;
      }
  
      .reader-mode-controls {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: rgba(241, 237, 237, 0.94);
        border-radius: 5px;
        padding: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
      }
  
      .reader-mode-controls.dark-mode {
        background: rgba(50, 50, 50, 0.8);
      }
  
      .reader-mode-controls button {
        margin: 5px;
        padding: 5px 10px;
        
        border: none;
        border-radius: 3px;
        cursor: pointer;
      }
  
      .reader-mode-controls button:hover {
        background:rgb(141, 127, 127);
      }
    `;
  
    // Variables d'état
    let isReaderModeActive = false;
    let isDarkMode = false;
    let isFullscreen = false;
    let originalBody = null;
    let contentContainer = null;
    let controls = null;
  
    // Sauvegarde les styles et contenus originaux de la page
    function saveOriginalContent() {
      originalBody = document.body.cloneNode(true);
    }
  
    // Crée les contrôles du mode lecteur
    function createControls() {
      controls = document.createElement('div');
      controls.className = 'reader-mode-controls';
      
      const darkModeButton = document.createElement('button');
      darkModeButton.textContent = '🌙 Mode Sombre';
      darkModeButton.addEventListener('click', toggleDarkMode);
      
      const fullscreenButton = document.createElement('button');
      fullscreenButton.textContent = '⛶ Plein Écran';
      fullscreenButton.addEventListener('click', toggleFullscreen);
      
      const exitButton = document.createElement('button');
      exitButton.textContent = '✕ Quitter';
      exitButton.addEventListener('click', deactivateReaderMode);
      
      controls.appendChild(darkModeButton);
      controls.appendChild(fullscreenButton);
      controls.appendChild(exitButton);
      
      document.body.appendChild(controls);
    }
  
    // Identifie le contenu principal de la page
    function identifyMainContent() {
      // Priorité aux éléments sémantiques qui indiquent du contenu principal
      const contentSelectors = [
        'article',
        'main',
        '.article',
        '.post',
        '.content',
        '#content',
        '.post-content',
        '.entry-content'
      ];
      
      for (const selector of contentSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 1) {
          return elements[0].cloneNode(true);
        } else if (elements.length > 1) {
          // Si plusieurs éléments, choisir celui qui a le plus de texte
          let bestElement = elements[0];
          let maxTextLength = elements[0].textContent.length;
          
          for (let i = 1; i < elements.length; i++) {
            const textLength = elements[i].textContent.length;
            if (textLength > maxTextLength) {
              maxTextLength = textLength;
              bestElement = elements[i];
            }
          }
          
          return bestElement.cloneNode(true);
        }
      }
      
      // Si aucun contenu spécifique n'est trouvé, prendre tout le body
      return document.body.cloneNode(true);
    }
  
    // Nettoie le contenu des éléments non désirés
    function cleanContent(content) {
      // Liste des sélecteurs à supprimer
      const elementsToRemove = [
        'header',
        'footer',
        'nav',
        'aside',
        '.ads',
        '.ad',
        '.advertisement',
        '.banner',
        '.menu',
        '.sidebar',
        '.comments',
        '.sharing',
        '.social',
        '.related',
        '.recommended',
        '.newsletter',
        'iframe:not([src*="youtube"]):not([src*="vimeo"])', // Garder les vidéos YouTube/Vimeo
        'script',
        'style',
        'noscript'
      ];
      
      // Cloner pour éviter les mutations pendant l'itération
      const cleanedContent = content.cloneNode(true);
      
      // Supprimer les éléments indésirables
      elementsToRemove.forEach(selector => {
        const elements = cleanedContent.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      });
      
      return cleanedContent;
    }
  
    // Applique le mode lecteur
    function activateReaderMode() {
      if (isReaderModeActive) return;
      
      // Sauvegarder l'état original
      saveOriginalContent();
      
      // Ajouter les styles
      const styleElement = document.createElement('style');
      styleElement.id = 'reader-mode-styles';
      styleElement.textContent = READER_STYLES;
      document.head.appendChild(styleElement);
      
      // Identifier et nettoyer le contenu principal
      const mainContent = identifyMainContent();
      const cleanedContent = cleanContent(mainContent);
      
      // Créer un conteneur pour le contenu nettoyé
      contentContainer = document.createElement('div');
      contentContainer.id = 'reader-mode-container';
      contentContainer.appendChild(cleanedContent);
      
      // Vider le body et ajouter le contenu nettoyé
      document.body.innerHTML = '';
      document.body.appendChild(contentContainer);
      document.body.classList.add('reader-mode');
      
      // Ajouter les contrôles
      createControls();
      
      isReaderModeActive = true;
    }
  
    // Désactive le mode lecteur
    function deactivateReaderMode() {
      if (!isReaderModeActive || !originalBody) return;
      
      // Supprimer les styles ajoutés
      const styleElement = document.getElementById('reader-mode-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      // Restaurer le body original
      document.body.innerHTML = '';
      Array.from(originalBody.childNodes).forEach(node => {
        document.body.appendChild(node.cloneNode(true));
      });
      document.body.classList.remove('reader-mode');
      document.body.classList.remove('dark-mode');
      
      // Quitter le mode plein écran si actif
      if (isFullscreen) {
        exitFullscreen();
      }
      
      isReaderModeActive = false;
      isDarkMode = false;
      contentContainer = null;
      controls = null;
    }
  
    // Active/désactive le mode sombre
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (controls) controls.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
        if (controls) controls.classList.remove('dark-mode');
      }
    }
  
    // Active le mode plein écran
    function enterFullscreen() {
      const docEl = document.documentElement;
      
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
      
      isFullscreen = true;
    }
  
    // Quitte le mode plein écran
    function exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      
      isFullscreen = false;
    }
  
    // Bascule entre mode plein écran et normal
    function toggleFullscreen() {
      if (isFullscreen) {
        exitFullscreen();
      } else {
        enterFullscreen();
      }
    }
  
    // Fonction principale qui sera exportée pour l'intégration dans votre extension
    function toggleReaderMode() {
      if (isReaderModeActive) {
        deactivateReaderMode();
      } else {
        activateReaderMode();
      }
    }
  
    // Exposer les fonctions pour l'utilisation externe
    window.ReaderMode = {
      toggle: toggleReaderMode,
      activate: activateReaderMode,
      deactivate: deactivateReaderMode,
      toggleDarkMode: toggleDarkMode,
      toggleFullscreen: toggleFullscreen
    };
  
  })();
  