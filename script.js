document.addEventListener("DOMContentLoaded", () => {

    const taskInput = document.getElementById("taskInput");
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
    const numbers = document.getElementById("numbers");
    const progressBar = document.querySelector(".progress");
    const addBtn = document.getElementById("newTask");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // بارگذاری از LocalStorage
    let editId = null; // برای تشخیص حالت ویرایش

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // ذخیره در LocalStorage
    }

    function updateStats() {
        const completed = tasks.filter(t => t.completed).length;
        numbers.textContent = `${completed}/${tasks.length}`;
        const percent = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;
        progressBar.style.width = percent + "%";

        if (percent === 100 && tasks.length > 0) {
            confetti({ particleCount: 180, spread: 80, origin: { y: 0.6 } });
        }
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.className = "taskItem";

            li.innerHTML = `
                <div class="task ${task.completed ? "completed" : ""}">
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                    <span>${task.text}</span>
                </div>

                <div class="icons">
                    <img src="edit.png" class="editBtn">
                    <img src="bin.png" class="deleteBtn">
                </div>
            `;

            // Checkbox event
            li.querySelector("input").addEventListener("change", () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            // Delete button
            li.querySelector(".deleteBtn").addEventListener("click", () => {
                tasks = tasks.filter(t => t.id !== task.id);
                saveTasks();
                renderTasks();
            });

            // Edit button
            li.querySelector(".editBtn").addEventListener("click", () => {
                editId = task.id;                         // حالت ویرایش فعال
                taskInput.value = task.text;              // متن داخل input
                addBtn.textContent = "✔";                 // دکمه تبدیل به Update
            });

            taskList.appendChild(li);
        });

        updateStats();
    }

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const text = taskInput.value.trim();
        if (!text) return;

        if (editId) {
            // Update task
            tasks = tasks.map(t =>
                t.id === editId ? { ...t, text } : t
            );

            editId = null;
            addBtn.textContent = "+";  // دکمه دوباره Add شد

        } else {
            // Add new task
            tasks.push({
                id: Date.now(),
                text,
                completed: false
            });
        }

        taskInput.value = "";
        saveTasks();   // ذخیره بعد از Add یا Update
        renderTasks();
    });

    // بارگذاری اولیه
    renderTasks();

});
