const table = document.getElementById("todoTable");
const tbody = table.querySelector("tbody");
let sortDirction = {};

table.querySelectorAll("th").forEach(th => {
    th.addEventListener("click", () => {
        const sortKey = th.dataset.sort;
        if(!sortKey) return;

        sortDirction[sortKey] = !sortDirction[sortKey];
        const direction = sortDirction[sortKey] ? "asc" : "desc";

        const rows = Array.from(tbody.querySelectorAll("tr"));
        rows.sort((a, b) => {
            let aValue, bValue;

            switch (sortKey) {
                case "category":
                case "task":
                    aValue = a.dataset.category.toLowerCase();
                    bValue = b.dataset.category.toLowerCase();
                    return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                case "priority":
                    aValue = parseInt(a.dataset.priority);
                    bValue = parseInt(b.dataset.priority);
                    return direction === "asc" ? aValue - bValue : bValue - aValue;
                case "created":
                    aValue = new Date(a.dataset.created).getTime();
                    bValue = new Date(b.dataset.created).getTime();
                    return direction === "asc" ? aValue - bValue : bValue - aValue;
                default:
                    return 0;
            }
        });
        rows.forEach(row => tbody.appendChild(row)); // Reorder rows in the table
    });
});