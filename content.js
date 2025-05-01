
// ------------ GESTION DIV FLOTTANTE ------------

// Vérifier si la div existe déjà pour éviter les duplications
if (!document.getElementById('floatingContainer')) {
    console.log('Création de la div flottante');

    // Créer la div flottante
    const floatingContainer = document.createElement('div');
    floatingContainer.id = 'floatingContainer';
    floatingContainer.innerHTML = `
        <button id="toggleButton">−</button>
        <button id="closeButton">✕</button>
        <div id="timerSection">
            <h2>ADA STUDENT BUDDY 🍅</h2>
            <div id="timer-display">Travail : 25:00</div>
        </div>
        <div class="buttonContainer">
            <button id="toggleTimerButton">Cacher Timer</button>
        </div>

        <div id="todoSection">
            <h2>Ma Todo List</h2>
            <div id="taskListContainer">
            <input id="taskInput" type="text" placeholder="Nouvelle tâche...">
            <button id="addBtn">Ajouter</button>
            </div>
            <ul id="taskList"></ul>
        </div>
        <div class="buttonContainer">
            <button id="toggleTodoButton">Cacher Todo List</button>
        </div>
    `;

    

    // Créer un wrapper pour isoler la div
    const wrapper = document.createElement('div');
    wrapper.id = 'floatingContainerWrapper';
    wrapper.appendChild(floatingContainer);

    // Ajouter les styles CSS pour la div flottante
    const style = document.createElement('style');
    style.textContent = `
        #floatingContainerWrapper {
            position: fixed;
            z-index: 9999;
            top: 0;
            left: 0;
        }
            
        #floatingContainer {
            position: fixed;
            width: 300px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            padding: 15px;
            z-index: 10000;
            top: 20px;
            left: 20px;
            font-family: Arial, sans-serif;
            color: rgba(0,0,0,0.8);
            font-size: 14px;
            background: linear-gradient(to bottom, #fdf5f2, #FDD8D0);
        }
        
        #floatingContainer.minimized {
            height: 40px;
            overflow: hidden;
        }
        
        #floatingContainer button {
            padding: 5px 10px;
            margin: 3px;
            cursor: pointer;
            background-color:#b0f2bd;
            color: white;
            border: none;
            border-radius: 4px;
         
        }
        
        #closeButton, #toggleButton {
            position: absolute;
            top: 5px;
            font-size: 14px;
            padding: 2px 0;
            margin: 0;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            margin-bottom: 10px;
        }
        
        #closeButton {
            right: 5px;
            background-color: #ff6b6b;
        }
        
        #toggleButton {
            right: 30px;
            text-align: center;
            align-items: center;
            
        }
        
        #timerSection, #todoSection {
            margin-top: 10px;
            padding-top: 10px;
            font-family: Arial, sans-serif;
            color: rgba(0,0,0,0.8);
            font-weight: bold;
            text-align: center;
        }
        
        .buttonContainer {
            display: flex;
            justify-content: center;
            width: 100%;
            margin: 10px 0;
            margin-top: 20px;
        }
        
        #toggleTimerButton, #toggleTodoButton {
            width: 80%;
            text-align: center;
            margin: 0;
        }
        
        .hidden {
            display: none;
        }
        
        
        
        #taskInput {
            width: 70%;
            padding: 5px;
            margin-right: 5px;
        }
        h2 {
                font-size: 1.4em;
                margin-bottom: 10px;
                color: #E74C34;
                letter-spacing: 1px;
                margin-top: 20px;
            }

            /* Style pour la liste */
                .task-item {
                list-style-type: disc;
                margin-bottom: 10px;
                }

                .task-content{
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 10px;
                }

                .task-text{
                flex: 1;
                font-size: 16px;
                word-break: break-word;
                }

                .task-buttons{
                display: flex;
                gap: 6px;
                flex-shrink: 0;
                }

                .task-buttons button{
                width: 32px;
                height: 32px;
                background-color:#b0f2bd;
                color: #0b0b0b;
                border: none;
                cursor: pointer;
                border-radius: 5px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background-color 0.2s ease;
                padding: 0;
                }

                #task-list{
                list-style-type: disc;
                padding-left: 20px;
                }
                #timer-display {
                    font-size: 2em;
                    margin: 10px auto; /* Center the timer display */
                    background-color: #ffffff;
                    padding: 16px;
                    border-radius: 100px;
                    border: 4px solid  #b0f2bd;
                    color: #E74C34;
                    width: 155px;
                    height: 155px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
                    }
                    
                    #taskInput {
                    width: 160px;
                    height: 25px;
                    padding: 5px;
                    margin : 0;
                    }

                    #taskListContainer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    }
    `;

    let timerDisplay = null;
    let timerLoadTasks = null;
    document.head.appendChild(style);
    
    // Ajouter le wrapper au body
    document.body.appendChild(wrapper);
    console.log('Wrapper et div flottante ajoutés au DOM');

    // Vérifier la position de la div
    const rect = floatingContainer.getBoundingClientRect();
    console.log('Position initiale de la div :', rect);

    // Vérifier les styles appliqués
    const computedStyles = window.getComputedStyle(floatingContainer);
    console.log('Styles appliqués :', {
        position: computedStyles.position,
        top: computedStyles.top,
        left: computedStyles.left,
        right: computedStyles.right,
        zIndex: computedStyles.zIndex,
        pointerEvents: computedStyles.pointerEvents,
        opacity: computedStyles.opacity,
        visibility: computedStyles.visibility,
        display: computedStyles.display
    });

    //---------------- FIN GESTION DIV FLOTTANTE ----------------


// --------------- GESTION TODOLIST -------------------

    // Charger todoList.js dynamiquement
    const todoScript = document.createElement('script');
    todoScript.src = chrome.runtime.getURL('todoList.js');
    document.head.appendChild(todoScript);
    console.log('todoList.js chargé');

   
    function renderTasks(tasks) {
        taskList.innerHTML = "";
        tasks.forEach((taskObj, index) => {
          const li = document.createElement("li");
          li.className = "task-item";  // Add a class for styling a la place de la ligne 11
          // li.textContent = taskObj.text;
          
  //ajout Wrapper
          const contentWrapper = document.createElement("div");
          contentWrapper.className = "task-content";  // Add a class for styling
  // fin ajout Wrapper
  
          //- Add a span for the task text
          const span = document.createElement("span");
          span.className = "task-text";  // Add a class for styling
          span.textContent = taskObj.text;
  
          //---span fin
  
          if (taskObj.done) {
            span.style.textDecoration = "line-through";  // ajout a la place de la ligne 27
            // li.style.textDecoration = "line-through";
          }
  
          // ajout des containers boutons
          const buttonContainer = document.createElement("div");
          buttonContainer.className = "task-buttons";  // Add a class for styling
          
          // ajout des containers boutons fin
  
  
          const strikeBtn = document.createElement("button");
          strikeBtn.textContent = "✔️";
          strikeBtn.onclick = () => {
            taskObj.done = !taskObj.done; // ajout [index]
            saveTasks(tasks);
            renderTasks(tasks);
          };
    
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "❌";
          removeBtn.onclick = () => removeTask(index);
    
          // li.appendChild(strikeBtn);
          // li.appendChild(removeBtn);
          // taskList.appendChild(li);
                // Ajout des enfants 
                buttonContainer.appendChild(strikeBtn);
                buttonContainer.appendChild(removeBtn);
    
                contentWrapper.appendChild(span);
                contentWrapper.appendChild(buttonContainer);
                li.appendChild(contentWrapper);
                taskList.appendChild(li);
    
                // Ajout des enfants fin
        });
              
      }

    // -------------- ancienne fonction todoList -----------------


    // function renderTasks(tasks) {
    //     taskList.innerHTML = "";
    //     tasks.forEach((taskObj, index) => {
    //       const li = document.createElement("li");
    //       li.textContent = taskObj.text;
          
    //       if (taskObj.done) {
    //         li.style.textDecoration = "line-through";
    //       }
    
    //       const strikeBtn = document.createElement("button");
    //       strikeBtn.textContent = "✔️";
    //       strikeBtn.onclick = () => {
    //         taskObj.done = !taskObj.done;
    //         saveTasks(tasks);
    //         renderTasks(tasks);
    //       };
    
    //       const removeBtn = document.createElement("button");
    //       removeBtn.textContent = "❌";
    //       removeBtn.onclick = () => removeTask(index);
    
    //       li.appendChild(strikeBtn);
    //       li.appendChild(removeBtn);
    //       taskList.appendChild(li);
    //     });
    //   }
    

    function loadTasks() {
        if (!document.getElementById('taskList')) {
            clearInterval(timerLoadTasks)
            console.error('taskList non trouvé');
            return;
        }else {
        chrome.storage.local.get(["tasks"], (result) => {
          const tasks = Array.isArray(result.tasks) ? result.tasks : [];
          renderTasks(tasks);
        });
        }
        }
    
      function saveTasks(tasks) {
        chrome.storage.local.set({ tasks });
      }
    
      function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) return;
    
        chrome.storage.local.get(["tasks"], (result) => {
          const tasks = Array.isArray(result.tasks) ? result.tasks : [];
          tasks.push({ text: taskText, done: false });
          saveTasks(tasks);
          renderTasks(tasks);
          taskInput.value = "";
        });
      }
      function removeTask(index) {
        chrome.storage.local.get(["tasks"], (result) => {
          const tasks = Array.isArray(result.tasks) ? result.tasks : [];
          tasks.splice(index, 1);
          saveTasks(tasks);
          renderTasks(tasks);
        });
      }
      addBtn.addEventListener("click", addTask);
      loadTasks();
