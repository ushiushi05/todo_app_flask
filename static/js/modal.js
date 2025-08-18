const modal = document.getElementById("editModal");
const closeModal = document.getElementById("closeModal");
const editForm = document.getElementById("editForm");

document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
        console.log("Edit button clicked");
        const tr = e.target.closest("tr");
        console.log("Row data:", tr.dataset);
        document.getElementById("modalTaskId").value = tr.dataset.id;
        document.getElementById("modalTask").value = tr.dataset.task;
        document.getElementById("modalCategory").value = tr.dataset.category;
        document.getElementById("modalPriority").value = tr.dataset.priority;
        modal.style.display = "block";
    });
});

closeModal.onclick = () => { modal.style.display = "none"; }
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; }

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const taskId = document.getElementById("modalTaskId").value;
    const task = document.getElementById("modalTask").value;
    const category = document.getElementById("modalCategory").value;
    const priority = document.getElementById("modalPriority").value;

    try {
        const response = await fetch(`/update/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ task: task, category, priority })
        });

        if (!response.ok) {
            throw new Error("サーバーエラー：" + response.status);
        }

        const updated = await response.json();
        console.log("Updated task:", updated);

        const tr = document.querySelector(`#task-${updated.id}`);
        if (tr) {
            // 作成日
            const date = new Date(updated.date_created);
            const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            tr.querySelector(`#task-${updated.id} .date_created`).textContent = formattedDate;

            // 他の項目
            tr.querySelector(`#task-${updated.id} .task`).textContent = updated.task;
            tr.querySelector(`#task-${updated.id} .category`).textContent = updated.category;
            tr.querySelector(`#task-${updated.id} .priority`).textContent = updated.priority == 1 ? "高" : updated.priority == 2 ? "中" : "低";

            // dataset も更新
            tr.dataset.task = updated.task;
            tr.dataset.category = updated.category;
            tr.dataset.priority = updated.priority;
            tr.dataset.created = updated.date_created;
        }

        modal.style.display = "none";
    } catch (error) {
        console.log(error);
        alert("タスクの更新に失敗しました。");
    }

});