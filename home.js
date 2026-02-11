(function () {
  const recentList = document.getElementById("recentList");
  const emptyRecent = document.getElementById("emptyRecent");
  const searchInput = document.getElementById("homeSearch");
  const addButton = document.getElementById("addExperimentBtn");

  function refreshHome() {
    const allExperiments = getExperiments();
    const query = searchInput.value;

    const filtered = filterExperiments(allExperiments, query)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 5);

    renderList(recentList, emptyRecent, filtered);
  }

  addButton.addEventListener("click", () => {
    const name = prompt("Experiment name:");
    if (!name) return;

    const owner = prompt("Owner name:") || "Unassigned";
    const status = prompt("Status (Running, Planned, Completed):", "Planned") || "Planned";

    const experiments = getExperiments();
    experiments.unshift({
      id: Date.now(),
      name: name.trim(),
      owner: owner.trim(),
      status: status.trim(),
      updatedAt: new Date().toISOString().slice(0, 10)
    });

    saveExperiments(experiments);
    refreshHome();
  });

  searchInput.addEventListener("input", refreshHome);

  refreshHome();
})();