// --------------- FIN GESTION TODOLIST -------------------

//---------------- GESTION POMODORO ---------------


    // Logique du Pomodoro
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    function updateDisplay(timeLeft, isRunning, isWorking, cycleCount) {
       
        clearInterval(timerDisplay);
        
        const display = document.getElementById('timer-display');
        if (!display) {
            
           console.error('timer-display non trouvé');
            return;
        }
        // Charge l'état initial et démarre le timer
    chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
        //console.log('État initial reçu :', response);
        if (response) {
            updateDisplay(response.timeLeft, response.isRunning, response.isWorking, response.cycleCount);
           
        }
    });
        
        // Met à jour l'affichage
        display.textContent = `${isWorking ? 'Travail' : 'Pause'} : ${formatTime(timeLeft)}`;
    
    }

    // Écoute les mises à jour du background
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'update') {
            console.log('Mise à jour reçue :', request);
            updateDisplay(request.timeLeft, request.isRunning, request.isWorking, request.cycleCount);
        }
    });
    
    // Modifier le timer chaque seconde
    timerDisplay = setInterval(() => {
        // Écoute les mises à jour du background
        chrome.runtime.sendMessage({ action: 'getTime' }, (response) => {
         console.log('État initial reçu :', response);
         if (response) {
             updateDisplay(response.timeLeft, response.isRunning, response.isWorking, response.cycleCount);
         }
     });
        }, 1000);
    
       timerLoadTasks = setInterval(() => {
            loadTasks();
            }, 500);
    

