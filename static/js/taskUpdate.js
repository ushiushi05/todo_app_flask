document.addEventListener("click", async (e) => {
    // 完了ボタン
    if (e.target.classList.contains("btn-comp")) {
        e.preventDefault();
        const tr = e.target.closest("tr");
        const taskId = tr.dataset.id;

        try {
            const response = await fetch(`/toggle/${taskId}`, { method: "POST" });
            const data = await response.json();
            console.log("Response data:", data);
            if (data.tr_html && data.target_table_id) {
                // 行を削除
                tr.remove();

                // 変更後のテーブルに行を追加
                const targetTable = document.querySelector(`#${data.target_table_id} tbody`);
                targetTable.insertAdjacentHTML("beforeend", data.tr_html);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // 未完了に戻すボタン
    if (e.target.classList.contains("btn-back")) {
        e.preventDefault();
        const tr = e.target.closest("tr");
        const taskId = tr.dataset.id;

        try {
            const response = await fetch(`/toggle/${taskId}`, { method: "POST" });
            const data = await response.json();
            if (data.tr_html && data.target_table_id) {
                tr.remove();
                const targetTable = document.querySelector(`#${data.target_table_id} tbody`);
                targetTable.insertAdjacentHTML("beforeend", data.tr_html);
            }
        } catch (err) {
            console.error(err);
        }
    }

    // 削除ボタン
    if (e.target.classList.contains("btn-del")){
        e.preventDefault();
        if (!confirm("本当に削除しますか？")) return;
        const url = e.target.href;
        const tr = e.target.closest("tr");

        try {
            const response = await fetch(url, { method: "POST" });
            if (!response.ok) throw new Error("削除失敗");
            tr.remove();
        } catch (err) {
            alert(err);
        }
    }
});



