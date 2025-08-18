const toggleBtn = document.getElementById("taskComp");
const completedTable = document.getElementById("compTable");

toggleBtn.addEventListener("click", () => {
  if (completedTable.style.display === "none") {
    completedTable.style.display = "table";  // 表示
    toggleBtn.textContent = "完了タスク ▲";
  } else {
    completedTable.style.display = "none";   // 非表示
    toggleBtn.textContent = "完了タスク ▼";
  }
});
