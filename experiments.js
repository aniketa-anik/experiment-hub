(function () {
  const PENDING_EDIT_KEY = "eh_pending_edit_id";
  const PENDING_TAB_KEY = "eh_pending_tab";

  const allList = document.getElementById("allList");
  const emptyAll = document.getElementById("emptyAll");
  const searchInput = document.getElementById("allSearch");

  function refreshAll() {
    const allExperiments = getExperiments();
    const query = searchInput.value;

    const filtered = sortExperimentsByRecency(filterExperiments(allExperiments, query));

    renderList(allList, emptyAll, filtered, { actionMode: "workspace" });
  }

  allList.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const actionBtn = target.closest("button[data-action]");
    if (!actionBtn) return;

    const row = actionBtn.closest("li[data-id]");
    if (!row) return;

    const id = Number(row.dataset.id);
    if (Number.isNaN(id)) return;

    const action = actionBtn.getAttribute("data-action");
    const tab = action === "analyze" ? "analytics" : "configuration";

    localStorage.setItem(PENDING_EDIT_KEY, String(id));
    localStorage.setItem(PENDING_TAB_KEY, tab);
    window.location.href = "index.html";
  });

  searchInput.addEventListener("input", refreshAll);

  refreshAll();
})();
