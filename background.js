// État du chronomètre Pomodoro
let isWorking = true; // Indique si c'est une période de travail ou de pause
let cycleCount = 0; // Compteur de cycles Pomodoro
let timer = null; // Référence au setInterval
let timeLeft = 25 * 60; // Temps restant en secondes (25 min par défaut) 
let isRunning = false; // Indique si le chronomètre est en cours

// Écoute les messages du popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    if (!isRunning) {
      // Mettre à jour l'icône de l'extension pour indiquer que le timer est en cours
  chrome.action.setBadgeText({ text: "ON" });
  chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });
      isRunning = true;
      startTimer(timeLeft); // Reprend là où le chronomètre s'est arrêté
    }
    sendResponse({ status: "started" });
  } else if (request.action === "pause") {
    // met en pause le badge de l'extension
    chrome.action.setBadgeText({ text: "Pause" });
    isRunning = false;
    clearInterval(timer);
    chrome.runtime.sendMessage({ action: "update", timeLeft, isWorking, cycleCount, isRunning }); // Envoie l'état mis à jour
    saveState(); // Sauvegarde l'état
    sendResponse({ status: "paused" });
  } else if (request.action === "reset") {
    chrome.action.setBadgeText({ text: "" });
    isRunning = false;
    clearInterval(timer);
    timeLeft = 25 * 60; 
    isWorking = true;
    cycleCount = 0;
    chrome.runtime.sendMessage({ action: "update", timeLeft, isWorking, cycleCount, isRunning }); // Inclut isRunning
    saveState(); // Sauvegarde l'état
    sendResponse({ status: "reset" });
  } else if (request.action === "getTime") {
    sendResponse({ timeLeft, isRunning, isWorking, cycleCount });
  }
});

// Démarre le chronomètre avec une durée donnée
function startTimer(duration) {
   // Mettre à jour l'icône de l'extension pour indiquer que le timer est en cours
   // Mettre à jour le badge avec les minutes restantes
  chrome.action.setBadgeText({ text: "ON" });
  chrome.action.setBadgeBackgroundColor({ color: "#4CAF50" });

  clearInterval(timer); // Arrête tout chronomètre existant
  timeLeft = duration;

  timer = setInterval(() => {
    timeLeft--;

    const minutesLeft = Math.ceil(timeLeft / 60);
    chrome.action.setBadgeText({ text: minutesLeft.toString() });

    // Envoie l'état actuel au popup (si ouvert)
    chrome.runtime.sendMessage({ action: "update", timeLeft, isWorking, cycleCount, isRunning });
    saveState();
    if (timeLeft <= 0) {
      chrome.action.setBadgeText({ text: "FIN" });
    chrome.action.setBadgeBackgroundColor({ color: "#FF5555" });
      clearInterval(timer);
      isRunning = false;

      if (isWorking) {
        cycleCount++;
        if (cycleCount % 4 === 0) {
          // Longue pause après 4 cycles
          notify("Pause longue !", "Fais une pause de 20 minutes ! C'est le moment de bouger un peu.");
          timeLeft = 20 * 60; // 20 min pour la pause longue
        } else {
          // Pause courte
          notify("Pause courte !", "Fais une pause de 5 minutes, bois un verre d'eau et étire-toi !");
          timeLeft = 5 * 60; // 5 min pour la pause courte
        }
      } else {
        // Reprise du travail
        notify("Go !", "Repars pour 25 minutes de concentration.");
        timeLeft = 25 * 60; // 25 min pour le travail 
      }

      isWorking = !isWorking; // Alterne entre travail et pause
      saveState(); // Sauvegarde l'état

      // Redémarre automatiquement le chronomètre
      isRunning = true;
      startTimer(timeLeft);
      saveState();
    }
  }, 1000); // Met à jour chaque seconde

  saveState(); // Sauvegarde l'état initial
}

// Envoie une notification
function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "image/pomodoro-removebg-preview.png",
    title: title,
    message: message
  });
}

// Sauvegarde l'état dans chrome.storage pour persistance
function saveState() {
  chrome.storage.local.set({ timeLeft, isRunning, isWorking, cycleCount });
}

// Restaure l'état au démarrage de l'extension
chrome.storage.local.get(["timeLeft", "isRunning", "isWorking", "cycleCount"], (data) => {
  if (data.timeLeft !== undefined) {
    timeLeft = data.timeLeft;
    isRunning = data.isRunning;
    isWorking = data.isWorking;
    cycleCount = data.cycleCount || 0;
    if (isRunning) {
      startTimer(timeLeft); // Reprend le chronomètre si nécessaire
    }
    // Envoie l'état initial au popup
    chrome.runtime.sendMessage({ action: "update", timeLeft, isWorking, cycleCount, isRunning });
  }
});

// Initialiser le badge
chrome.action.setBadgeText({ text: "" });