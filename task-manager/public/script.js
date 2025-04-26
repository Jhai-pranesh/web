document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    
    // Load tasks when page loads
    fetchTasks();
    
    // Add task events
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Fetch all tasks from server
    async function fetchTasks() {
        try {
            const response = await fetch('/api/tasks');
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }
    
    // Add a new task
    async function addTask() {
        const text = taskInput.value.trim();
        if (!text) return;
        
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });
            const newTask = await response.json();
            renderTask(newTask);
            taskInput.value = '';
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }
    
    // Toggle task status
    async function toggleTaskStatus(id, currentStatus) {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });
            fetchTasks(); // Refresh the list
        } catch (error) {
            console.error('Error updating task:', error);
        }
    }
    
    // Delete a task
    async function deleteTask(id) {
        try {
            await fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
            fetchTasks(); // Refresh the list
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }
    
    // Render all tasks
    function renderTasks(tasks) {
        taskList.innerHTML = '';
        tasks.forEach(renderTask);
    }
    
    // Render a single task
    function renderTask(task) {
        const li = document.createElement('li');
        
        const taskText = document.createElement('span');
        taskText.textContent = task.text;
        li.appendChild(taskText);
        
        const statusBtn = document.createElement('button');
        statusBtn.textContent = task.status === 'pending' ? 'Not Completed' : 'Completed';
        statusBtn.onclick = () => toggleTaskStatus(task.id, task.status);
        li.appendChild(statusBtn);
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Delete';
        removeBtn.onclick = () => deleteTask(task.id);
        li.appendChild(removeBtn);
        
        taskList.appendChild(li);
    }
});