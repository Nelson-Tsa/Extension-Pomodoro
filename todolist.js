document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
  
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




  
    function loadTasks() {
      chrome.storage.local.get(["tasks"], (result) => {
        const tasks = Array.isArray(result.tasks) ? result.tasks : [];
        renderTasks(tasks);
      });
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
  });
  