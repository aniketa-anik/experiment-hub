(function () {
  const SESSION_USER_KEY = "eh_session_user";
  const PENDING_EDIT_KEY = "eh_pending_edit_id";
  const PENDING_TAB_KEY = "eh_pending_tab";
  const SUPABASE_URL = "https://suisykxbxpmlpxofqtvf.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_0iT8k5evUPJV9pjXZfLgEQ_53Ljvnx8";
  const SUPABASE_EXPERIMENTS_SCHEMA = "abx";
  const SUPABASE_EXPERIMENTS_TABLE = "experiments";
  const SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE = "experiment_assignments";
  const SUPABASE_EXPERIMENT_EXPOSURES_TABLE = "experiment_exposures";
  const SUPABASE_EXPERIMENT_COHORT_DAILY_TABLE = "experiment_cohort_daily";
  const SUPABASE_FEATURES_TABLE = "ab_features";
  const supabaseClient =
    typeof window.supabase !== "undefined" && window.supabase && typeof window.supabase.createClient === "function"
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

  const allList = document.getElementById("allList");
  const emptyAll = document.getElementById("emptyAll");
  const searchInput = document.getElementById("allSearch");

  function isAdminSession() {
    try {
      const sessionUser = JSON.parse(localStorage.getItem(SESSION_USER_KEY) || "{}");
      return sessionUser && sessionUser.role === "admin";
    } catch (_error) {
      return false;
    }
  }

  function refreshAll() {
    const allExperiments = getExperiments();
    const query = searchInput.value;

    const filtered = sortExperimentsByRecency(filterExperiments(allExperiments, query));

    renderList(allList, emptyAll, filtered, { actionMode: "workspace", canDelete: isAdminSession() });
  }

  function hasActiveFiltersLocal(filters) {
    if (Array.isArray(filters)) {
      return filters.some((rule) => String((rule && (rule.attribute || rule.param_key || rule.field)) || "").trim() !== "");
    }
    if (filters && typeof filters === "object" && Array.isArray(filters.groups)) {
      return filters.groups.some((group) =>
        Array.isArray(group && group.conditions) &&
        group.conditions.some((rule) => String((rule && (rule.attribute || rule.param_key || rule.field)) || "").trim() !== "")
      );
    }
    return false;
  }

  async function syncExperimentsFromSupabase() {
    if (!supabaseClient) return;
    const existingById = new Map(getExperiments().map((experiment) => [Number(experiment.id), experiment]));

    const { data: features, error: featuresError } = await supabaseClient.from(SUPABASE_FEATURES_TABLE).select("display_name,feature_key");
    if (featuresError) {
      console.error("Unable to load features for experiments page", featuresError);
      return;
    }

    const featureNameByKey = new Map();
    (Array.isArray(features) ? features : []).forEach((row) => {
      const key = String((row && row.feature_key) || "").trim();
      const name = String((row && row.display_name) || "").trim();
      if (key && name && !featureNameByKey.has(key)) {
        featureNameByKey.set(key, name);
      }
    });

    const { data, error } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENTS_TABLE)
      .select("experiment_id,experiment_name,feature_key,status,rollout_percent,created_by,updated_at,created_at,applied_filters")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Unable to load experiments from Supabase", error);
      return;
    }

    const mapped = (Array.isArray(data) ? data : []).map((row) => {
      const updatedAtRaw = row.updated_at || row.created_at || new Date().toISOString();
      const updatedAtTs = new Date(updatedAtRaw).getTime();
      const safeUpdatedTs = Number.isNaN(updatedAtTs) ? Date.now() : updatedAtTs;
      const displayFeatureName = featureNameByKey.get(String(row.feature_key || "").trim()) || String(row.feature_key || "");
      const experimentId = Number(row.experiment_id);
      const incomingFilters = row.applied_filters || [];
      const existingExperiment = existingById.get(experimentId);
      const existingFilters = existingExperiment && existingExperiment.config ? existingExperiment.config.filters : [];
      const mergedFilters =
        !hasActiveFiltersLocal(incomingFilters) && hasActiveFiltersLocal(existingFilters)
          ? existingFilters
          : incomingFilters;

      return {
        id: experimentId,
        name: String(row.experiment_name || "Untitled Experiment"),
        owner: String(row.created_by || "System"),
        lastEditedBy: String(row.created_by || ""),
        status: String(row.status || "Saved"),
        updatedAt: new Date(safeUpdatedTs).toISOString().slice(0, 10),
        updatedAtTs: safeUpdatedTs,
        lastModifiedAt: new Date(safeUpdatedTs).toISOString(),
        config: {
          featureName: displayFeatureName,
          rollout: Number(row.rollout_percent || 0),
          scheduleAt: "",
          filters: mergedFilters
        }
      };
    });

    saveExperiments(mapped);
  }

  async function deleteExperimentById(experimentId) {
    if (!isAdminSession()) {
      alert("Only admins can delete experiments.");
      return;
    }

    const experiments = getExperiments();
    const target = experiments.find((item) => Number(item.id) === Number(experimentId));
    if (!target) return;

    const shouldDelete = window.confirm(`Delete experiment "${target.name}"? This action cannot be undone.`);
    if (!shouldDelete) return;

    if (supabaseClient) {
      const dependentTables = [
        SUPABASE_EXPERIMENT_COHORT_DAILY_TABLE,
        SUPABASE_EXPERIMENT_EXPOSURES_TABLE,
        SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE
      ];

      try {
        for (const tableName of dependentTables) {
          const { error } = await supabaseClient
            .schema(SUPABASE_EXPERIMENTS_SCHEMA)
            .from(tableName)
            .delete()
            .eq("experiment_id", experimentId);
          if (error) throw error;
        }

        const { error: experimentDeleteError } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENTS_TABLE)
          .delete()
          .eq("experiment_id", experimentId);
        if (experimentDeleteError) throw experimentDeleteError;
      } catch (error) {
        alert(`Unable to delete experiment: ${error.message || "Unknown error"}`);
        return;
      }
    }

    const updatedExperiments = experiments.filter((item) => Number(item.id) !== Number(experimentId));
    saveExperiments(updatedExperiments);
    refreshAll();
  }

  allList.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const actionBtn = target.closest("button[data-action]");
    if (!actionBtn) return;

    const row = actionBtn.closest("li[data-id]");
    if (!row) return;

    const id = Number(row.dataset.id);
    if (Number.isNaN(id)) return;

    const action = actionBtn.getAttribute("data-action");
    if (action === "delete") {
      await deleteExperimentById(id);
      return;
    }
    const tab = action === "analyze" ? "analytics" : "configuration";

    localStorage.setItem(PENDING_EDIT_KEY, String(id));
    localStorage.setItem(PENDING_TAB_KEY, tab);
    window.location.href = "index.html";
  });

  searchInput.addEventListener("input", refreshAll);

  syncExperimentsFromSupabase().finally(refreshAll);
})();