//---------------- FIN GESTION POMODORO ---------------


    //---------------- GESTION BOUTON AFFICHAGE  ----------------


    // Bouton de fermeture
    const closeButton = document.getElementById('closeButton');
    closeButton.addEventListener('click', (e) => {
        if (timerDisplay) {
            clearInterval(timerDisplay); }
        if (timerLoadTasks) {
            clearInterval(timerLoadTasks); }
        e.stopPropagation();
        console.log('Bouton close cliqué');
        wrapper.remove();
    });

    // Minimiser/maximiser
    const toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
       // console.log('Bouton toggle cliqué');
        if (floatingContainer.classList.contains('minimized')) {
            floatingContainer.classList.remove('minimized');
            floatingContainer.style.height = 'auto';
            toggleButton.textContent = '−';
        } else {
            floatingContainer.classList.add('minimized');
            floatingContainer.style.height = '40px';
            toggleButton.textContent = '+';
        }
    });

    // Cacher/afficher le timer
    const toggleTimerButton = document.getElementById('toggleTimerButton');
    toggleTimerButton.addEventListener('click', (e) => {
        e.stopPropagation();
       // console.log('Bouton toggle timer cliqué');
        const timerSection = document.getElementById('timerSection');
        if (timerSection.classList.contains('hidden')) {
            timerSection.classList.remove('hidden');
            toggleTimerButton.textContent = 'Cacher Timer';
        } else {
            timerSection.classList.add('hidden');
            toggleTimerButton.textContent = 'Afficher Timer';
           
        }
    });

    // Cacher/afficher la todo list
    const toggleTodoButton = document.getElementById('toggleTodoButton');
    toggleTodoButton.addEventListener('click', (e) => {
        e.stopPropagation();
       // console.log('Bouton toggle todo cliqué');
        const todoSection = document.getElementById('todoSection');
        if (todoSection.classList.contains('hidden')) {
            todoSection.classList.remove('hidden');
            toggleTodoButton.textContent = 'Cacher Todo List';
        } else {
            todoSection.classList.add('hidden');
            toggleTodoButton.textContent = 'Afficher Todo List';
        }
    });

    //---------------- FIN GESTION BOUTON AFFICHAGE  ----------------


    //---------------- GESTION DRAG AND DROP ----------------

    // Rendre la div déplaçable
    let isDragging = false;
    let currentX = 20;
    let currentY = 20;
    let initialX;
    let initialY;

    // Réinitialiser la position sauvegardée
    chrome.storage.local.remove('floatingPos', () => {
       // console.log('Position sauvegardée réinitialisée');
    });

    // Charger la position sauvegardée
    chrome.storage.local.get(['floatingPos'], (result) => {
        console.log('Position chargée :', result.floatingPos);
        if (result.floatingPos) {
            currentX = result.floatingPos.x;
            currentY = result.floatingPos.y;
            floatingContainer.style.setProperty('left', currentX + 'px', 'important');
            floatingContainer.style.setProperty('top', currentY + 'px', 'important');
            floatingContainer.style.setProperty('right', 'auto', 'important');
            floatingContainer.style.setProperty('bottom', 'auto', 'important');
            console.log('Position appliquée : left=', currentX, 'top=', currentY);
        }
    });

    floatingContainer.addEventListener('mousedown', (e) => {
        console.log('mousedown déclenché, target=', e.target.tagName, 'id=', e.target.id);
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') {
            console.log('Clic sur un bouton ou input, drag annulé');
            return;
        }
        e.preventDefault();
        console.log('Début du drag, clientX=', e.clientX, 'clientY=', e.clientY);
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
        isDragging = true;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            e.preventDefault();
            // Limiter les positions pour rester dans la fenêtre
            currentX = Math.max(0, Math.min(e.clientX - initialX, window.innerWidth - 300));
            currentY = Math.max(0, Math.min(e.clientY - initialY, window.innerHeight - 400));
            floatingContainer.style.setProperty('left', currentX + 'px', 'important');
            floatingContainer.style.setProperty('top', currentY + 'px', 'important');
            floatingContainer.style.setProperty('right', 'auto', 'important');
            floatingContainer.style.setProperty('bottom', 'auto', 'important');
            console.log('Déplacement : left=', currentX, 'top=', currentY, 'clientX=', e.clientX, 'clientY=', e.clientY);
            const updatedStyles = window.getComputedStyle(floatingContainer);
            console.log('Styles après déplacement :', {
                left: updatedStyles.left,
                top: updatedStyles.top,
                right: updatedStyles.right,
                bottom: updatedStyles.bottom,
                opacity: updatedStyles.opacity,
                visibility: updatedStyles.visibility
            });
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            console.log('Fin du drag, position sauvegardée :', { x: currentX, y: currentY });
            chrome.storage.local.set({ floatingPos: { x: currentX, y: currentY } });
            isDragging = false;
        }
    });

    // Log tous les clics pour débogage
    floatingContainer.addEventListener('click', (e) => {
        console.log('Clic sur la div, target=', e.target.tagName, 'id=', e.target.id);
    });
} else {
    console.log('Div flottante déjà présente');
}

//---------------- FIN GESTION DRAG AND DROP ----------------
