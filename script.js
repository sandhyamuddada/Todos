let todoItemsContainer = document.getElementById("todoItemsContainer");
        let addTodoButton = document.getElementById("addTodoButton");
        let saveTodoButton = document.getElementById("saveTodoButton");
        let clearCompletedButton = document.getElementById("clearCompletedButton");
        let dateEl = document.getElementById("dateId");
        let todoList = getTodoListFromLocalStorage();
        let todosCount = todoList.length;

        function getTodoListFromLocalStorage() {
            let stringifiedTodoList = localStorage.getItem("todoList");
            return JSON.parse(stringifiedTodoList) || [];
        }

        function saveTasks() {
            localStorage.setItem("todoList", JSON.stringify(todoList));
            updateStats();
        }

        function updateStats() {
            const total = todoList.length;
            const completed = todoList.filter(todo => todo.isChecked).length;
            document.getElementById("stats").textContent = `Total: ${total} | Completed: ${completed}`;
        }

        function isOverdue(dateText) {
            if (!dateText) return false;
            const today = new Date().toISOString().split('T')[0];
            return dateText < today;
        }

        function createAndAppendTodo(todo) {
            let todoId = "todo" + todo.uniqueNo;
            let checkboxId = "checkbox" + todo.uniqueNo;
            let labelId = "label" + todo.uniqueNo;

            let todoElement = document.createElement("li");
            todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
            if (todo.isChecked) todoElement.classList.add("completed");
            todoElement.id = todoId;
            todoItemsContainer.appendChild(todoElement);

            let inputElement = document.createElement("input");
            inputElement.type = "checkbox";
            inputElement.id = checkboxId;
            inputElement.checked = todo.isChecked;
            inputElement.classList.add("checkbox-input");
            inputElement.onclick = () => onTodoStatusChange(checkboxId, labelId, todoId);
            todoElement.appendChild(inputElement);

            let labelContainer = document.createElement("div");
            labelContainer.classList.add("label-container", "d-flex", "flex-row", "align-items-center");
            todoElement.appendChild(labelContainer);

            let labelElement = document.createElement("label");
            labelElement.setAttribute("for", checkboxId);
            labelElement.id = labelId;
            labelElement.classList.add("checkbox-label");
            if (todo.isChecked) labelElement.classList.add("checked");
            labelElement.textContent = todo.text;
            labelContainer.appendChild(labelElement);

            let dateElement = document.createElement("p");
            dateElement.textContent = todo.dateText || "No due date";
            dateElement.classList.add("datePara");
            if (isOverdue(todo.dateText) && !todo.isChecked) dateElement.classList.add("overdue");
            labelContainer.appendChild(dateElement);

            let categoryElement = document.createElement("span");
            categoryElement.textContent = `[${todo.category || 'None'}]`;
            categoryElement.classList.add("category");
            labelContainer.appendChild(categoryElement);

            let deleteIconContainer = document.createElement("div");
            deleteIconContainer.classList.add("delete-icon-container");
            labelContainer.appendChild(deleteIconContainer);

            let deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fas", "fa-trash-alt", "delete-icon");
            deleteIcon.onclick = () => onDeleteTodo(todoId);
            deleteIconContainer.appendChild(deleteIcon);
        }

        function renderTasks(filter = 'All') {
            todoItemsContainer.innerHTML = '';
            let filteredTasks = todoList;

            if (filter !== 'All') {
                filteredTasks = todoList.filter(todo => {
                    if (filter === 'Completed') return todo.isChecked;
                    if (filter === 'Pending') return !todo.isChecked;
                    return todo.category === filter;
                });
            }

            filteredTasks.forEach(todo => createAndAppendTodo(todo));
            updateStats();
        }

        function onAddTodo() {
            let userInputElement = document.getElementById("todoUserInput");
            let userInputValue = userInputElement.value.trim();
            let dateValue = dateEl.value;
            let categoryValue = document.getElementById("categorySelect").value;

            if (userInputValue === "") {
                alert("Please enter a task!");
                return;
            }

            todosCount++;
            let newTodo = {
                text: userInputValue,
                dateText: dateValue,
                category: categoryValue,
                uniqueNo: todosCount,
                isChecked: false
            };
            todoList.push(newTodo);
            saveTasks();
            renderTasks(document.getElementById("filterSelect").value);
            userInputElement.value = "";
            dateEl.value = "";
        }

        function onTodoStatusChange(checkboxId, labelId, todoId) {
            let checkboxElement = document.getElementById(checkboxId);
            let labelElement = document.getElementById(labelId);
            labelElement.classList.toggle("checked");

            let todoIndex = todoList.findIndex(todo => "todo" + todo.uniqueNo === todoId);
            if (todoIndex !== -1) {
                todoList[todoIndex].isChecked = checkboxElement.checked;
                saveTasks();
                renderTasks(document.getElementById("filterSelect").value);
            }
        }

        function onDeleteTodo(todoId) {
            let todoIndex = todoList.findIndex(todo => "todo" + todo.uniqueNo === todoId);
            if (todoIndex !== -1) {
                todoList.splice(todoIndex, 1);
                saveTasks();
                renderTasks(document.getElementById("filterSelect").value);
            }
        }

        function clearCompleted() {
            todoList = todoList.filter(todo => !todo.isChecked);
            saveTasks();
            renderTasks(document.getElementById("filterSelect").value);
        }

        function filterTasks() {
            renderTasks(document.getElementById("filterSelect").value);
        }

        // Event Listeners
        addTodoButton.onclick = onAddTodo;
        saveTodoButton.onclick = saveTasks;
        clearCompletedButton.onclick = clearCompleted;

        // Enter key support
        document.getElementById("todoUserInput").addEventListener("keypress", (event) => {
            if (event.key === "Enter") onAddTodo();
        });

        // Initial render
        renderTasks();
