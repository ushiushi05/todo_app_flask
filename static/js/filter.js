document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        document.querySelectorAll("tbody tr").forEach(row => {
            const rowCategory = row.querySelector(".category").textContent.trim();
            if (category === "all" || rowCategory === category) {
                row.style.display = ""; // 表示
            } else {
                row.style.display = "none"; // 非表示
            }
        });
    });
});
