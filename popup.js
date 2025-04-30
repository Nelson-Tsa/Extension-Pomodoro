
// Utilise le bouton pour activer le mode lecteur
document.getElementById('activer-lecteur').addEventListener('click', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      files: ['reader-mode-essential.js']
    }, function() {
      // Après avoir chargé le script, exécuter la fonction toggle
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: () => {
          if (window.ReaderMode) {
            window.ReaderMode.toggle();
          } else {
            console.error('ReaderMode non disponible');
          }
        }
      });
    });
  });
});

document.getElementById('createFloatingDiv').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      // Étape 1: Nettoyage - supprime l'ancienne div flottante s'il y en a une
      chrome.scripting.executeScript({
          target: {tabId: tabs[0].id},
          function: () => {
              // Supprime l'ancienne div flottante
              const oldContainer = document.getElementById('floatingContainerWrapper');
              if (oldContainer) {
                  oldContainer.remove();
                  console.log('Ancienne div flottante supprimée');
              }
          }
      }, () => {
          // Étape 2: Injection du nouveau content.js
          chrome.scripting.executeScript({
              target: {tabId: tabs[0].id},
              files: ['content.js']
          }, () => {
              console.log('Nouvelle div flottante injectée avec succès');
          });
      });
  });
});


// Convertit les secondes en format mm:ss
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Met à jour l'affichage du temps
function updateDisplay(timeLeft, isRunning, isWorking, cycleCount) {
  const display = document.getElementById("timer-display");
  if (!isRunning) {
    display.textContent = timeLeft === 25 * 60 && isWorking ? "Prêt à travailler !" : "En pause"; 
  } else {
    display.textContent = `${isWorking ? "Travail" : "Pause"} : ${formatTime(timeLeft)}`;
  }
  document.getElementById("start").disabled = isRunning;
  document.getElementById("pause").disabled = !isRunning;
}

// Charge l'état initial
chrome.runtime.sendMessage({ action: "getTime" }, (response) => {
  if (response) {
    updateDisplay(response.timeLeft, response.isRunning, response.isWorking, response.cycleCount);
  }
});

// Écoute les mises à jour du background
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "update") {
    updateDisplay(request.timeLeft, request.isRunning, request.isWorking, request.cycleCount);
  }
});

// Bouton Démarrer
document.getElementById("start").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "start" });
});

// Bouton Pause
document.getElementById("pause").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "pause" });
});

// Bouton Réinitialiser
document.getElementById("reset").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "reset" });
});