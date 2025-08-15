document.addEventListener("DOMContentLoaded", function() {
    const sortSelect = document.getElementById("sortSelect");
    const activeTasksList = document.getElementById("activeTasks");

    sortSelect.addEventListener("change", function() {
        const sortBy = sortSelect.value;
        const tasks = Array.from(activeTasksList.querySelectorAll("li"));

        tasks.sort((a, b) => {
            let aValue, bValue;
            if(sortBy === "category"){
                aValue = a.dataset.category.toLowerCase();
                bValue = b.dataset.category.toLowerCase();
            } else if(sortBy === "priority"){
                aValue = parseInt(a.dataset.priority);
                bValue = parseInt(b.dataset.priority);
            } else if(sortBy === "date_created"){
                aValue = new Date(a.dataset.dateCreated);
                bValue = new Date(b.dataset.dateCreated);
            }
            return aValue > bValue ? 1 :aValue < bValue ? -1 :0;
        });

        tasks.forEach(task => activeTasksList.appendChild(task));
    });
});