document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const clearCompletedButton = document.getElementById('clear-completed');
    const filterButtons = document.querySelectorAll('.filter-buttons button');

    const baseURL = 'http://localhost:3000'; // Your backend server
    let tasks = [];

    taskForm.addEventListener('submit', addtask);

    function saveTasks() {
        console.log("saving tasks");
        axios.post(`${baseURL}/update-tasks`, {
            tasks
        })
        .then((res) => {
            console.log(res);
        }).catch((err) => {
            console.error(err);
        });
    }

    function addtask(event) {
        event.preventDefault();
        const text = taskInput.value.trim();
        axios.post(`${baseURL}/add-task`, {
            task: {
                text,
                completed: false
            }
        })
        .then((res) => {
            tasks = res.data;
            renderTasks(tasks);
        }).catch((err) => {
            console.log(err);
        });
        taskInput.value = '';
    }

    function renderTasks(newTasks = tasks) {
        taskList.innerHTML = '';

        newTasks.forEach((task, index) => {
            const li = document.createElement('li');

            li.innerHTML = `
                <span>${task.text}</span>
                <div>
                    <button class="complete-button">${task.completed ? "Undo" : "Complete"}</button>
                    <button class="edit-button">edit</button>
                    <button class="delete-button">delete</button>
                </div>
            `;
            li.className = `task-item ${task.completed ? 'completed' : ''}`;

            const deleteButton = li.querySelector(".delete-button");
            const editButton = li.querySelector(".edit-button");
            const completeButton = li.querySelector(".complete-button");

            deleteButton.addEventListener('click', () => deleteTask(index));
            editButton.addEventListener('click', () => editTask(li, index, task.text));
            completeButton.addEventListener('click', () => completeTask(index));

            taskList.appendChild(li);
        });
    }

    function deleteTask(index) {
        axios.post(`${baseURL}/delete-task`, {
            taskIndex: index
        })
        .then((res) => {
            tasks = res.data;
            renderTasks(tasks);
        }).catch((err) => {
            console.log(err);
        });
    }

    function editTask(li, index, text) {
        const span = li.firstElementChild;

        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        input.focus();
        li.replaceChild(input, span);

        input.addEventListener('blur', () => {
            axios.post(`${baseURL}/edit-task`, {
                text: input.value.trim(),
                index: index
            })
            .then((res) => {
                tasks = res.data;
                renderTasks(tasks);
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    function completeTask(index) {
        axios.post(`${baseURL}/complete-task`, {
            index: index
        })
        .then((res) => {
            tasks = res.data;
            renderTasks(tasks);
        }).catch((err) => {
            console.log(err);
        });
    }

    document.querySelector('.filter-buttons').addEventListener('click', (event) => {
        const id = event.target.getAttribute('id');
        const status = id.split('-').pop();

        filterButtons.forEach((item) => {
            const itemId = item.id.split('-').pop();
            item.classList.toggle('active', itemId === status);
        });

        axios.post(`${baseURL}/filter-task`, {
            status: status
        })
        .then((res) => {
            renderTasks(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    });

    clearCompletedButton.addEventListener('click', () => {
        axios.get(`${baseURL}/clear-completed-task`)
        .then((res) => {
            tasks = res.data;
            renderTasks(tasks);
        }).catch((err) => {
            console.log(err);
        });
    });

    function getTasks() {
        axios.get(`${baseURL}/tasks`)
        .then((res) => {
            tasks = res.data;
        }).then(() => {
            renderTasks();
        }).catch((err) => {
            console.error(err);
        });
    }

    getTasks();
});
