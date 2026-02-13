(function () {
  const SESSION_KEY = "eh_session";
  const SESSION_USER_KEY = "eh_session_user";
  const PENDING_EDIT_KEY = "eh_pending_edit_id";
  const PENDING_TAB_KEY = "eh_pending_tab";
  const LAST_VIEW_KEY = "eh_last_view";
  const LAST_TAB_KEY = "eh_last_tab";
  const LAST_EXPERIMENT_ID_KEY = "eh_last_experiment_id";
  const FILTER_DEBUG_ONCE_KEY = "eh_filter_debug_once";
  const FILTER_DEFINITIONS_KEY = "eh_filter_definitions";
  const USERS_KEY = "ab_platform_users";
  const SUPABASE_URL = "https://suisykxbxpmlpxofqtvf.supabase.co";
  const SUPABASE_ANON_KEY = "sb_publishable_0iT8k5evUPJV9pjXZfLgEQ_53Ljvnx8";
  const SUPABASE_FEATURES_TABLE = "ab_features";
  const SUPABASE_SEGMENT_PARAMS_TABLE = "ab_segment_params";
  const SUPABASE_USER_FEATURES_TABLE = "ab_user_features";
  const SUPABASE_USER_PROFILES_TABLE = "user_profiles";
  const SUPABASE_ONBOARDING_TABLE = "onboarding";
  const SUPABASE_USER_INTERACTION_TABLE = "user_card_interaction";
  const SUPABASE_EXPERIMENTS_SCHEMA = "abx";
  const SUPABASE_EXPERIMENTS_TABLE = "experiments";
  const SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE = "experiment_assignments";
  const SUPABASE_EXPERIMENT_EXPOSURES_TABLE = "experiment_exposures";
  const SUPABASE_EXPERIMENT_COHORT_DAILY_TABLE = "experiment_cohort_daily";
  const ANALYTICS_CACHE_TTL_MS = 60 * 1000;

  const OPERATORS = ["is", "is not", "contains", "does not contain", "starts with", "ends with", "greater than", "less than", "exists"];
  const METRIC_VIEWS = {
    signup_success_rate: { label: "Sign-up Success Rate" },
    day1_day7_retention: { label: "Day 1 to Day 7 Retention" },
    conversion_rate: { label: "Conversion Rate" }
  };

  const DEFAULT_FILTER_DEFINITIONS = [
    { name: "User Type", type: "dropdown", values: ["1", "2", "3", "4", "ALL"] },
    { name: "User Status", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "TMX Flag", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "Class Flag", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "Content Flag", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "Current ACAD Stage", type: "dropdown", values: ["School", "College", "Exam Prep", "Other", "ALL"] },
    { name: "Trial Paid", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "Mandate Paid", type: "dropdown", values: ["0", "1", "ALL"] },
    { name: "User ID", type: "text", values: [] },
    { name: "Email ID", type: "text", values: [] },
    { name: "Mobile Number", type: "text", values: [] },
    { name: "Created Date", type: "date", values: [] }
  ];

  const loginView = document.getElementById("login-page");
  const signupView = document.getElementById("signup-page");
  const dashboardView = document.getElementById("dashboardView");
  const profileView = document.getElementById("profileView");
  const experimentFormView = document.getElementById("experiment-form-page");
  const globalBackBtn = document.getElementById("globalBackBtn");

  const authForm = document.getElementById("authForm");
  const authMessage = document.getElementById("formMessage");
  const authPasswordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const openSignupBtn = document.getElementById("openSignupBtn");

  const signupForm = document.getElementById("signupForm");
  const signupFullNameInput = document.getElementById("signupFullName");
  const signupEmailInput = document.getElementById("signupEmail");
  const signupRoleInput = document.getElementById("signupRole");
  const signupTeamInput = document.getElementById("signupTeam");
  const signupPasswordInput = document.getElementById("signupPassword");
  const signupConfirmPasswordInput = document.getElementById("signupConfirmPassword");
  const signupMessage = document.getElementById("signupMessage");
  const toggleSignupPassword = document.getElementById("toggleSignupPassword");
  const toggleSignupConfirmPassword = document.getElementById("toggleSignupConfirmPassword");
  const openLoginBtn = document.getElementById("openLoginBtn");

  const nameFields = document.getElementById("nameFields");
  const companyField = document.getElementById("companyField");
  const termsRow = document.getElementById("termsRow");

  const profileBtn = document.getElementById("profileBtn");
  const profileBackBtn = document.getElementById("profileBackBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const profileLogoutBtn = document.getElementById("profileLogoutBtn");
  const navHomeButtons = Array.from(document.querySelectorAll('[data-nav-action="home"]'));
  const navBackButtons = Array.from(document.querySelectorAll('[data-nav-action="back"]'));
  const navProfileButtons = Array.from(document.querySelectorAll('[data-nav-action="profile"]'));
  const navLogoutButtons = Array.from(document.querySelectorAll('[data-nav-action="logout"]'));
  const backToDashboardBtn = document.getElementById("backToDashboardBtn");

  const recentList = document.getElementById("recentList");
  const emptyRecent = document.getElementById("emptyRecent");
  const homeSearch = document.getElementById("homeSearch");
  const addExperimentBtn = document.getElementById("addExperimentBtn");
  const seeAllExperimentsWrap = document.getElementById("seeAllExperimentsWrap");

  const workspaceTabs = Array.from(document.querySelectorAll(".workspace-tab"));
  const workspaceConfigurationPanel = document.getElementById("workspaceConfigurationPanel");
  const workspaceAnalyticsPanel = document.getElementById("workspaceAnalyticsPanel");
  const workspaceHistoryPanel = document.getElementById("workspaceHistoryPanel");

  const configForm = document.getElementById("experimentConfigForm");
  const configBackBtn = document.getElementById("configBackBtn");
  const configTitleMode = document.getElementById("configTitleMode");
  const rolloutControl = document.getElementById("rolloutControl");
  const rolloutValue = document.getElementById("rolloutValue");
  const scheduleBtn = document.getElementById("scheduleBtn");
  const scheduleWrap = document.getElementById("scheduleWrap");
  const configCloseBtn = document.getElementById("configCloseBtn");
  const saveDraftBtn = document.getElementById("saveDraftBtn");
  const publishExperimentBtn = document.getElementById("publishExperimentBtn");
  const pauseResumeBtn = document.getElementById("pauseResumeBtn");
  const viewCountBtn = document.getElementById("viewCountBtn");
  const countSpinner = document.getElementById("countSpinner");
  const audienceCountLabel = document.getElementById("audienceCountLabel");
  const testBtn = document.getElementById("testBtn");
  const testTargetType = document.getElementById("testTargetType");
  const testUserIdInput = document.getElementById("testUserIdInput");
  const testMessage = document.getElementById("testMessage");
  const addFilterRuleBtn = document.getElementById("addFilterRuleBtn");
  const filterRulesContainer = document.getElementById("filterRulesContainer");
  const filterDebugPanel = document.getElementById("filterDebugPanel");
  const workspaceSwitcherToggle = document.getElementById("workspaceSwitcherToggle");
  const workspaceSwitcherLabel = document.getElementById("workspaceSwitcherLabel");
  const workspaceSwitcherPanel = document.getElementById("workspaceSwitcherPanel");
  const workspaceSwitcherClose = document.getElementById("workspaceSwitcherClose");
  const workspaceSwitcherSearch = document.getElementById("workspaceSwitcherSearch");
  const workspaceSwitcherList = document.getElementById("workspaceSwitcherList");
  const unsavedSwitchModal = document.getElementById("unsavedSwitchModal");
  const unsavedCancelBtn = document.getElementById("unsavedCancelBtn");
  const unsavedSaveDraftBtn = document.getElementById("unsavedSaveDraftBtn");

  const metadataModal = document.getElementById("metadataModal");
  const closeMetadataBtn = document.getElementById("closeMetadataBtn");
  const metadataForm = document.getElementById("metadataForm");
  const metaFieldName = document.getElementById("metaFieldName");
  const metaDataType = document.getElementById("metaDataType");
  const metaAllowedValues = document.getElementById("metaAllowedValues");
  const metadataList = document.getElementById("metadataList");

  const analyticsExperimentName = document.getElementById("analyticsExperimentName");
  const analyticsFeatureName = document.getElementById("analyticsFeatureName");
  const analyticsStatusBadge = document.getElementById("analyticsStatusBadge");
  const analyticsRollout = document.getElementById("analyticsRollout");
  const downloadAnalyticsPdfBtn = document.getElementById("downloadAnalyticsPdfBtn");
  const analyticsEmptyState = document.getElementById("analyticsEmptyState");
  const analyticsDataSections = document.getElementById("analyticsDataSections");

  const kpiLift = document.getElementById("kpiLift");
  const kpiSignificance = document.getElementById("kpiSignificance");
  const kpiUsers = document.getElementById("kpiUsers");
  const kpiGuardrails = document.getElementById("kpiGuardrails");
  const kpiRecommendation = document.getElementById("kpiRecommendation");

  const analyticsMetricSelect = document.getElementById("analyticsMetricSelect");
  const analyticsFormatSelect = document.getElementById("analyticsFormatSelect");
  const trendChartCanvas = document.getElementById("analyticsTrendChart");
  const analyticsChartCard = document.getElementById("analyticsChartCard");
  const analyticsTablesCard = document.getElementById("analyticsTablesCard");
  const analyticsChartTitle = document.getElementById("analyticsChartTitle");
  const analyticsTableTitle = document.getElementById("analyticsTableTitle");
  const deltaCohortBody = document.getElementById("deltaCohortBody");
  const controlCohortBody = document.getElementById("controlCohortBody");
  const testCohortBody = document.getElementById("testCohortBody");
  const analyticsNoData = document.getElementById("analyticsNoData");
  const historyTimeline = document.getElementById("historyTimeline");
  const historyEmpty = document.getElementById("historyEmpty");
  const profileNameEl = document.getElementById("profileName");
  const profileRoleEl = document.getElementById("profileRole");
  const profileTeamEl = document.getElementById("profileTeam");
  const profileEmailEl = document.getElementById("profileEmail");
  const profileExperimentsRunEl = document.getElementById("profileExperimentsRun");
  const profileActiveTestsEl = document.getElementById("profileActiveTests");
  const appToast = document.getElementById("appToast");

  let currentUser = null;
  let editingExperimentId = null;
  let editingExperimentStatus = null;
  let canDeleteExperimentsInDb = null;
  let currentWorkspaceTab = "configuration";
  let filterDefinitions = loadFilterDefinitions();
  let currentAnalyticsData = null;
  let trendChart = null;
  let isWorkspaceSwitcherOpen = false;
  let workspaceFormBaseline = "";
  let unsavedSwitchResolver = null;
  const viewHistoryStack = [];
  const analyticsCache = new Map();
  const featureKeyByDisplayName = new Map();
  const featureDisplayNameByKey = new Map();
  const supabaseClient =
    typeof window.supabase !== "undefined" && window.supabase && typeof window.supabase.createClient === "function"
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

  function normalizeErrorMessage(error, fallbackText) {
    if (!error) return fallbackText || "Unknown error";
    if (typeof error === "string") return error;
    if (typeof error === "object" && error.message) return String(error.message);
    try {
      return JSON.stringify(error);
    } catch (_e) {
      return fallbackText || "Unknown error";
    }
  }

  function showToast(message, type) {
    if (!appToast) {
      if (type === "error") alert(message);
      return;
    }
    appToast.textContent = String(message || "");
    appToast.classList.remove("is-success", "is-error", "is-visible");
    appToast.classList.add(type === "success" ? "is-success" : "is-error");
    // Force reflow so repeated messages can animate consistently.
    void appToast.offsetWidth;
    appToast.classList.add("is-visible");
    window.setTimeout(() => {
      appToast.classList.remove("is-visible");
    }, 3200);
  }

  async function withButtonLoading(button, loadingText, callback) {
    if (!button || typeof callback !== "function") return callback ? callback() : undefined;
    const originalText = button.textContent;
    button.disabled = true;
    if (loadingText) button.textContent = loadingText;
    try {
      return await callback();
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function sanitizeExperimentPayload(payload) {
    const name = String((payload && payload.name) || "").trim();
    const featureName = String((payload && payload.featureName) || "").trim();
    const rollout = Number((payload && payload.rollout) || 0);
    const safeRollout = Number.isNaN(rollout) ? 0 : Math.max(0, Math.min(100, Math.round(rollout)));
    const scheduleAt = String((payload && payload.scheduleAt) || "").trim();
    const filters = payload && payload.filters ? payload.filters : readFilterRules();

    return {
      name,
      featureName,
      rollout: safeRollout,
      scheduleAt,
      filters
    };
  }

  async function fetchSupabaseRest(pathAndQuery, fallbackText) {
    const endpoint = `${SUPABASE_URL}/rest/v1/${pathAndQuery}`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    if (!response.ok) {
      throw new Error(`${fallbackText || "Request failed"} (${response.status})`);
    }
    return response.json();
  }

  function getActiveViewName() {
    if (loginView && loginView.style.display === "block") return "login";
    if (signupView && signupView.style.display === "block") return "signup";
    if (dashboardView && dashboardView.style.display === "block") return "dashboard";
    if (profileView && profileView.style.display === "block") return "profile";
    if (experimentFormView && experimentFormView.style.display === "block") return "experiment-form";
    return null;
  }

  function getCurrentViewSnapshot() {
    const view = getActiveViewName();
    if (!view) return null;
    return {
      view,
      experimentId: editingExperimentId,
      tab: currentWorkspaceTab
    };
  }

  function updateGlobalBackButton() {
    if (!globalBackBtn) return;
    globalBackBtn.style.display = "none";
  }

  async function navigateFromSnapshot(snapshot) {
    if (!snapshot || !snapshot.view) return;
    if (snapshot.view === "experiment-form") {
      const tab = snapshot.tab || "configuration";
      const id = Number(snapshot.experimentId);
      if (!Number.isNaN(id) && id > 0) {
        await openExperiment(id, tab);
      } else {
        await openExperiment(null, tab);
      }
      return;
    }
    if (snapshot.view === "profile") {
      await renderProfileView();
      showView("profile", { persist: false, skipHistory: true });
      return;
    }
    showView(snapshot.view, { persist: false, skipHistory: true });
  }

  function showView(viewName, options) {
    const persist = !options || options.persist !== false;
    const skipHistory = Boolean(options && options.skipHistory);
    const previousSnapshot = getCurrentViewSnapshot();

    if (!skipHistory && previousSnapshot && previousSnapshot.view !== viewName) {
      viewHistoryStack.push(previousSnapshot);
      if (viewHistoryStack.length > 50) {
        viewHistoryStack.shift();
      }
    }

    loginView.style.display = "none";
    signupView.style.display = "none";
    dashboardView.style.display = "none";
    profileView.style.display = "none";
    experimentFormView.style.display = "none";

    if (viewName === "login") loginView.style.display = "block";
    if (viewName === "signup") signupView.style.display = "block";
    if (viewName === "dashboard") dashboardView.style.display = "block";
    if (viewName === "profile") profileView.style.display = "block";
    if (viewName === "experiment-form") experimentFormView.style.display = "block";

    if (persist) {
      localStorage.setItem(LAST_VIEW_KEY, viewName);
    }

    if (viewName !== "experiment-form") {
      toggleWorkspaceSwitcher(false);
    }

    if (typeof document !== "undefined" && document.body) {
      const hasFixedTopbar = viewName === "dashboard" || viewName === "profile" || viewName === "experiment-form";
      document.body.classList.toggle("has-fixed-topbar", hasFixedTopbar);
    }
    updateGlobalBackButton();
  }

  function getFormSnapshot() {
    if (!configForm) return "";
    const payload = readExperimentPayloadFromForm();
    const normalized = {
      name: String(payload.name || "").trim(),
      featureName: String(payload.featureName || "").trim(),
      rollout: Number(payload.rollout || 0),
      scheduleAt: String(payload.scheduleAt || "").trim(),
      filters: serializeFilterBuilder(payload.filters)
    };
    return JSON.stringify(normalized);
  }

  function markWorkspaceBaseline() {
    workspaceFormBaseline = getFormSnapshot();
  }

  function hasUnsavedWorkspaceChanges() {
    if (!experimentFormView || experimentFormView.style.display !== "block") return false;
    return getFormSnapshot() !== workspaceFormBaseline;
  }

  function openUnsavedSwitchModal() {
    if (!unsavedSwitchModal) return Promise.resolve("discard");
    unsavedSwitchModal.style.display = "flex";
    unsavedSwitchModal.setAttribute("aria-hidden", "false");
    return new Promise((resolve) => {
      unsavedSwitchResolver = resolve;
    });
  }

  function resolveUnsavedSwitch(action) {
    if (unsavedSwitchModal) {
      unsavedSwitchModal.style.display = "none";
      unsavedSwitchModal.setAttribute("aria-hidden", "true");
    }
    if (typeof unsavedSwitchResolver === "function") {
      const resolver = unsavedSwitchResolver;
      unsavedSwitchResolver = null;
      resolver(action);
    }
  }

  function getUserInitials() {
    const base = String((currentUser && (currentUser.fullName || currentUser.name || currentUser.email)) || "").trim();
    if (!base) return "AR";
    const tokens = base
      .replace(/@.*/, "")
      .split(/[\s._-]+/)
      .filter(Boolean);
    if (!tokens.length) return "AR";
    const first = tokens[0].charAt(0) || "";
    const second = (tokens[1] && tokens[1].charAt(0)) || "";
    return `${first}${second}`.toUpperCase() || "AR";
  }

  function syncTopNavProfileChips() {
    const initials = getUserInitials();
    navProfileButtons.forEach((button) => {
      button.textContent = initials;
    });
  }

  function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(SESSION_USER_KEY);
    localStorage.removeItem(PENDING_EDIT_KEY);
    localStorage.removeItem(PENDING_TAB_KEY);
    clearLastViewState();
    currentUser = null;
    viewHistoryStack.length = 0;
    updateRoleUI();
    authForm.reset();
    signupForm.reset();
    authMessage.textContent = "";
    signupMessage.textContent = "";
    syncTopNavProfileChips();
    showView("login");
  }

  async function handleOpenProfile() {
    await renderProfileView();
    showView("profile");
  }

  async function handleTopNavBack() {
    if (experimentFormView && experimentFormView.style.display === "block") {
      await openDashboardView();
      return;
    }
    if (profileView && profileView.style.display === "block") {
      await openDashboardView();
      return;
    }
    await openDashboardView();
  }

  async function handleTopNavHome() {
    await openDashboardView();
  }

  function persistExperimentWorkspaceState(experimentId, tabName) {
    if (typeof tabName === "string" && tabName) {
      localStorage.setItem(LAST_TAB_KEY, tabName);
    }

    if (experimentId === null || typeof experimentId === "undefined") {
      localStorage.removeItem(LAST_EXPERIMENT_ID_KEY);
      return;
    }

    localStorage.setItem(LAST_EXPERIMENT_ID_KEY, String(experimentId));
  }

  function clearLastViewState() {
    localStorage.removeItem(LAST_VIEW_KEY);
    localStorage.removeItem(LAST_TAB_KEY);
    localStorage.removeItem(LAST_EXPERIMENT_ID_KEY);
  }

  function setupLoginUI() {
    const title = document.querySelector(".form-head h1");
    const sub = document.querySelector(".form-head p");
    title.textContent = "Log in to Experiment Hub";
    sub.textContent = "Use your registered credentials.";

    nameFields.style.display = "none";
    companyField.style.display = "none";
    termsRow.style.display = "none";

    document.getElementById("firstName").required = false;
    document.getElementById("lastName").required = false;
    document.getElementById("company").required = false;
    document.getElementById("terms").required = false;
  }

  function initUsersStore() {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return;

    const seed = [{ email: "admin@company.com", password: "1234", role: "admin", fullName: "Admin User", profileRole: "", team: "" }];
    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  }

  function getStoredUsers() {
    initUsersStore();

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (!Array.isArray(users)) return [];
      return users
        .map((user) => ({
          email: String(user.email || "").trim().toLowerCase(),
          password: String(user.password || ""),
          role: user.role === "admin" ? "admin" : "user",
          fullName: String(user.fullName || "").trim(),
          profileRole: String(user.profileRole || "").trim(),
          team: String(user.team || "").trim()
        }))
        .filter((user) => user.email && user.password);
    } catch (_e) {
      return [];
    }
  }

  function saveStoredUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function findUserByEmail(email) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    return getStoredUsers().find((user) => user.email === normalizedEmail) || null;
  }

  function findUserByCredentials(email, password) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    return getStoredUsers().find((user) => user.email === normalizedEmail && user.password === password) || null;
  }

  function getUserDisplayName(email, role, fullName) {
    if (String(fullName || "").trim()) return String(fullName).trim();
    if (role === "admin") return "Admin User";
    const namePart = String(email || "").split("@")[0] || "User";
    const compact = namePart.replace(/[._-]+/g, " ").trim();
    if (!compact) return "Product User";
    return compact
      .split(" ")
      .filter(Boolean)
      .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(" ");
  }

  function setActiveSessionFromUser(user) {
    const sessionUser = {
      email: user.email,
      role: user.role === "admin" ? "admin" : "user",
      name: getUserDisplayName(user.email, user.role, user.fullName),
      fullName: String(user.fullName || "").trim(),
      profileRole: String(user.profileRole || "").trim(),
      team: String(user.team || "").trim(),
      userId: String(user.userId || user.id || "").trim()
    };
    currentUser = sessionUser;
    localStorage.setItem(SESSION_KEY, "active");
    localStorage.setItem(SESSION_USER_KEY, JSON.stringify(sessionUser));
  }

  function loadFilterDefinitions() {
    const raw = localStorage.getItem(FILTER_DEFINITIONS_KEY);
    if (!raw) {
      return DEFAULT_FILTER_DEFINITIONS.map((d) => ({ ...d, values: [...d.values] }));
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("invalid");
      return parsed.map((d) => ({
        name: String(d.name || "").trim(),
        type: d.type === "text" || d.type === "date" ? d.type : "dropdown",
        dataType: String(d.dataType || (d.type === "date" ? "date" : d.type === "dropdown" ? "boolean" : "string"))
          .trim()
          .toLowerCase(),
        values: Array.isArray(d.values) ? d.values.map((v) => String(v).trim()).filter(Boolean) : []
      }));
    } catch (_e) {
      return DEFAULT_FILTER_DEFINITIONS.map((d) => ({ ...d, values: [...d.values] }));
    }
  }

  function saveFilterDefinitions() {
    localStorage.setItem(FILTER_DEFINITIONS_KEY, JSON.stringify(filterDefinitions));
  }

  function updateRoleUI() {
    // Manage Metadata feature intentionally disabled for all roles.
  }

  function refreshRecentList() {
    const allExperiments = getExperiments();
    const filtered = sortExperimentsByRecency(filterExperiments(allExperiments, homeSearch.value)).slice(0, 5);

    renderList(recentList, emptyRecent, filtered, {
      actionMode: "workspace",
      canDelete: Boolean(currentUser && currentUser.role === "admin" && canDeleteExperimentsInDb !== false)
    });

    if (seeAllExperimentsWrap) {
      seeAllExperimentsWrap.style.display = allExperiments.length < 5 ? "none" : "flex";
    }

    if (experimentFormView && experimentFormView.style.display === "block" && isWorkspaceSwitcherOpen) {
      renderWorkspaceSwitcherList();
    }
  }

  function renderWorkspaceSwitcherList() {
    if (!workspaceSwitcherList) return;
    const allExperiments = sortExperimentsByRecency(getExperiments());
    const query = String((workspaceSwitcherSearch && workspaceSwitcherSearch.value) || "").trim().toLowerCase();
    const filtered = allExperiments.filter((experiment) => {
      if (!query) return true;
      const haystack = `${experiment.name || ""} ${experiment.owner || ""}`.toLowerCase();
      return haystack.includes(query);
    });

    if (!filtered.length) {
      workspaceSwitcherList.innerHTML = '<li class="workspace-switcher-empty">No experiments found.</li>';
      return;
    }

    workspaceSwitcherList.innerHTML = filtered
      .map((experiment) => {
        const activeClass = Number(editingExperimentId) === Number(experiment.id) ? " is-active" : "";
        const status = String(experiment.status || "Saved");
        return `
          <li>
            <button type="button" class="workspace-switcher-item${activeClass}" data-id="${experiment.id}">
              <span class="workspace-switcher-item-name">${escapeHtml(experiment.name || "Untitled Experiment")}</span>
              <span class="workspace-switcher-item-meta">${escapeHtml(experiment.owner || "System")} • ${escapeHtml(status)}</span>
            </button>
          </li>
        `;
      })
      .join("");
  }

  function syncWorkspaceSwitcherLabel() {
    if (!workspaceSwitcherLabel) return;
    if (editingExperimentId === null) {
      workspaceSwitcherLabel.textContent = "New Experiment";
      return;
    }
    const experiment = getExperiments().find((item) => Number(item.id) === Number(editingExperimentId));
    workspaceSwitcherLabel.textContent = (experiment && experiment.name) || "Select Experiment";
  }

  function toggleWorkspaceSwitcher(forceState) {
    if (!workspaceSwitcherPanel || !workspaceSwitcherToggle) return;
    const nextState = typeof forceState === "boolean" ? forceState : !isWorkspaceSwitcherOpen;
    isWorkspaceSwitcherOpen = nextState;
    workspaceSwitcherPanel.classList.toggle("is-open", nextState);
    workspaceSwitcherPanel.setAttribute("aria-hidden", nextState ? "false" : "true");
    workspaceSwitcherToggle.setAttribute("aria-expanded", nextState ? "true" : "false");
    if (nextState) {
      renderWorkspaceSwitcherList();
      syncWorkspaceSwitcherLabel();
      if (workspaceSwitcherSearch) workspaceSwitcherSearch.focus();
    }
  }

  async function deleteExperimentById(experimentId) {
    if (!currentUser || currentUser.role !== "admin") {
      showToast("Only admins can delete experiments.", "error");
      return;
    }
    if (canDeleteExperimentsInDb === false) {
      showToast("Delete is disabled: your DB role does not have DELETE permission on abx.experiments.", "error");
      return;
    }

    const experiments = getExperiments();
    const target = experiments.find((item) => Number(item.id) === Number(experimentId));
    if (!target) return;

    const shouldDelete = window.confirm(`Delete experiment "${target.name}"? This action cannot be undone.`);
    if (!shouldDelete) return;

    if (supabaseClient) {
      const isPermissionDenied = (messageText) => {
        const text = String(messageText || "").toLowerCase();
        return text.includes("permission denied");
      };
      const isFkBlocked = (messageText) => {
        const text = String(messageText || "").toLowerCase();
        return (
          text.includes("violates foreign key constraint") ||
          text.includes("is still referenced") ||
          text.includes("update or delete on table")
        );
      };

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
          if (error && !isPermissionDenied(error.message)) {
            throw error;
          }
        }

        const { error: experimentDeleteError } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENTS_TABLE)
          .delete()
          .eq("experiment_id", experimentId);
        if (experimentDeleteError) {
          if (isPermissionDenied(experimentDeleteError.message)) {
            canDeleteExperimentsInDb = false;
            refreshRecentList();
            showToast("Unable to delete experiment: missing DELETE permission on abx.experiments.", "error");
            return;
          }
          if (isFkBlocked(experimentDeleteError.message)) {
            showToast(
              "Unable to delete experiment due to related records and limited permissions on dependent tables. " +
              "Please ask DB admin to grant delete access on dependent tables."
            );
            return;
          }
          throw experimentDeleteError;
        }
      } catch (error) {
        showToast(`Unable to delete experiment: ${normalizeErrorMessage(error, "Unknown error")}`, "error");
        return;
      }
    }

    const updatedExperiments = experiments.filter((item) => Number(item.id) !== Number(experimentId));
    saveExperiments(updatedExperiments);
    refreshRecentList();
  }

  function checkExperimentStatus() {
    const experiments = getExperiments();
    const nowTs = Date.now();
    const nowDate = new Date().toISOString().slice(0, 10);
    let changed = false;

    experiments.forEach((experiment) => {
      if (experiment.status !== "Planned") return;

      const scheduleAt = experiment.config && experiment.config.scheduleAt;
      if (!scheduleAt) return;

      const scheduleTs = new Date(scheduleAt).getTime();
      if (Number.isNaN(scheduleTs)) return;

      if (nowTs >= scheduleTs) {
        experiment.status = "Running";
        experiment.updatedAt = nowDate;
        experiment.updatedAtTs = nowTs;
        experiment.lastModifiedAt = new Date(nowTs).toISOString();
        addHistoryEntry(experiment, {
          at: experiment.lastModifiedAt,
          actor: "System",
          action: "Auto-Started",
          summary: "Scheduled start time reached.",
          details: ["Status changed: Planned -> Running."]
        });
        changed = true;
      }
    });

    if (changed) {
      saveExperiments(experiments);
    }
  }

  async function openDashboardView() {
    destroyTrendChart();
    currentAnalyticsData = null;
    await syncExperimentsFromSupabase();
    checkExperimentStatus();
    refreshRecentList();
    showView("dashboard");
  }

  async function detectExperimentDeletePermission() {
    if (!supabaseClient || !currentUser || currentUser.role !== "admin") {
      canDeleteExperimentsInDb = null;
      return;
    }

    try {
      const { error } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENTS_TABLE)
        .delete()
        .eq("experiment_id", -1);

      if (error) {
        const text = String(error.message || "").toLowerCase();
        if (text.includes("permission denied")) {
          canDeleteExperimentsInDb = false;
          return;
        }
      }

      canDeleteExperimentsInDb = true;
    } catch (_error) {
      canDeleteExperimentsInDb = null;
    }
  }

  function getActorLabel() {
    if (!currentUser) return "System";
    return currentUser.email;
  }

  async function getCurrentOwnerIdentifier() {
    const userId = await resolveCurrentUserId();
    if (userId) return userId;
    return getActorLabel();
  }

  function normalizeFiltersForCompare(filters) {
    const builder = normalizeFilterBuilder(filters);
    const normalized = [];

    builder.groups.forEach((group, groupIndex) => {
      const connector = groupIndex > 0 ? builder.connectors[groupIndex - 1] : "";
      const conditions = Array.isArray(group.conditions) ? group.conditions : [];
      conditions.forEach((rule, conditionIndex) => {
        const clean = normalizeCondition(rule);
        if (!clean.attribute) return;
        normalized.push({
          key: `${groupIndex}:${conditionIndex}`,
          groupIndex,
          groupLabel: toGroupLabel(groupIndex),
          connector,
          attribute: clean.attribute,
          operator: clean.operator,
          value: clean.value
        });
      });
    });

    return normalized;
  }

  function areFiltersEqual(a, b) {
    return JSON.stringify(normalizeFiltersForCompare(a)) === JSON.stringify(normalizeFiltersForCompare(b));
  }

  function formatFilterValue(value) {
    const text = String(value || "").trim();
    return text || "(empty)";
  }

  function buildFilterChangeDetails(previousFilters, nextFilters) {
    const prev = normalizeFiltersForCompare(previousFilters);
    const next = normalizeFiltersForCompare(nextFilters);
    const lines = [];

    const max = Math.max(prev.length, next.length);
    for (let i = 0; i < max; i += 1) {
      const before = prev[i];
      const after = next[i];
      const label = after
        ? `Group ${after.groupLabel} / ${after.attribute}`
        : before
          ? `Group ${before.groupLabel} / ${before.attribute}`
          : `Rule ${i + 1}`;

      if (!before && after) {
        lines.push(`Added ${label}: ${after.operator} ${formatFilterValue(after.value)}.`);
        continue;
      }

      if (before && !after) {
        lines.push(`Removed ${label} (was ${before.operator} ${formatFilterValue(before.value)}).`);
        continue;
      }

      if (!before || !after) continue;

      if (
        before.attribute !== after.attribute ||
        before.operator !== after.operator ||
        before.value !== after.value ||
        before.connector !== after.connector
      ) {
        lines.push(
          `${label} changed: ${before.operator} ${formatFilterValue(before.value)} -> ${after.operator} ${formatFilterValue(after.value)}.`
        );
      }
    }

    return lines;
  }

  function formatHistoryTime(isoString) {
    const parsed = new Date(isoString);
    if (Number.isNaN(parsed.getTime())) return "Unknown time";
    return parsed.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function addHistoryEntry(experiment, entry) {
    if (!experiment) return;
    if (!Array.isArray(experiment.history)) experiment.history = [];

    experiment.history.unshift({
      id: Date.now() + Math.floor(Math.random() * 1000),
      at: entry.at || new Date().toISOString(),
      actor: entry.actor || "System",
      action: entry.action || "Updated",
      summary: entry.summary || "",
      details: Array.isArray(entry.details) ? entry.details : []
    });
  }

  function getIntentActionLabel(intent, isNew, existingStatus) {
    if (intent === "publish") return "Published Experiment";
    if (intent === "pause") return "Paused Experiment";
    if (intent === "resume") return "Resumed Experiment";
    if (intent === "draft") {
      if (isNew || existingStatus === "Saved") return "Saved as Draft";
      return "Saved Changes";
    }
    return "Updated Experiment";
  }

  function buildHistoryDetails(previousExperiment, payload, nextStatus, isNew) {
    const details = [];
    if (isNew || !previousExperiment) {
      details.push(`Experiment created with rollout ${payload.rollout}%.`);
      if (payload.scheduleAt) {
        details.push(`Scheduled start: ${formatHistoryTime(payload.scheduleAt)}.`);
      }
      const appliedCount = normalizeFiltersForCompare(payload.filters).length;
      if (appliedCount > 0) {
        details.push(`Applied ${appliedCount} filter rule${appliedCount === 1 ? "" : "s"}.`);
      }
      return details;
    }

    const prevName = previousExperiment.name || "";
    const prevFeature = (previousExperiment.config && previousExperiment.config.featureName) || "";
    const prevRollout = Number((previousExperiment.config && previousExperiment.config.rollout) || 0);
    const prevSchedule = (previousExperiment.config && previousExperiment.config.scheduleAt) || "";
    const prevFilters = (previousExperiment.config && previousExperiment.config.filters) || [];
    const prevStatus = previousExperiment.status || "Saved";

    if (prevName !== payload.name) details.push(`Name changed to "${payload.name}".`);
    if (prevFeature !== payload.featureName) details.push(`Feature changed to "${payload.featureName}".`);
    if (prevRollout !== Number(payload.rollout)) details.push(`Rollout changed: ${prevRollout}% -> ${payload.rollout}%.`);
    if ((prevSchedule || "") !== (payload.scheduleAt || "")) {
      if (!payload.scheduleAt) {
        details.push("Schedule removed.");
      } else {
        details.push(`Schedule set to ${formatHistoryTime(payload.scheduleAt)}.`);
      }
    }
    if (!areFiltersEqual(prevFilters, payload.filters)) {
      const filterChangeDetails = buildFilterChangeDetails(prevFilters, payload.filters);
      if (filterChangeDetails.length) {
        details.push(...filterChangeDetails);
      } else {
        const count = normalizeFiltersForCompare(payload.filters).length;
        details.push(`Filters updated (${count} rule${count === 1 ? "" : "s"}).`);
      }
    }
    if (prevStatus !== nextStatus) details.push(`Status changed: ${prevStatus} -> ${nextStatus}.`);

    return details;
  }

  function renderHistoryView() {
    if (!historyTimeline || !historyEmpty) return;
    historyTimeline.innerHTML = "";

    const experiment = getCurrentExperimentForWorkspace();
    if (!experiment || experiment.id === null) {
      historyEmpty.hidden = false;
      historyEmpty.textContent = "No history yet. Save or publish this experiment to create entries.";
      return;
    }

    const history = Array.isArray(experiment.history) ? [...experiment.history] : [];
    history.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

    if (!history.length) {
      historyEmpty.hidden = false;
      historyEmpty.textContent = "No history found for this experiment yet.";
      return;
    }

    historyEmpty.hidden = true;
    history.forEach((entry) => {
      const li = document.createElement("li");
      li.className = "history-item";

      const detailsMarkup = Array.isArray(entry.details) && entry.details.length
        ? `<ul class="history-item-details">${entry.details.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "";

      li.innerHTML = `
        <div class="history-item-head">
          <p class="history-item-action">${escapeHtml(entry.action || "Updated Experiment")}</p>
          <span class="history-item-time">${formatHistoryTime(entry.at)}</span>
        </div>
        <p class="history-item-meta">${escapeHtml(entry.actor || "System")}${entry.summary ? ` - ${escapeHtml(entry.summary)}` : ""}</p>
        ${detailsMarkup}
      `;

      historyTimeline.appendChild(li);
    });
  }

  function getDefinition(name) {
    return filterDefinitions.find((d) => d.name === name) || null;
  }

  function createOption(value, label) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = typeof label === "undefined" ? value : label;
    return option;
  }

  function toGroupLabel(index) {
    return String.fromCharCode(65 + index);
  }

  function createEmptyCondition() {
    return {
      attribute: "",
      operator: "is",
      value: ""
    };
  }

  function createEmptyGroup() {
    return {
      conditions: [createEmptyCondition()]
    };
  }

  function normalizeCondition(rule) {
    const attributeRaw =
      (rule && (rule.attribute || rule.param_key || rule.paramKey || rule.field || rule.name || rule.label)) || "";
    const operatorRaw = (rule && (rule.operator || rule.op || rule.condition)) || "is";
    const valueRaw = (rule && (rule.value || rule.val || rule.target || rule.attribute_value)) || "";
    const normalizedOperator = String(operatorRaw).trim().toLowerCase();
    const operator = OPERATORS.find((item) => item.toLowerCase() === normalizedOperator) || "is";
    return {
      attribute: String(attributeRaw).trim(),
      operator,
      value: String(valueRaw).trim()
    };
  }

  function normalizeFilterBuilder(filters) {
    if (Array.isArray(filters)) {
      const groupsFromArray = filters.map((rule) => ({
        conditions: [normalizeCondition(rule)]
      }));
      const safeGroups = groupsFromArray.length ? groupsFromArray : [createEmptyGroup()];
      return {
        groups: safeGroups,
        connectors: Array.from({ length: Math.max(safeGroups.length - 1, 0) }, () => "AND")
      };
    }

    const isObject = filters && typeof filters === "object";
    if (isObject && Array.isArray(filters.rules)) {
      const rulesGroup = { conditions: filters.rules.map((rule) => normalizeCondition(rule)) };
      return normalizeFilterBuilder({ groups: [rulesGroup] });
    }
    if (isObject && Array.isArray(filters.conditions)) {
      const conditionsGroup = { conditions: filters.conditions.map((rule) => normalizeCondition(rule)) };
      return normalizeFilterBuilder({ groups: [conditionsGroup] });
    }
    const rawGroups = isObject && Array.isArray(filters.groups) ? filters.groups : [];
    const groups = rawGroups
      .map((group) => {
        const rawConditions = Array.isArray(group && group.conditions)
          ? group.conditions
          : Array.isArray(group && group.rules)
            ? group.rules
            : [];
        const conditions = rawConditions.map((rule) => normalizeCondition(rule));
        return { conditions: conditions.length ? conditions : [createEmptyCondition()] };
      })
      .filter(Boolean);

    const safeGroups = groups.length ? groups : [createEmptyGroup()];
    const connectors = Array.from({ length: Math.max(safeGroups.length - 1, 0) }, () => "AND");

    return { groups: safeGroups, connectors };
  }

  function serializeFilterBuilder(builder) {
    const normalized = normalizeFilterBuilder(builder);
    return {
      groups: normalized.groups.map((group) => ({
        conditions: group.conditions.map((rule) => normalizeCondition(rule))
      })),
      connectors: normalized.connectors.map(() => "AND")
    };
  }

  function deserializeFilterBuilder(rawValue) {
    if (rawValue === null || typeof rawValue === "undefined") return [];

    let value = rawValue;
    // Handle single/double-encoded JSON strings from DB transports.
    for (let i = 0; i < 3; i += 1) {
      if (typeof value !== "string") break;
      const text = value.trim();
      if (!text) return [];
      try {
        value = JSON.parse(text);
      } catch (_error) {
        return [];
      }
    }

    if (value && typeof value === "object" && !Array.isArray(value) && value.applied_filters) {
      return deserializeFilterBuilder(value.applied_filters);
    }

    // If payload is already in known filter-builder shape, use as-is.
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      if (Array.isArray(value.groups) || Array.isArray(value.conditions) || Array.isArray(value.rules)) {
        return value;
      }
    }

    // Support single-rule objects and simple map-style objects only at top-level.
    const extracted = [];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const looksLikeSingleRule =
        typeof value.attribute !== "undefined" ||
        typeof value.param_key !== "undefined" ||
        typeof value.paramKey !== "undefined" ||
        typeof value.field !== "undefined" ||
        typeof value.name !== "undefined" ||
        typeof value.label !== "undefined";

      if (looksLikeSingleRule) {
        const normalized = normalizeCondition(value);
        if (normalized.attribute) {
          extracted.push(normalized);
        }
      } else {
        Object.entries(value).forEach(([key, child]) => {
          if (["groups", "conditions", "rules", "connectors", "applied_filters"].includes(String(key || "").toLowerCase())) return;
          if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
            const normalized = normalizeCondition({
              attribute: key,
              operator: "is",
              value: String(child)
            });
            if (normalized.attribute) extracted.push(normalized);
            return;
          }
          if (child && typeof child === "object" && !Array.isArray(child)) {
            const op = child.operator || child.op || child.condition || "is";
            const val = typeof child.value !== "undefined"
              ? child.value
              : typeof child.val !== "undefined"
                ? child.val
                : typeof child.target !== "undefined"
                  ? child.target
                  : "";
            const normalized = normalizeCondition({
              attribute: key,
              operator: op,
              value: String(val || "")
            });
            if (normalized.attribute && (normalized.value || normalized.operator === "exists")) {
              extracted.push(normalized);
            }
          }
        });
      }
    }

    if (extracted.length) {
      return {
        groups: [{ conditions: extracted }],
        connectors: []
      };
    }

    return value;
  }

  function getAnalyticsViewMode() {
    const metric = analyticsMetricSelect ? String(analyticsMetricSelect.value || "activation") : "activation";
    const format = analyticsFormatSelect ? String(analyticsFormatSelect.value || "table") : "table";
    const safeMetric = ["activation", "retention"].includes(metric) ? metric : "activation";
    const safeFormat = ["chart", "table"].includes(format) ? format : "table";
    return `${safeMetric}_${safeFormat}`;
  }

  function toDateKey(value) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    return parsed.toISOString().slice(0, 10);
  }

  function getTodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function addDays(dateKey, days) {
    const parsed = new Date(`${dateKey}T00:00:00Z`);
    parsed.setUTCDate(parsed.getUTCDate() + days);
    return parsed.toISOString().slice(0, 10);
  }

  function diffDays(fromKey, toKey) {
    const fromTs = new Date(`${fromKey}T00:00:00Z`).getTime();
    const toTs = new Date(`${toKey}T00:00:00Z`).getTime();
    if (Number.isNaN(fromTs) || Number.isNaN(toTs)) return NaN;
    return Math.floor((toTs - fromTs) / (24 * 60 * 60 * 1000));
  }

  function getLast7DateKeys() {
    const today = new Date();
    const todayKey = today.toISOString().slice(0, 10);
    const start = new Date(`${todayKey}T00:00:00Z`);
    start.setUTCDate(start.getUTCDate() - 6);
    const keys = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + i);
      keys.push(date.toISOString().slice(0, 10));
    }
    return keys;
  }

  function getLast7DateKeysFromBase(baseDateKey) {
    const base = new Date(`${baseDateKey}T00:00:00Z`);
    if (Number.isNaN(base.getTime())) return getLast7DateKeys();
    const start = new Date(base);
    start.setUTCDate(start.getUTCDate() - 6);
    const keys = [];
    for (let i = 0; i < 7; i += 1) {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + i);
      keys.push(date.toISOString().slice(0, 10));
    }
    return keys;
  }

  function isKeyInWindow(dateKey, orderedKeys) {
    return orderedKeys.includes(dateKey);
  }

  function buildEmptyAnalyticsPayload(dateKeys) {
    const keys = Array.isArray(dateKeys) && dateKeys.length ? dateKeys : getLast7DateKeys();
    return {
      dateKeys: keys,
      totalAssignedUsers: 0,
      activation: {
        cohorts: initVariantMatrix(keys),
        chartDays: [0, 1, 2, 3, 4, 5, 6, 7],
        chart: { control: [0, 0, 0, 0, 0, 0, 0, 0], test: [0, 0, 0, 0, 0, 0, 0, 0] }
      },
      retention: {
        cohorts: initVariantMatrix(keys),
        chartDays: [0, 1, 2, 3, 4, 5, 6, 7],
        chart: { control: [0, 0, 0, 0, 0, 0, 0, 0], test: [0, 0, 0, 0, 0, 0, 0, 0] }
      },
      isEmpty: true
    };
  }

  async function fetchOnboardingRowsInRangeForUsers(userIds, fromDate, toDate) {
    if (!supabaseClient) return [];
    if (!Array.isArray(userIds) || !userIds.length) return [];
    const chunkSize = 500;
    const rows = [];

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const query = supabaseClient
        .from(SUPABASE_ONBOARDING_TABLE)
        .select("user_id,signup_date")
        .in("user_id", chunk)
        .gte("signup_date", fromDate)
        .lte("signup_date", toDate);

      const { data, error } = await query;
      if (error) throw error;
      if (Array.isArray(data)) rows.push(...data);
    }

    return rows;
  }

  async function fetchExperimentAssignments(experimentId) {
    if (!supabaseClient || !experimentId) return [];
    const pageSize = 1000;
    let from = 0;
    const collected = [];

    while (true) {
      const { data, error } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE)
        .select("user_id,variant,assigned_at")
        .eq("experiment_id", experimentId)
        .range(from, from + pageSize - 1);

      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];
      collected.push(...rows);
      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return collected;
  }

  async function fetchExperimentExposures(experimentId) {
    if (!supabaseClient || !experimentId) return [];
    const pageSize = 1000;
    let from = 0;
    const collected = [];

    while (true) {
      const { data, error } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENT_EXPOSURES_TABLE)
        .select("user_id,variant,exposed_at")
        .eq("experiment_id", experimentId)
        .range(from, from + pageSize - 1);

      if (error) throw error;
      const rows = Array.isArray(data) ? data : [];
      collected.push(...rows);
      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return collected;
  }

  async function fetchOnboardingRowsForUsers(userIds) {
    if (!supabaseClient) return [];
    if (!Array.isArray(userIds) || !userIds.length) return [];
    const chunkSize = 500;
    const rows = [];

    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const { data, error } = await supabaseClient
        .from(SUPABASE_ONBOARDING_TABLE)
        .select("user_id,signup_date")
        .in("user_id", chunk);

      if (error) throw error;
      if (Array.isArray(data)) rows.push(...data);
    }

    return rows;
  }

  async function fetchAllSubmissionEventsForUsers(userIds) {
    if (!supabaseClient) return [];
    if (!Array.isArray(userIds) || !userIds.length) return [];

    const chunkSize = 500;
    const rows = [];
    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const { data, error } = await supabaseClient
        .from(SUPABASE_USER_INTERACTION_TABLE)
        .select("user_id,interaction_date")
        .in("user_id", chunk)
        .eq("submission", 1);

      if (error) throw error;
      if (Array.isArray(data)) rows.push(...data);
    }
    return rows;
  }

  async function loadRawCohortAnalytics(experimentId) {
    let assignmentRows = await fetchExperimentAssignments(experimentId);
    if (!assignmentRows.length) {
      assignmentRows = await fetchExperimentExposures(experimentId);
    }
    if (!assignmentRows.length) return null;

    const usersByVariant = { control: new Set(), test: new Set() };
    assignmentRows.forEach((row) => {
      const userId = String((row && row.user_id) || "").trim();
      const variant = String((row && row.variant) || "").trim().toLowerCase();
      if (!userId) return;
      if (variant === "control" || variant === "test") {
        usersByVariant[variant].add(userId);
      }
    });

    const allUserIds = Array.from(new Set([...usersByVariant.control, ...usersByVariant.test]));
    if (!allUserIds.length) return null;

    const onboardingRows = await fetchOnboardingRowsForUsers(allUserIds);
    const signupByUser = new Map();
    onboardingRows.forEach((row) => {
      const userId = String((row && row.user_id) || "").trim();
      const signupDate = toDateKey(row && row.signup_date);
      if (userId && signupDate) signupByUser.set(userId, signupDate);
    });

    const submissionRows = await fetchAllSubmissionEventsForUsers(allUserIds);
    const firstSubmissionByUser = new Map();
    const submissionOffsetsByUser = new Map();

    submissionRows.forEach((row) => {
      const userId = String((row && row.user_id) || "").trim();
      const interactionDate = toDateKey(row && row.interaction_date);
      if (!userId || !interactionDate) return;

      const existingFirst = firstSubmissionByUser.get(userId);
      if (!existingFirst || interactionDate < existingFirst) {
        firstSubmissionByUser.set(userId, interactionDate);
      }
    });

    submissionRows.forEach((row) => {
      const userId = String((row && row.user_id) || "").trim();
      const interactionDate = toDateKey(row && row.interaction_date);
      const firstDate = firstSubmissionByUser.get(userId);
      if (!userId || !interactionDate || !firstDate) return;
      const offset = diffDays(firstDate, interactionDate);
      if (Number.isNaN(offset) || offset <= 0 || offset > 7) return;
      if (!submissionOffsetsByUser.has(userId)) {
        submissionOffsetsByUser.set(userId, new Set());
      }
      submissionOffsetsByUser.get(userId).add(offset);
    });

    const baseCandidates = [];
    signupByUser.forEach((dateKey) => baseCandidates.push(dateKey));
    firstSubmissionByUser.forEach((dateKey) => baseCandidates.push(dateKey));
    const baseDateKey = baseCandidates.length
      ? [...baseCandidates].sort()[baseCandidates.length - 1]
      : getTodayKey();
    const dateKeys = getLast7DateKeysFromBase(baseDateKey);

    const context = {
      dateKeys,
      todayKey: getTodayKey(),
      usersByVariant: {
        control: Array.from(usersByVariant.control),
        test: Array.from(usersByVariant.test)
      },
      signupByUser,
      firstSubmissionByUser,
      submissionOffsetsByUser
    };

    const activation = calculateActivationCohorts(context);
    const retention = calculateRetentionCohorts(context);
    const totalAssignedUsers = context.usersByVariant.control.length + context.usersByVariant.test.length;

    return {
      experimentId,
      snapshotDate: null,
      dateKeys,
      totalAssignedUsers,
      activation,
      retention,
      isEmpty: totalAssignedUsers <= 0
    };
  }

  async function fetchSubmissionEventsForUsersInRange(userIds, fromDate, toDate) {
    if (!supabaseClient) return [];
    if (!Array.isArray(userIds) || !userIds.length) return [];

    const chunkSize = 500;
    const rows = [];
    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const { data, error } = await supabaseClient
        .from(SUPABASE_USER_INTERACTION_TABLE)
        .select("user_id,interaction_date")
        .in("user_id", chunk)
        .eq("submission", 1)
        .gte("interaction_date", fromDate)
        .lte("interaction_date", toDate);

      if (error) throw error;
      if (Array.isArray(data)) rows.push(...data);
    }
    return rows;
  }

  async function fetchUsersWithSubmissionsBefore(userIds, beforeDate) {
    if (!supabaseClient) return new Set();
    if (!Array.isArray(userIds) || !userIds.length) return new Set();

    const chunkSize = 500;
    const users = new Set();
    for (let i = 0; i < userIds.length; i += chunkSize) {
      const chunk = userIds.slice(i, i + chunkSize);
      const { data, error } = await supabaseClient
        .from(SUPABASE_USER_INTERACTION_TABLE)
        .select("user_id")
        .in("user_id", chunk)
        .eq("submission", 1)
        .lt("interaction_date", beforeDate);

      if (error) throw error;
      (Array.isArray(data) ? data : []).forEach((row) => {
        const userId = String((row && row.user_id) || "").trim();
        if (userId) users.add(userId);
      });
    }

    return users;
  }

  function initVariantMatrix(dateKeys) {
    const matrix = {};
    ["control", "test"].forEach((variant) => {
      matrix[variant] = {};
      dateKeys.forEach((dateKey) => {
        matrix[variant][dateKey] = {
          usersCount: 0,
          days: Array.from({ length: 8 }, () => null)
        };
      });
    });
    return matrix;
  }

  function calculateActivationCohorts(context) {
    const { dateKeys, usersByVariant, signupByUser, firstSubmissionByUser, todayKey } = context;
    const cohorts = initVariantMatrix(dateKeys);
    const chartDays = Array.from({ length: 8 }, (_unused, idx) => idx);

    Object.entries(usersByVariant).forEach(([variant, userIds]) => {
      userIds.forEach((userId) => {
        const signupDate = signupByUser.get(userId);
        if (!signupDate || !isKeyInWindow(signupDate, dateKeys)) return;
        const cohort = cohorts[variant][signupDate];
        cohort.usersCount += 1;

        const firstSubmissionDate = firstSubmissionByUser.get(userId) || "";
        const firstDiff = firstSubmissionDate ? diffDays(signupDate, firstSubmissionDate) : NaN;

        for (let day = 0; day <= 7; day += 1) {
          if (addDays(signupDate, day) > todayKey) {
            cohort.days[day] = null;
            continue;
          }

          if (cohort.days[day] === null) {
            cohort.days[day] = 0;
          }

          if (!Number.isNaN(firstDiff) && firstDiff >= 0 && firstDiff <= day) {
            cohort.days[day] += 1;
          }
        }
      });

      dateKeys.forEach((dateKey) => {
        const cohort = cohorts[variant][dateKey];
        if (!cohort.usersCount) return;
        for (let day = 0; day <= 7; day += 1) {
          if (cohort.days[day] === null) continue;
          cohort.days[day] = Number(((cohort.days[day] / cohort.usersCount) * 100).toFixed(2));
        }
      });
    });

    const chart = { control: [], test: [] };
    ["control", "test"].forEach((variant) => {
      chartDays.forEach((day) => {
        let eligible = 0;
        let activated = 0;
        usersByVariant[variant].forEach((userId) => {
          const signupDate = signupByUser.get(userId);
          if (!signupDate || !isKeyInWindow(signupDate, dateKeys)) return;
          if (addDays(signupDate, day) > todayKey) return;

          eligible += 1;
          const firstSubmissionDate = firstSubmissionByUser.get(userId) || "";
          const firstDiff = firstSubmissionDate ? diffDays(signupDate, firstSubmissionDate) : NaN;
          if (!Number.isNaN(firstDiff) && firstDiff >= 0 && firstDiff <= day) activated += 1;
        });
        chart[variant].push(eligible ? Number(((activated / eligible) * 100).toFixed(2)) : 0);
      });
    });

    return { cohorts, chartDays, chart };
  }

  function calculateRetentionCohorts(context) {
    const { dateKeys, usersByVariant, firstSubmissionByUser, submissionOffsetsByUser, todayKey } = context;
    const cohorts = initVariantMatrix(dateKeys);
    const chartDays = Array.from({ length: 8 }, (_unused, idx) => idx);

    Object.entries(usersByVariant).forEach(([variant, userIds]) => {
      userIds.forEach((userId) => {
        const firstDate = firstSubmissionByUser.get(userId);
        if (!firstDate || !isKeyInWindow(firstDate, dateKeys)) return;
        const cohort = cohorts[variant][firstDate];
        cohort.usersCount += 1;
        const offsets = submissionOffsetsByUser.get(userId) || new Set();

        for (let day = 0; day <= 7; day += 1) {
          if (addDays(firstDate, day) > todayKey) {
            cohort.days[day] = null;
            continue;
          }

          if (day === 0) {
            cohort.days[day] = 100;
            continue;
          }

          if (cohort.days[day] === null) {
            cohort.days[day] = 0;
          }
          if (offsets.has(day)) {
            cohort.days[day] += 1;
          }
        }
      });

      dateKeys.forEach((dateKey) => {
        const cohort = cohorts[variant][dateKey];
        if (!cohort.usersCount) return;
        for (let day = 1; day <= 7; day += 1) {
          if (cohort.days[day] === null) continue;
          cohort.days[day] = Number(((cohort.days[day] / cohort.usersCount) * 100).toFixed(2));
        }
      });
    });

    const chart = { control: [], test: [] };
    ["control", "test"].forEach((variant) => {
      chartDays.forEach((day) => {
        let eligible = 0;
        let returned = 0;
        usersByVariant[variant].forEach((userId) => {
          const firstDate = firstSubmissionByUser.get(userId);
          if (!firstDate || !isKeyInWindow(firstDate, dateKeys)) return;
          if (addDays(firstDate, day) > todayKey) return;

          eligible += 1;
          const offsets = submissionOffsetsByUser.get(userId) || new Set();
          if (offsets.has(day)) returned += 1;
        });
        chart[variant].push(eligible ? Number(((returned / eligible) * 100).toFixed(2)) : 0);
      });
    });

    return { cohorts, chartDays, chart };
  }

  function hexToRgb(hex) {
    const clean = String(hex || "").replace("#", "").trim();
    if (clean.length !== 6) return { r: 255, g: 255, b: 255 };
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16)
    };
  }

  function interpolateRgb(startHex, endHex, ratio) {
    const start = hexToRgb(startHex);
    const end = hexToRgb(endHex);
    const safeRatio = Math.max(0, Math.min(1, Number(ratio)));
    const r = Math.round(start.r + (end.r - start.r) * safeRatio);
    const g = Math.round(start.g + (end.g - start.g) * safeRatio);
    const b = Math.round(start.b + (end.b - start.b) * safeRatio);
    return { r, g, b };
  }

  function rgbToCss(rgb) {
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  }

  function getReadableTextColor(rgb) {
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    return luminance < 150 ? "#ffffff" : "#1f2937";
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, Number(value)));
  }

  function getQuantile(sortedValues, q) {
    if (!Array.isArray(sortedValues) || !sortedValues.length) return NaN;
    if (sortedValues.length === 1) return Number(sortedValues[0]);
    const pos = (sortedValues.length - 1) * clamp(q, 0, 1);
    const base = Math.floor(pos);
    const rest = pos - base;
    const left = Number(sortedValues[base]);
    const right = Number(sortedValues[Math.min(base + 1, sortedValues.length - 1)]);
    return left + (right - left) * rest;
  }

  function buildColumnScalesFromCohorts(cohortMap, dateKeys) {
    // Per-column scaling keeps each Dn column independently normalized.
    // This prevents D0 magnitude from visually flattening D6/D7 cells.
    return Array.from({ length: 8 }, (_unused, dayIdx) => {
      const values = dateKeys
        .map((dateKey) => cohortMap && cohortMap[dateKey] && Array.isArray(cohortMap[dateKey].days) ? cohortMap[dateKey].days[dayIdx] : null)
        .filter((value) => value !== null && !Number.isNaN(Number(value)))
        .map((value) => Number(value))
        .sort((a, b) => a - b);

      if (!values.length) return null;
      const absoluteMin = values[0];
      const absoluteMax = values[values.length - 1];
      let min = getQuantile(values, 0.1);
      let max = getQuantile(values, 0.9);

      if (!Number.isFinite(min)) min = absoluteMin;
      if (!Number.isFinite(max)) max = absoluteMax;
      if (min === max) {
        min = absoluteMin;
        max = absoluteMax;
      }
      if (min === max) return { min, max, flat: true };

      return { min, max, flat: false };
    });
  }

  function buildColumnScalesFromDelta(controlMap, testMap, dateKeys) {
    return Array.from({ length: 8 }, (_unused, dayIdx) => {
      const values = dateKeys
        .map((dateKey) => {
          const control = controlMap && controlMap[dateKey] && Array.isArray(controlMap[dateKey].days)
            ? controlMap[dateKey].days[dayIdx]
            : null;
          const test = testMap && testMap[dateKey] && Array.isArray(testMap[dateKey].days)
            ? testMap[dateKey].days[dayIdx]
            : null;
          if (control === null || test === null) return null;
          return Number(test) - Number(control);
        })
        .filter((value) => value !== null && !Number.isNaN(Number(value)))
        .map((value) => Number(value))
        .sort((a, b) => a - b);

      if (!values.length) return null;
      const absoluteMin = values[0];
      const absoluteMax = values[values.length - 1];
      let min = getQuantile(values, 0.1);
      let max = getQuantile(values, 0.9);

      if (!Number.isFinite(min)) min = absoluteMin;
      if (!Number.isFinite(max)) max = absoluteMax;
      if (min === max) {
        min = absoluteMin;
        max = absoluteMax;
      }
      if (min === max) return { min, max, flat: true };

      return { min, max, flat: false };
    });
  }

  function normalizeWithinColumn(value, scale) {
    if (value === null || Number.isNaN(Number(value)) || !scale) return null;
    if (scale.flat || scale.max === scale.min) return 0.5;
    const clamped = clamp(value, scale.min, scale.max);
    return (clamped - scale.min) / (scale.max - scale.min);
  }

  function getColumnHeatStyle(normalizedValue) {
    if (normalizedValue === null || Number.isNaN(Number(normalizedValue))) {
      return { background: "transparent", color: "#333333" };
    }
    const normalized = clamp(normalizedValue, 0, 1);
    const distance = Math.abs(normalized - 0.5) * 2; // 0..1, column-wise intensity
    if (distance < 0.04) {
      return { background: "transparent", color: "#333333" };
    }

    const alpha = 0.18 + distance * 0.55;
    const isPositiveSide = normalized >= 0.5;
    const styles = getComputedStyle(document.documentElement);
    const lowColor = isPositiveSide
      ? styles.getPropertyValue("--heat-positive-soft").trim() || "#E8F5E9"
      : styles.getPropertyValue("--heat-negative-soft").trim() || "#FFEBEE";
    const highColor = isPositiveSide
      ? styles.getPropertyValue("--heat-positive-strong").trim() || "#2E7D32"
      : styles.getPropertyValue("--heat-negative-strong").trim() || "#C62828";
    const rgb = interpolateRgb(lowColor, highColor, distance);
    const luminance = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b;
    const textColor = distance >= 0.6 || luminance < 145 ? "#FFFFFF" : "#333333";
    return { background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha.toFixed(3)})`, color: textColor };
  }

  function renderCohortTableRows(tbody, cohortMap, dateKeys, columnScales, rowClassName = "") {
    if (!tbody) return;
    tbody.innerHTML = "";

    const sorted = [...dateKeys].reverse();
    sorted.forEach((dateKey) => {
      const cohort = cohortMap[dateKey] || { usersCount: 0, days: Array.from({ length: 8 }, () => null) };
      const tr = document.createElement("tr");
      if (rowClassName) tr.classList.add(rowClassName);
      const dayCells = cohort.days
        .map((value, dayIdx) => {
          if (value === null) return `<td class="heat-cell">-</td>`;
          const scale = Array.isArray(columnScales) ? columnScales[dayIdx] : null;
          const normalized = normalizeWithinColumn(value, scale);
          const style = getColumnHeatStyle(normalized);
          return `<td class="heat-cell" style="background:${style.background};color:${style.color}">${Number(value).toFixed(1)}%</td>`;
        })
        .join("");

      tr.innerHTML = `<td>${dateKey}</td><td>${cohort.usersCount.toLocaleString()}</td>${dayCells}`;
      tbody.appendChild(tr);
    });
  }

  function formatDeltaValue(value) {
    if (value === null || Number.isNaN(Number(value))) return "-";
    const num = Number(value);
    const sign = num > 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  }

  function renderDeltaCohortRows(tbody, controlMap, testMap, dateKeys, columnScales) {
    if (!tbody) return;
    tbody.innerHTML = "";

    const sorted = [...dateKeys].reverse();
    sorted.forEach((dateKey) => {
      const controlRow = (controlMap && controlMap[dateKey]) || { usersCount: 0, days: Array.from({ length: 8 }, () => null) };
      const testRow = (testMap && testMap[dateKey]) || { usersCount: 0, days: Array.from({ length: 8 }, () => null) };
      const tr = document.createElement("tr");

      const dayCells = Array.from({ length: 8 }, (_, dayIdx) => {
        const controlValue = controlRow.days[dayIdx];
        const testValue = testRow.days[dayIdx];
        if (controlValue === null || testValue === null) {
          return "<td class=\"heat-cell\">-</td>";
        }
        const delta = Number(testValue) - Number(controlValue);
        const scale = Array.isArray(columnScales) ? columnScales[dayIdx] : null;
        const normalized = normalizeWithinColumn(delta, scale);
        const style = getColumnHeatStyle(normalized);
        return `<td class="heat-cell" style="background:${style.background};color:${style.color}">${formatDeltaValue(delta)}</td>`;
      }).join("");

      tr.innerHTML = `<td>${dateKey}</td>${dayCells}`;
      tbody.appendChild(tr);
    });
  }

  function renderCohortChart(series, title, dayLabels) {
    if (!trendChartCanvas || typeof Chart === "undefined") return;
    const CONTROL_COLOR = "#475569";
    const TEST_COLOR = "#8B5CF6";
    const data = {
      labels: dayLabels,
      datasets: [
        {
          label: "__test_glow__",
          data: series.test,
          borderColor: "rgba(139, 92, 246, 0.24)",
          borderWidth: 8,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0.4,
          fill: false
        },
        {
          label: "Control",
          data: series.control,
          borderColor: CONTROL_COLOR,
          backgroundColor: "rgba(71, 85, 105, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: CONTROL_COLOR,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: false
        },
        {
          label: "Test",
          data: series.test,
          borderColor: TEST_COLOR,
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: TEST_COLOR,
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: false
        }
      ]
    };

    if (analyticsChartTitle) analyticsChartTitle.textContent = title;

    if (trendChart) {
      trendChart.data = data;
      trendChart.update();
      return;
    }

    trendChart = new Chart(trendChartCanvas, {
      type: "line",
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            labels: {
              usePointStyle: true,
              pointStyle: "circle",
              filter(item) {
                return item && item.text !== "__test_glow__";
              }
            }
          },
          tooltip: {
            usePointStyle: true,
            filter(context) {
              return context && context.dataset && context.dataset.label !== "__test_glow__";
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            ticks: {
              callback(value) {
                return `${value}%`;
              }
            }
          }
        }
      }
    });
  }

  function destroyTrendChart() {
    if (trendChart) {
      trendChart.destroy();
      trendChart = null;
    }
  }

  function updateKpiStripForAnalytics(data, mode) {
    if (!kpiLift || !kpiSignificance || !kpiUsers || !kpiGuardrails || !kpiRecommendation) {
      return;
    }

    const isActivation = mode.startsWith("activation");
    const source = isActivation ? data.activation : data.retention;
    const controlD7 = Number(source.chart.control[7] || 0);
    const testD7 = Number(source.chart.test[7] || 0);
    const lift = testD7 - controlD7;
    const totalUsers = data.totalAssignedUsers;

    kpiLift.textContent = `${lift >= 0 ? "+" : ""}${lift.toFixed(2)}%`;
    kpiLift.className = lift >= 0 ? "kpi-positive" : "kpi-negative";
    kpiSignificance.textContent = "Directional";
    kpiUsers.textContent = totalUsers.toLocaleString();
    kpiGuardrails.textContent = "Activation/Retention Focus";
    kpiGuardrails.className = "kpi-positive";
    kpiRecommendation.textContent = lift > 2 ? "Likely Ship" : lift < -2 ? "Iterate" : "Wait";
  }

  function weightedAverageFromCohorts(cohortMap, dayIndex) {
    const rows = Object.values(cohortMap || {});
    let numerator = 0;
    let denominator = 0;
    rows.forEach((row) => {
      const users = Number((row && row.usersCount) || 0);
      const value = row && Array.isArray(row.days) ? row.days[dayIndex] : null;
      if (!users || value === null || Number.isNaN(Number(value))) return;
      numerator += Number(value) * users;
      denominator += users;
    });
    return denominator ? Number((numerator / denominator).toFixed(2)) : 0;
  }

  function mapSnapshotRowsToCohortModel(rows, dateKeys, snapshotDate) {
    const empty = initVariantMatrix(dateKeys);
    (Array.isArray(rows) ? rows : []).forEach((row) => {
      const variant = String((row && row.variant) || "").trim().toLowerCase();
      const cohortDate = toDateKey(row && row.cohort_date);
      if (!["control", "test"].includes(variant)) return;
      if (!cohortDate || !empty[variant][cohortDate]) return;

      const mapped = empty[variant][cohortDate];
      mapped.usersCount = Number((row && row.users_count) || 0);
      const rawDays = [
        Number((row && row.d0) || 0),
        Number((row && row.d1) || 0),
        Number((row && row.d2) || 0),
        Number((row && row.d3) || 0),
        Number((row && row.d4) || 0),
        Number((row && row.d5) || 0),
        Number((row && row.d6) || 0),
        Number((row && row.d7) || 0)
      ];

      const safeSnapshotDate = toDateKey(snapshotDate) || getTodayKey();
      mapped.days = rawDays.map((value, dayIndex) => {
        // A cohort day is valid only after that day has elapsed by snapshot date.
        const matured = addDays(cohortDate, dayIndex) <= safeSnapshotDate;
        return matured ? value : null;
      });
    });

    return empty;
  }

  async function loadPrecomputedCohortAnalytics(experimentId) {
    if (!supabaseClient || !experimentId) return null;

    const { data: latestSnapshotRows, error: latestSnapshotError } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENT_COHORT_DAILY_TABLE)
      .select("snapshot_date")
      .eq("experiment_id", experimentId)
      .order("snapshot_date", { ascending: false })
      .limit(1);

    if (latestSnapshotError) {
      throw new Error(`Snapshot lookup failed for experiment ${experimentId}: ${latestSnapshotError.message}`);
    }

    const latestSnapshotDate = Array.isArray(latestSnapshotRows) && latestSnapshotRows.length
      ? toDateKey(latestSnapshotRows[0].snapshot_date)
      : "";
    if (!latestSnapshotDate) {
      return null;
    }
    const dateKeys = getLast7DateKeysFromBase(latestSnapshotDate);

    const { data, error } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENT_COHORT_DAILY_TABLE)
      .select("snapshot_date,metric_type,variant,cohort_date,users_count,d0,d1,d2,d3,d4,d5,d6,d7")
      .eq("experiment_id", experimentId)
      .eq("snapshot_date", latestSnapshotDate)
      .order("cohort_date", { ascending: true });

    if (error) {
      throw new Error(`Snapshot read failed for experiment ${experimentId}: ${error.message}`);
    }

    const rowsInWindow = (Array.isArray(data) ? data : []).filter((row) => {
      const key = toDateKey(row && row.cohort_date);
      return key && dateKeys.includes(key);
    });

    const activationRows = rowsInWindow.filter(
      (row) => String((row && row.metric_type) || "").trim().toLowerCase() === "activation"
    );
    const retentionRows = rowsInWindow.filter(
      (row) => String((row && row.metric_type) || "").trim().toLowerCase() === "retention"
    );

    const activationCohorts = mapSnapshotRowsToCohortModel(activationRows, dateKeys, latestSnapshotDate);
    const retentionCohorts = mapSnapshotRowsToCohortModel(retentionRows, dateKeys, latestSnapshotDate);

    const activationChart = {
      control: [0, 1, 2, 3, 4, 5, 6, 7].map((day) => weightedAverageFromCohorts(activationCohorts.control, day)),
      test: [0, 1, 2, 3, 4, 5, 6, 7].map((day) => weightedAverageFromCohorts(activationCohorts.test, day))
    };
    const retentionChart = {
      control: [0, 1, 2, 3, 4, 5, 6, 7].map((day) => weightedAverageFromCohorts(retentionCohorts.control, day)),
      test: [0, 1, 2, 3, 4, 5, 6, 7].map((day) => weightedAverageFromCohorts(retentionCohorts.test, day))
    };

    const totalAssignedUsers =
      Object.values(activationCohorts.control).reduce((sum, row) => sum + Number((row && row.usersCount) || 0), 0) +
      Object.values(activationCohorts.test).reduce((sum, row) => sum + Number((row && row.usersCount) || 0), 0);

    const hasAnyUsers = totalAssignedUsers > 0;
    return {
      experimentId,
      snapshotDate: latestSnapshotDate,
      dateKeys,
      totalAssignedUsers,
      activation: {
        cohorts: activationCohorts,
        chartDays: [0, 1, 2, 3, 4, 5, 6, 7],
        chart: activationChart
      },
      retention: {
        cohorts: retentionCohorts,
        chartDays: [0, 1, 2, 3, 4, 5, 6, 7],
        chart: retentionChart
      },
      isEmpty: !hasAnyUsers
    };
  }

  function updateAnalyticsPresentation() {
    if (!currentAnalyticsData) return;
    const mode = getAnalyticsViewMode();
    const isActivation = mode.startsWith("activation");
    const isChart = mode.endsWith("chart");
    const hasExposure = Number(currentAnalyticsData.totalAssignedUsers || 0) > 0;
    const source = isActivation ? currentAnalyticsData.activation : currentAnalyticsData.retention;
    const dayLabels = source.chartDays.map((day) => `D${day}`);

    if (analyticsNoData) {
      analyticsNoData.hidden = hasExposure;
      if (!hasExposure) {
        analyticsNoData.textContent = "We’re collecting data. Check back after the experiment starts.";
      }
    }

    if (!hasExposure) {
      if (analyticsChartCard) analyticsChartCard.style.display = "none";
      if (analyticsTablesCard) analyticsTablesCard.style.display = "none";
      destroyTrendChart();
      return;
    }

    if (analyticsChartCard) analyticsChartCard.style.display = isChart ? "block" : "none";
    if (analyticsTablesCard) analyticsTablesCard.style.display = isChart ? "none" : "block";

    if (isChart) {
      renderCohortChart(
        source.chart,
        isActivation ? "Activation Trend (D0-D7)" : "Retention Trend (D0-D7)",
        dayLabels
      );
    } else {
      destroyTrendChart();
      if (analyticsTableTitle) {
        analyticsTableTitle.textContent = isActivation
          ? "Activation Cohorts (Last 7 Days)"
          : "Retention Cohorts (Last 7 Days)";
      }
      const controlScales = buildColumnScalesFromCohorts(source.cohorts.control, currentAnalyticsData.dateKeys);
      const testScales = buildColumnScalesFromCohorts(source.cohorts.test, currentAnalyticsData.dateKeys);
      const deltaScales = buildColumnScalesFromDelta(
        source.cohorts.control,
        source.cohorts.test,
        currentAnalyticsData.dateKeys
      );
      renderDeltaCohortRows(
        deltaCohortBody,
        source.cohorts.control,
        source.cohorts.test,
        currentAnalyticsData.dateKeys,
        deltaScales
      );
      renderCohortTableRows(
        controlCohortBody,
        source.cohorts.control,
        currentAnalyticsData.dateKeys,
        controlScales,
        "cohort-control-row"
      );
      renderCohortTableRows(
        testCohortBody,
        source.cohorts.test,
        currentAnalyticsData.dateKeys,
        testScales,
        "cohort-test-row"
      );
    }

    updateKpiStripForAnalytics(currentAnalyticsData, mode);
  }

  function toFilterOperatorEnglish(operator) {
    const op = String(operator || "").trim().toLowerCase();
    if (op === "is") return "is";
    if (op === "is not") return "is not";
    if (op === "contains") return "contains";
    if (op === "does not contain") return "does not contain";
    if (op === "starts with") return "starts with";
    if (op === "ends with") return "ends with";
    if (op === "greater than") return "is greater than";
    if (op === "less than") return "is less than";
    if (op === "exists") return "exists";
    return op || "is";
  }

  function buildFiltersSummaryTextForPdf(filters) {
    const builder = normalizeFilterBuilder(filters);
    const groups = Array.isArray(builder.groups) ? builder.groups : [];
    const validGroups = groups
      .map((group) => {
        const conditions = Array.isArray(group && group.conditions) ? group.conditions : [];
        const validConditions = conditions.filter((rule) => {
          const attribute = String((rule && rule.attribute) || "").trim();
          const operator = String((rule && rule.operator) || "").trim().toLowerCase();
          const value = String((rule && rule.value) || "").trim();
          return Boolean(attribute) && (operator === "exists" || Boolean(value));
        });
        return { conditions: validConditions };
      })
      .filter((group) => group.conditions.length > 0);

    if (!validGroups.length) return "No filters applied";

    const groupText = validGroups.map((group) => {
      const groupBody = group.conditions
        .map((rule) => {
          const attribute = String(rule.attribute || "").trim();
          const operator = toFilterOperatorEnglish(rule.operator);
          const value = String((rule && rule.value) || "").trim();
          return String(operator).toLowerCase() === "exists"
            ? `${attribute} exists`
            : `${attribute} ${operator} ${value}`;
        })
        .join(" OR ");
      return group.conditions.length > 1 ? `(${groupBody})` : groupBody;
    });

    return groupText.join(" AND ");
  }

  async function downloadAnalyticsAsPdf() {
    if (!window.html2canvas || !window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("PDF libraries are not loaded. Refresh the page and try again.");
    }

    const mode = getAnalyticsViewMode();
    const isChartView = mode.endsWith("chart");
    const sourceNode = isChartView ? analyticsChartCard : analyticsTablesCard;
    if (!sourceNode) {
      throw new Error("Analytics section is not available.");
    }

    const wasOverflow = sourceNode.style.overflow;
    sourceNode.style.overflow = "visible";
    let canvas = null;
    try {
      canvas = await window.html2canvas(sourceNode, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      });
    } finally {
      sourceNode.style.overflow = wasOverflow;
    }

    const allExperiments = getExperiments();
    const selectedExperiment =
      allExperiments.find((item) => Number(item.id) === Number(editingExperimentId)) || {};
    const experimentNameText = String(selectedExperiment.name || configForm.elements.experimentName.value || "Untitled Experiment").trim();
    const featureNameText = String(configForm.elements.featureName.value || (selectedExperiment.config && selectedExperiment.config.featureName) || "N/A").trim();
    const rolloutText = `${Number(configForm.elements.rollout.value || (selectedExperiment.config && selectedExperiment.config.rollout) || 0)}%`;
    const filtersSummaryText = buildFiltersSummaryTextForPdf(readFilterRules());

    const imageData = canvas.toDataURL("image/png");
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pageWidth - margin * 2;

    const drawLabeledValue = (label, value, x, y, maxWidth) => {
      const labelText = `${label} `;
      pdf.setFont("helvetica", "bold");
      pdf.text(labelText, x, y);
      const valueX = x + pdf.getTextWidth(labelText) + 1.5;
      pdf.setFont("helvetica", "normal");
      const valueLines = pdf.splitTextToSize(String(value || ""), Math.max(20, maxWidth - (valueX - x)));
      pdf.text(valueLines, valueX, y);
      return Math.max(1, valueLines.length);
    };

    let y = margin;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Experiment Summary", margin, y);
    y += 7;

    const leftColX = margin;
    const rightColX = margin + contentWidth / 2;
    pdf.setFontSize(10);
    const row1LeftLines = drawLabeledValue("Experiment Name:", experimentNameText, leftColX, y, contentWidth / 2 - 4);
    const row1RightLines = drawLabeledValue("Feature Name:", featureNameText, rightColX, y, contentWidth / 2 - 4);
    y += Math.max(row1LeftLines, row1RightLines) * 4.6 + 2.4;

    const row2LeftLines = drawLabeledValue("Rollout %:", rolloutText, leftColX, y, contentWidth / 2 - 4);
    const row2RightLines = drawLabeledValue("Filters Applied:", filtersSummaryText, rightColX, y, contentWidth / 2 - 4);
    y += Math.max(row2LeftLines, row2RightLines) * 4.6 + 2.4;

    y += 2;
    pdf.setDrawColor(226, 232, 240);
    pdf.line(margin, y, pageWidth - margin, y);
    y += 4;

    const imageWidth = contentWidth;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;
    const availableFirstPageHeight = pageHeight - y - margin;

    if (imageHeight <= availableFirstPageHeight) {
      pdf.addImage(imageData, "PNG", margin, y, imageWidth, imageHeight);
    } else {
      let heightLeft = imageHeight;
      let offsetY = y;
      pdf.addImage(imageData, "PNG", margin, offsetY, imageWidth, imageHeight);
      heightLeft -= availableFirstPageHeight;

      while (heightLeft > 0) {
        pdf.addPage();
        offsetY = margin - (imageHeight - heightLeft);
        pdf.addImage(imageData, "PNG", margin, offsetY, imageWidth, imageHeight);
        heightLeft -= pageHeight - margin * 2;
      }
    }

    const experimentName =
      String((allExperiments.find((item) => Number(item.id) === Number(editingExperimentId)) || {}).name || "experiment")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "experiment";
    const metricName = mode.startsWith("activation") ? "activation" : "retention";
    const formatName = isChartView ? "chart" : "table";
    const fileName = `${experimentName}-${metricName}-${formatName}.pdf`;
    pdf.save(fileName);
  }

  function buildValueControl(definition, currentValue, operator) {
    if (operator === "exists") {
      const input = document.createElement("input");
      input.type = "text";
      input.className = "rule-value";
      input.value = "";
      input.placeholder = "Not required";
      input.disabled = true;
      return input;
    }

    const dataType = String((definition && definition.dataType) || "").toLowerCase();

    if (dataType === "date") {
      const input = document.createElement("input");
      input.type = "date";
      input.className = "rule-value";
      input.value = currentValue || "";
      return input;
    }

    if (dataType === "datetime") {
      const input = document.createElement("input");
      input.type = "date";
      input.className = "rule-value";
      const current = String(currentValue || "").trim();
      input.value = current ? toDateKey(current) : "";
      return input;
    }

    if (dataType === "boolean") {
      const select = document.createElement("select");
      select.className = "rule-value";
      ["1", "0"].forEach((value) => {
        select.appendChild(createOption(value));
      });
      if (currentValue && ["1", "0"].includes(currentValue)) {
        select.value = currentValue;
      }
      return select;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.className = "rule-value";
    input.placeholder = "Type value here...";
    input.value = currentValue || "";
    if (dataType === "int") {
      input.setAttribute("inputmode", "numeric");
    } else if (dataType === "float") {
      input.setAttribute("inputmode", "decimal");
    } else {
      input.setAttribute("inputmode", "text");
    }
    return input;
  }

  function buildConditionRow(condition, groupIndex, conditionIndex) {
    const row = document.createElement("div");
    row.className = "filter-condition-row";
    row.dataset.groupIndex = String(groupIndex);
    row.dataset.conditionIndex = String(conditionIndex);

    const attrWrap = document.createElement("label");
    attrWrap.className = "rule-field";
    attrWrap.textContent = "Attribute";

    const attrSelect = document.createElement("select");
    attrSelect.className = "rule-attribute";
    attrSelect.appendChild(createOption("", "Select attribute"));
    filterDefinitions.forEach((definition) => {
      attrSelect.appendChild(createOption(definition.name));
    });
    if (
      condition.attribute &&
      !filterDefinitions.some((definition) => String(definition.name).trim() === String(condition.attribute).trim())
    ) {
      attrSelect.appendChild(createOption(condition.attribute));
    }
    attrSelect.value = condition.attribute || "";
    attrWrap.appendChild(attrSelect);

    const opWrap = document.createElement("label");
    opWrap.className = "rule-field";
    opWrap.textContent = "Operator";

    const opSelect = document.createElement("select");
    opSelect.className = "rule-operator";
    OPERATORS.forEach((op) => opSelect.appendChild(createOption(op)));
    opSelect.value = condition.operator && OPERATORS.includes(condition.operator) ? condition.operator : "is";
    opWrap.appendChild(opSelect);

    const valueWrap = document.createElement("label");
    valueWrap.className = "rule-field rule-field-value";
    valueWrap.textContent = "Value";

    const valueHost = document.createElement("div");
    valueHost.className = "rule-value-host";
    valueWrap.appendChild(valueHost);

    const actionWrap = document.createElement("div");
    actionWrap.className = "rule-action-wrap";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-rule-btn";
    deleteBtn.setAttribute("aria-label", "Delete rule");
    deleteBtn.title = "Delete rule";
    deleteBtn.innerHTML = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 3h6l1 2h4v2H4V5h4l1-2zM7 9h2v9H7V9zm4 0h2v9h-2V9zm4 0h2v9h-2V9z"></path>
      </svg>
    `;

    function renderValueInput(preserveCurrentValue) {
      const currentInput = valueHost.querySelector(".rule-value");
      const previousValue = preserveCurrentValue ? (currentInput ? currentInput.value : condition.value || "") : "";
      const definition = getDefinition(attrSelect.value);

      valueHost.innerHTML = "";
      valueHost.appendChild(buildValueControl(definition, previousValue, opSelect.value));
    }

    attrSelect.addEventListener("change", () => renderValueInput(false));
    opSelect.addEventListener("change", () => renderValueInput(true));

    if (conditionIndex > 0) {
      deleteBtn.addEventListener("click", () => {
        const state = readFilterRules();
        const group = state.groups[groupIndex];
        if (!group) return;

        group.conditions.splice(conditionIndex, 1);
        if (!group.conditions.length) {
          state.groups.splice(groupIndex, 1);
        }

        if (!state.groups.length) {
          state.groups = [createEmptyGroup()];
          state.connectors = [];
        } else {
          state.connectors = Array.from({ length: Math.max(state.groups.length - 1, 0) }, () => "AND");
        }

        setFilterRules(state);
      });
      actionWrap.appendChild(deleteBtn);
    }

    row.appendChild(attrWrap);
    row.appendChild(opWrap);
    row.appendChild(valueWrap);
    row.appendChild(actionWrap);

    row.__attrSelect = attrSelect;
    row.__refreshValue = renderValueInput;

    renderValueInput(true);
    return row;
  }

  function buildGroupCard(group, groupIndex, totalGroups) {
    const card = document.createElement("div");
    card.className = "filter-group-card";
    card.dataset.groupIndex = String(groupIndex);

    const head = document.createElement("div");
    head.className = "filter-group-head";

    const badge = document.createElement("span");
    badge.className = "filter-group-badge";
    badge.textContent = toGroupLabel(groupIndex);
    head.appendChild(badge);

    const title = document.createElement("p");
    title.className = "filter-group-title";
    title.textContent = `Group ${toGroupLabel(groupIndex)}`;
    head.appendChild(title);

    const deleteGroupBtn = document.createElement("button");
    deleteGroupBtn.type = "button";
    deleteGroupBtn.className = "filter-group-delete";
    deleteGroupBtn.textContent = "Remove Group";
    deleteGroupBtn.style.visibility = totalGroups > 1 ? "visible" : "hidden";
    deleteGroupBtn.addEventListener("click", () => {
      const state = readFilterRules();
      state.groups.splice(groupIndex, 1);
      if (!state.groups.length) {
        state.groups = [createEmptyGroup()];
      }
      state.connectors = Array.from({ length: Math.max(state.groups.length - 1, 0) }, () => "AND");
      setFilterRules(state);
    });
    head.appendChild(deleteGroupBtn);

    const conditionsWrap = document.createElement("div");
    conditionsWrap.className = "filter-group-conditions";

    const conditions = Array.isArray(group.conditions) && group.conditions.length ? group.conditions : [createEmptyCondition()];
    conditions.forEach((condition, conditionIndex) => {
      conditionsWrap.appendChild(buildConditionRow(condition, groupIndex, conditionIndex));
      if (conditionIndex < conditions.length - 1) {
        const internalOr = document.createElement("div");
        internalOr.className = "group-internal-or";
        internalOr.textContent = "OR";
        conditionsWrap.appendChild(internalOr);
      }
    });

    const addOrBtn = document.createElement("button");
    addOrBtn.type = "button";
    addOrBtn.className = "group-or-btn";
    addOrBtn.textContent = "+ OR";
    addOrBtn.addEventListener("click", () => {
      const state = readFilterRules();
      if (!state.groups[groupIndex]) return;
      state.groups[groupIndex].conditions.push(createEmptyCondition());
      setFilterRules(state);
    });

    card.appendChild(head);
    card.appendChild(conditionsWrap);
    card.appendChild(addOrBtn);
    return card;
  }

  function buildConnectorRow() {
    const connector = document.createElement("div");
    connector.className = "filter-group-connector";
    const pill = document.createElement("span");
    pill.className = "group-connector-pill";
    pill.textContent = "AND";
    connector.appendChild(pill);
    return connector;
  }

  function renderFilterBuilder(builderState) {
    const state = normalizeFilterBuilder(builderState);
    filterRulesContainer.innerHTML = "";

    state.groups.forEach((group, groupIndex) => {
      filterRulesContainer.appendChild(buildGroupCard(group, groupIndex, state.groups.length));
      if (groupIndex < state.groups.length - 1) {
        filterRulesContainer.appendChild(buildConnectorRow());
      }
    });
  }

  function addFilterRule() {
    const state = readFilterRules();
    state.groups.push(createEmptyGroup());
    state.connectors.push("AND");
    setFilterRules(state);
  }

  function setFilterRules(rules) {
    renderFilterBuilder(rules);
  }

  function readFilterRules() {
    const groupCards = Array.from(filterRulesContainer.querySelectorAll(".filter-group-card"));
    const groups = groupCards.map((groupCard) => {
      const conditionRows = Array.from(groupCard.querySelectorAll(".filter-condition-row"));
      const conditions = conditionRows.map((row) => {
        const attribute = row.querySelector(".rule-attribute").value;
        const operator = row.querySelector(".rule-operator").value;
        const valueControl = row.querySelector(".rule-value");
        const value = valueControl && !valueControl.disabled ? valueControl.value.trim() : "";
        return normalizeCondition({ attribute, operator, value });
      });
      return { conditions: conditions.length ? conditions : [createEmptyCondition()] };
    });

    const connectors = Array.from({ length: Math.max(groups.length - 1, 0) }, () => "AND");

    return normalizeFilterBuilder({ groups, connectors });
  }

  function refreshRuleAttributes() {
    const rows = Array.from(filterRulesContainer.querySelectorAll(".filter-condition-row"));

    rows.forEach((row) => {
      const select = row.__attrSelect;
      if (!select) return;

      const current = select.value;
      select.innerHTML = "";
      select.appendChild(createOption("", "Select attribute"));
      filterDefinitions.forEach((definition) => {
        select.appendChild(createOption(definition.name));
      });
      if (current && !filterDefinitions.some((d) => d.name === current)) {
        select.appendChild(createOption(current));
      }
      select.value = current || "";

      if (typeof row.__refreshValue === "function") {
        row.__refreshValue(true);
      }
    });
  }

  function defaultFormPayload() {
    return {
      name: "",
      featureName: "",
      rollout: 50,
      scheduleAt: "",
      filters: []
    };
  }

  function setFeatureNameValue(value) {
    const featureSelect = configForm.elements.featureName;
    if (!featureSelect) return;

    const normalized = String(value || "").trim();
    const optionValues = Array.from(featureSelect.options).map((option) => option.value);
    featureSelect.value = optionValues.includes(normalized) ? normalized : "";
  }

  function setFeatureOptions(options) {
    const featureSelect = configForm.elements.featureName;
    if (!featureSelect) return;

    const selectedBefore = String(featureSelect.value || "").trim();
    featureSelect.innerHTML = "";
    featureSelect.appendChild(createOption("", "Select feature"));

    options.forEach((optionValue) => {
      featureSelect.appendChild(createOption(optionValue));
    });

    if (selectedBefore) {
      setFeatureNameValue(selectedBefore);
    }
  }

  function isValidUuid(value) {
    // Accept any canonical UUID version (including v7) in 8-4-4-4-12 format.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(String(value || "").trim());
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function updateTestInputPlaceholder() {
    if (!testUserIdInput) return;
    const mode = String((testTargetType && testTargetType.value) || "user_id");
    testUserIdInput.placeholder = mode === "email" ? "Enter user email address" : "Enter User ID (UUID)";
  }

  function setTestMessage(text, type) {
    if (!testMessage) return;
    testMessage.textContent = text || "";
    testMessage.classList.remove("success", "error");
    if (type === "success" || type === "error") {
      testMessage.classList.add(type);
    }
  }

  function setAudienceCountLoading(isLoading) {
    if (viewCountBtn) {
      viewCountBtn.disabled = isLoading;
      viewCountBtn.textContent = isLoading ? "Calculating..." : "🔍 View Count";
    }
    if (countSpinner) {
      countSpinner.classList.toggle("is-visible", isLoading);
    }
  }

  function setAudienceCountLabel(value) {
    if (!audienceCountLabel) return;
    audienceCountLabel.textContent = value;
  }

  async function resolveCurrentUserId() {
    if (!currentUser) return "";
    const directId = String(currentUser.userId || currentUser.id || "").trim();
    if (directId) return directId;

    if (!supabaseClient || !currentUser.email) return "";
    try {
      const { data, error } = await supabaseClient
        .from(SUPABASE_USER_PROFILES_TABLE)
        .select("id")
        .eq("email", String(currentUser.email).toLowerCase())
        .limit(1)
        .maybeSingle();
      if (error || !data) return "";
      const resolvedId = String(data.id || "").trim();
      if (!resolvedId) return "";
      currentUser.userId = resolvedId;
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(currentUser));
      return resolvedId;
    } catch (_error) {
      return "";
    }
  }

  async function fetchOwnedExperimentStats(ownerId) {
    const ownerEmail = String((currentUser && currentUser.email) || "").trim().toLowerCase();
    const ownerCandidates = [String(ownerId || "").trim(), ownerEmail].filter(Boolean);
    const ownerValues = Array.from(new Set(ownerCandidates));

    if (!supabaseClient || !ownerValues.length) {
      return { experimentsRun: 0, activeTests: 0 };
    }

    const { count: totalCount, error: totalError } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENTS_TABLE)
      .select("experiment_id", { head: true, count: "exact" })
      .in("created_by", ownerValues);

    if (totalError) {
      throw totalError;
    }

    const { count: runningCount, error: runningError } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENTS_TABLE)
      .select("experiment_id", { head: true, count: "exact" })
      .in("created_by", ownerValues)
      .eq("status", "Running");

    if (runningError) {
      throw runningError;
    }

    return {
      experimentsRun: Number(totalCount || 0),
      activeTests: Number(runningCount || 0)
    };
  }

  async function renderProfileView() {
    if (!currentUser) return;

    const fullName = String(currentUser.fullName || currentUser.name || "").trim() || "User";
    const roleText = String(currentUser.profileRole || "").trim() || "Role not specified";
    const teamText = String(currentUser.team || "").trim() || "Team not assigned";
    let experimentsRun = 0;
    let activeTests = 0;

    try {
      const ownerId = await resolveCurrentUserId();
      const counts = await fetchOwnedExperimentStats(ownerId);
      experimentsRun = counts.experimentsRun;
      activeTests = counts.activeTests;
    } catch (_error) {
      experimentsRun = 0;
      activeTests = 0;
    }

    if (profileNameEl) profileNameEl.textContent = fullName;
    if (profileRoleEl) profileRoleEl.textContent = roleText;
    if (profileTeamEl) profileTeamEl.textContent = teamText;
    if (profileEmailEl) profileEmailEl.textContent = String(currentUser.email || "");
    if (profileExperimentsRunEl) profileExperimentsRunEl.textContent = String(experimentsRun);
    if (profileActiveTestsEl) profileActiveTestsEl.textContent = String(activeTests);
  }

  async function loadUserProfileFromSupabase(email) {
    if (!supabaseClient || !email) return null;
    try {
      const { data, error } = await supabaseClient
        .from(SUPABASE_USER_PROFILES_TABLE)
        .select("id,email,full_name,role,team")
        .eq("email", String(email).toLowerCase())
        .limit(1)
        .maybeSingle();
      if (error) return null;
      return data || null;
    } catch (_error) {
      return null;
    }
  }

  async function saveUserProfileToSupabase(profile) {
    if (!supabaseClient || !profile || !profile.email) return;
    try {
      await supabaseClient.from(SUPABASE_USER_PROFILES_TABLE).upsert(
        {
          email: String(profile.email || "").toLowerCase(),
          full_name: String(profile.fullName || "").trim(),
          role: String(profile.profileRole || "").trim() || null,
          team: String(profile.team || "").trim() || null
        },
        { onConflict: "email" }
      );
    } catch (_error) {
      // optional sync; ignore failures for now
    }
  }

  function safeStringify(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch (_error) {
      return String(value);
    }
  }

  function showOneRunFilterDebug(payload) {
    // Debug panel is disabled in production UI.
    if (!filterDebugPanel) return;
    filterDebugPanel.style.display = "none";
    filterDebugPanel.textContent = "";
  }

  function getOnboardingColumnName(attributeName) {
    const normalized = String(attributeName || "")
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_");
    return normalized;
  }

  function parseRuleValueForQuery(definition, rawValue) {
    const dataType = String((definition && definition.dataType) || "string").toLowerCase();
    const value = String(rawValue || "").trim();

    if (dataType === "boolean") {
      const bool = normalizeBoolean(value);
      if (bool === null) {
        throw new Error(`Invalid boolean value "${value}"`);
      }
      return bool;
    }

    if (dataType === "int" || dataType === "float") {
      const num = Number(value);
      if (Number.isNaN(num)) {
        throw new Error(`Invalid numeric value "${value}"`);
      }
      return num;
    }

    if (dataType === "datetime") {
      if (!value) return value;
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return `${value}T00:00:00`;
      }
      return value;
    }

    return value;
  }

  function applyRuleToAudienceQuery(query, rule) {
    const column = getOnboardingColumnName(rule.attribute);
    if (!column) return query;

    const operator = String(rule.operator || "is").toLowerCase();
    const definition = getDefinition(rule.attribute);

    if (operator === "exists") {
      return query.not(column, "is", null);
    }

    const rawValue = String(rule.value || "").trim();
    if (!rawValue) {
      return query;
    }

    const parsedValue = parseRuleValueForQuery(definition, rawValue);

    if (operator === "is") return query.eq(column, parsedValue);
    if (operator === "is not") return query.neq(column, parsedValue);
    if (operator === "contains") return query.ilike(column, `%${String(parsedValue)}%`);
    if (operator === "does not contain") return query.not(column, "ilike", `%${String(parsedValue)}%`);
    if (operator === "starts with") return query.ilike(column, `${String(parsedValue)}%`);
    if (operator === "ends with") return query.ilike(column, `%${String(parsedValue)}`);
    if (operator === "greater than") return query.gt(column, parsedValue);
    if (operator === "less than") return query.lt(column, parsedValue);

    return query;
  }

  function getActiveFilterRules(filters) {
    const builder = normalizeFilterBuilder(filters);
    const groups = Array.isArray(builder && builder.groups) ? builder.groups : [];
    const activeRules = [];

    groups.forEach((group) => {
      const conditions = Array.isArray(group && group.conditions) ? group.conditions : [];
      const activeConditions = conditions.map((rule) => normalizeCondition(rule)).filter((rule) => rule.attribute);
      if (activeConditions.length === 1) {
        activeRules.push(activeConditions[0]);
      } else if (activeConditions.length > 1) {
        // Group OR logic cannot be represented with current simple chaining; force fallback.
        activeRules.push(null);
      }
    });

    return activeRules;
  }

  function canUseServerFilterPath(filters) {
    const activeRules = getActiveFilterRules(filters);
    if (!activeRules.length) return true;
    return activeRules.every((rule) => !!rule);
  }

  async function fetchCandidateUserIdsServerSide(filters) {
    if (!supabaseClient) throw new Error("Supabase client is not available");
    const activeRules = getActiveFilterRules(filters).filter(Boolean);
    const chunkSize = 1000;
    let from = 0;
    const rows = [];

    while (true) {
      let query = supabaseClient.from(SUPABASE_ONBOARDING_TABLE).select("user_id").range(from, from + chunkSize - 1);
      activeRules.forEach((rule) => {
        query = applyRuleToAudienceQuery(query, rule);
      });

      const { data, error } = await query;
      if (error) throw error;
      const page = Array.isArray(data) ? data : [];
      rows.push(...page);
      if (page.length < chunkSize) break;
      from += chunkSize;
    }

    const candidateUserIds = [];
    rows.forEach((row) => {
      const userId = String((row && row.user_id) || "").trim();
      if (isValidUuid(userId)) candidateUserIds.push(userId);
    });

    return {
      onboardingCount: rows.length,
      filteredCount: rows.length,
      validUserIdCount: candidateUserIds.length,
      skippedInvalidUserIdCount: Math.max(rows.length - candidateUserIds.length, 0),
      candidateUserIds
    };
  }

  async function fetchCandidateUserIdsFromOnboarding(filters) {
    if (!supabaseClient) throw new Error("Supabase client is not available");

    const onboardingRows = await fetchAllOnboardingRows(getOnboardingSelectColumns(filters));
    const filteredRows = applyFilterRules(onboardingRows, filters);
    const userIds = new Set();

    filteredRows.forEach((row) => {
      const candidate = String((row && row.user_id) || "").trim();
      if (isValidUuid(candidate)) {
        userIds.add(candidate);
      }
    });

    return Array.from(userIds);
  }

  async function calculateTargetAudienceCount() {
    if (!supabaseClient) {
      setAudienceCountLabel("Target Audience: -- users");
      setTestMessage("Supabase client is not available in this page.", "error");
      return;
    }

    const featureDisplayName = String(configForm.elements.featureName.value || "").trim();
    const featureKey = featureKeyByDisplayName.get(featureDisplayName);
    if (!featureDisplayName || !featureKey) {
      setAudienceCountLabel("Target Audience: -- users");
      setTestMessage("Please select a valid Feature Name to estimate rollout audience.", "error");
      return;
    }

    const rollout = Number(configForm.elements.rollout.value || 0);
    const filters = readFilterRules();
    setAudienceCountLoading(true);
    setTestMessage("", null);

    try {
      const candidateUserIds = await fetchCandidateUserIdsFromOnboarding(filters);
      let enabledCount = 0;

      for (const userId of candidateUserIds) {
        const bucket = calculateRolloutBucket(userId, featureKey, editingExperimentId || "preview");
        if (bucket < rollout) enabledCount += 1;
      }

      setAudienceCountLabel(`Target Audience: ${enabledCount.toLocaleString()} users`);
    } catch (error) {
      setAudienceCountLabel("Target Audience: -- users");
      setTestMessage(`Unable to calculate audience: ${error.message || "Unknown error"}`, "error");
    } finally {
      setAudienceCountLoading(false);
    }
  }

  async function resolveUserIdFromEmail(emailInput) {
    const normalizedEmail = String(emailInput || "").trim().toLowerCase();
    const emailColumns = ["email", "email_id", "emailid", "user_email", "mail"];

    for (const column of emailColumns) {
      const { data, error } = await supabaseClient
        .from(SUPABASE_ONBOARDING_TABLE)
        .select("user_id,uuid,id")
        .ilike(column, normalizedEmail)
        .limit(1);

      if (error) {
        if (/column/i.test(String(error.message || "")) && /does not exist/i.test(String(error.message || ""))) {
          continue;
        }
        throw error;
      }

      const row = Array.isArray(data) && data.length ? data[0] : null;
      if (!row) continue;

      const candidateId = String((row.user_id || row.uuid || row.id) || "").trim();
      if (!isValidUuid(candidateId)) {
        continue;
      }
      return candidateId;
    }

    // Fallback: scan rows and match against any email-like column name.
    const { data: scanRows, error: scanError } = await supabaseClient.from(SUPABASE_ONBOARDING_TABLE).select("*").limit(5000);
    if (scanError) {
      throw scanError;
    }

    const rows = Array.isArray(scanRows) ? scanRows : [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const keys = Object.keys(row).filter((key) => key.toLowerCase().includes("email"));
      const isMatch = keys.some((key) => String(row[key] || "").trim().toLowerCase() === normalizedEmail);
      if (!isMatch) continue;

      const candidateId = String((row.user_id || row.uuid || row.id) || "").trim();
      if (isValidUuid(candidateId)) {
        return candidateId;
      }
    }

    throw new Error("Error: No user found with this email address.");
  }

  async function testManualFeatureOverride() {
    const rawInput = String((testUserIdInput && testUserIdInput.value) || "").trim();
    const mode = String((testTargetType && testTargetType.value) || "user_id");
    const featureDisplayName = String(configForm.elements.featureName.value || "").trim();
    const featureKey = featureKeyByDisplayName.get(featureDisplayName);

    if (!featureDisplayName) {
      setTestMessage("Please select a Feature Name before testing.", "error");
      return;
    }

    if (!featureKey) {
      setTestMessage("Unable to resolve feature key for selected feature.", "error");
      return;
    }

    if (!supabaseClient) {
      setTestMessage("Supabase client is not available in this page.", "error");
      return;
    }

    if (!rawInput) {
      setTestMessage(mode === "email" ? "Please enter a valid email address." : "Please enter a valid UUID.", "error");
      return;
    }

    let userId = rawInput;
    if (mode === "email") {
      if (!isValidEmail(rawInput)) {
        setTestMessage("Please enter a valid email address.", "error");
        return;
      }

      try {
        userId = await resolveUserIdFromEmail(rawInput);
      } catch (error) {
        setTestMessage(error.message || "Error: No user found with this email address.", "error");
        return;
      }
    } else if (!isValidUuid(rawInput)) {
      setTestMessage("Please enter a valid UUID.", "error");
      return;
    }

    const { error } = await supabaseClient.from(SUPABASE_USER_FEATURES_TABLE).upsert(
      {
        user_id: userId,
        feature_key: featureKey,
        is_enabled: true
      },
      { onConflict: "user_id,feature_key" }
    );

    if (error) {
      setTestMessage(`Unable to enable feature: ${error.message}`, "error");
      return;
    }

    if (testUserIdInput) {
      testUserIdInput.value = "";
    }
    setTestMessage(`Success! Feature ${featureKey} is now live for user: ${rawInput}`, "success");
  }

  function getRowValueForAttribute(row, attributeName) {
    if (!row || typeof row !== "object") return undefined;
    const exact = row[attributeName];
    if (typeof exact !== "undefined") return exact;

    const normalized = String(attributeName || "")
      .trim()
      .toLowerCase()
      .replaceAll(" ", "_");

    if (!normalized) return undefined;

    if (typeof row[normalized] !== "undefined") return row[normalized];
    const matchingKey = Object.keys(row).find((key) => key.toLowerCase() === normalized);
    return matchingKey ? row[matchingKey] : undefined;
  }

  function normalizeBoolean(value) {
    const raw = String(value || "").trim().toLowerCase();
    if (["1", "true", "t", "yes", "y"].includes(raw)) return true;
    if (["0", "false", "f", "no", "n"].includes(raw)) return false;
    return null;
  }

  function toComparableValue(value, dataType) {
    if (value === null || typeof value === "undefined") return null;
    const type = String(dataType || "").toLowerCase();

    if (type === "int" || type === "float") {
      const num = Number(value);
      return Number.isNaN(num) ? null : num;
    }

    if (type === "date" || type === "datetime") {
      let normalized = value;
      if (type === "datetime" && /^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        normalized = `${value}T00:00:00`;
      }
      const ts = new Date(normalized).getTime();
      return Number.isNaN(ts) ? null : ts;
    }

    return String(value).toLowerCase();
  }

  function evaluateFilterRule(row, rule) {
    const definition = getDefinition(rule.attribute);
    const dataType = definition ? definition.dataType : "string";
    const rowValue = getRowValueForAttribute(row, rule.attribute);
    const operator = String(rule.operator || "is").toLowerCase();
    const rawRuleValue = String(rule.value || "").trim();

    if (operator === "exists") {
      return typeof rowValue !== "undefined" && rowValue !== null && String(rowValue).trim() !== "";
    }

    if (dataType === "boolean") {
      const rowBool = normalizeBoolean(rowValue);
      const ruleBool = normalizeBoolean(rawRuleValue);
      if (rowBool === null || ruleBool === null) return false;
      if (operator === "is") return rowBool === ruleBool;
      if (operator === "is not") return rowBool !== ruleBool;
      return false;
    }

    const left = toComparableValue(rowValue, dataType);
    const right = toComparableValue(rawRuleValue, dataType);
    if (left === null || right === null) return false;

    if (operator === "is") return left === right;
    if (operator === "is not") return left !== right;

    if (operator === "contains") return String(left).includes(String(right));
    if (operator === "does not contain") return !String(left).includes(String(right));
    if (operator === "starts with") return String(left).startsWith(String(right));
    if (operator === "ends with") return String(left).endsWith(String(right));
    if (operator === "greater than") return Number(left) > Number(right);
    if (operator === "less than") return Number(left) < Number(right);

    return false;
  }

  function evaluateFilterGroup(row, group) {
    const conditions = Array.isArray(group && group.conditions) ? group.conditions.map((rule) => normalizeCondition(rule)) : [];
    const activeConditions = conditions.filter((rule) => rule.attribute);
    if (!activeConditions.length) return true;
    return activeConditions.some((rule) => evaluateFilterRule(row, rule));
  }

  function groupHasActiveConditions(group) {
    return Array.isArray(group && group.conditions) && group.conditions.some((rule) => String(rule.attribute || "").trim() !== "");
  }

  function hasActiveFilters(builder) {
    const groups = Array.isArray(builder && builder.groups) ? builder.groups : [];
    return groups.some((group) => groupHasActiveConditions(group));
  }

  function applyFilterRules(rows, filters) {
    const builder = normalizeFilterBuilder(filters);
    if (!hasActiveFilters(builder)) return rows;

    const groups = Array.isArray(builder.groups) ? builder.groups : [];
    const activeIndices = groups
      .map((group, index) => (groupHasActiveConditions(group) ? index : -1))
      .filter((index) => index >= 0);
    if (!activeIndices.length) return rows;

    return rows.filter((row) => {
      let result = evaluateFilterGroup(row, groups[activeIndices[0]]);
      for (let i = 1; i < activeIndices.length; i += 1) {
        const index = activeIndices[i];
        const connector = String(builder.connectors[index - 1] || "AND").toUpperCase();
        const nextResult = evaluateFilterGroup(row, groups[index]);
        result = connector === "OR" ? result || nextResult : result && nextResult;
      }
      return result;
    });
  }

  function fastDeterministicBucket(seedText) {
    // Deterministic bucketing:
    // identical seed -> identical bucket, so users stay stable across reruns.
    // FNV-1a 32-bit keeps this fast enough for large client-side loops.
    let hash = 2166136261;
    const text = String(seedText || "");
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 100;
  }

  function calculateRolloutBucket(userId, featureKey, experimentId) {
    const salted = `${userId}_${featureKey || experimentId}`;
    return fastDeterministicBucket(salted);
  }

  function getOnboardingSelectColumns(filters) {
    const columns = new Set(["user_id"]);
    const builder = normalizeFilterBuilder(filters);
    const groups = Array.isArray(builder && builder.groups) ? builder.groups : [];
    groups.forEach((group) => {
      const conditions = Array.isArray(group && group.conditions) ? group.conditions : [];
      conditions.forEach((rule) => {
        const normalizedRule = normalizeCondition(rule);
        if (!normalizedRule.attribute) return;
        const column = getOnboardingColumnName(normalizedRule.attribute);
        if (column) columns.add(column);
      });
    });
    return Array.from(columns);
  }

  async function fetchAllOnboardingRows(selectColumns) {
    if (!supabaseClient) throw new Error("Supabase client is not available");

    const pageSize = 1000;
    let from = 0;
    const collected = [];
    const hasExplicitColumns = Array.isArray(selectColumns) && selectColumns.length > 0;
    const selectClause = hasExplicitColumns ? selectColumns.join(",") : "*";
    let didFallbackToAll = false;

    while (true) {
      const { data, error } = await supabaseClient
        .from(SUPABASE_ONBOARDING_TABLE)
        .select(didFallbackToAll ? "*" : selectClause)
        .range(from, from + pageSize - 1);
      if (error) {
        const isMissingColumnError =
          hasExplicitColumns &&
          !didFallbackToAll &&
          /column/i.test(String(error.message || "")) &&
          /does not exist/i.test(String(error.message || ""));
        if (isMissingColumnError) {
          didFallbackToAll = true;
          from = 0;
          collected.length = 0;
          continue;
        }
        throw error;
      }

      const rows = Array.isArray(data) ? data : [];
      collected.push(...rows);
      if (rows.length < pageSize) break;
      from += pageSize;
    }

    return collected;
  }

  async function upsertUserFeatures(records) {
    if (!records.length) return;
    const chunkSize = 2000;

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await supabaseClient.from(SUPABASE_USER_FEATURES_TABLE).upsert(chunk, {
        onConflict: "user_id,feature_key"
      });
      if (error) throw error;
    }
  }

  async function upsertExperimentAssignments(records) {
    if (!records.length) return;
    const chunkSize = 2000;

    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE)
        .insert(chunk, {
          onConflict: "user_id,experiment_id",
          ignoreDuplicates: true
        });
      if (error) {
        const { error: upsertError } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENT_ASSIGNMENTS_TABLE)
          .upsert(chunk, {
            onConflict: "user_id,experiment_id"
          });
        if (upsertError) throw upsertError;
      }
    }
  }

  function getDeterministicVariant(userId, experimentId) {
    const bucket = calculateRolloutBucket(userId, "variant", experimentId);
    return bucket < 50 ? "test" : "control";
  }

  async function insertExposureEventsForNewUsers(experimentId, assignmentRows) {
    if (!assignmentRows.length) return 0;
    const nowIso = new Date().toISOString();
    const exposureRows = assignmentRows.map((row) => ({
      user_id: row.user_id,
      experiment_id: experimentId,
      variant: row.variant,
      exposed_at: nowIso,
      exposure_source: "publish_rollout"
    }));

    const chunkSize = 2000;
    try {
      for (let i = 0; i < exposureRows.length; i += chunkSize) {
        const chunk = exposureRows.slice(i, i + chunkSize);
        const { error } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENT_EXPOSURES_TABLE)
          .insert(chunk, { onConflict: "user_id,experiment_id", ignoreDuplicates: true });
        if (error) throw error;
      }
    } catch (error) {
      const text = String((error && error.message) || "").toLowerCase();
      const hasConflictConfigIssue =
        text.includes("on conflict") || text.includes("unique") || text.includes("constraint");
      if (!hasConflictConfigIssue) throw error;

      // Fallback for environments where unique constraint isn't available for upsert conflict target.
      const { data: existing, error: existingError } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENT_EXPOSURES_TABLE)
        .select("user_id")
        .eq("experiment_id", experimentId);
      if (existingError) throw existingError;

      const existingUserIds = new Set((Array.isArray(existing) ? existing : []).map((row) => String(row.user_id || "").trim()));
      const newExposureRows = exposureRows.filter((row) => !existingUserIds.has(String(row.user_id || "").trim()));
      for (let i = 0; i < newExposureRows.length; i += chunkSize) {
        const chunk = newExposureRows.slice(i, i + chunkSize);
        const { error: insertError } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENT_EXPOSURES_TABLE)
          .insert(chunk);
        if (insertError) throw insertError;
      }
    }

    return exposureRows.length;
  }

  async function applyPublishRollout(experiment) {
    if (!experiment) throw new Error("Experiment not found");
    const featureName = String(experiment.config && experiment.config.featureName ? experiment.config.featureName : "").trim();
    const featureKey = featureKeyByDisplayName.get(featureName);
    if (!featureKey) throw new Error("Feature key not found for selected feature");

    const rollout = Number(experiment.config && experiment.config.rollout ? experiment.config.rollout : 0);
    const filters = experiment.config && experiment.config.filters ? experiment.config.filters : null;

    let audience = null;
    if (canUseServerFilterPath(filters)) {
      try {
        audience = await fetchCandidateUserIdsServerSide(filters);
      } catch (_error) {
        audience = null;
      }
    }
    if (!audience) {
      const onboardingRows = await fetchAllOnboardingRows(getOnboardingSelectColumns(filters));
      const filteredRows = applyFilterRules(onboardingRows, filters);
      const candidateUserIds = [];
      filteredRows.forEach((row) => {
        const userIdRaw =
          getRowValueForAttribute(row, "user_id") ??
          getRowValueForAttribute(row, "uuid") ??
          getRowValueForAttribute(row, "id");
        const userId = String(userIdRaw || "").trim();
        if (isValidUuid(userId)) candidateUserIds.push(userId);
      });
      audience = {
        onboardingCount: onboardingRows.length,
        filteredCount: filteredRows.length,
        validUserIdCount: candidateUserIds.length,
        skippedInvalidUserIdCount: Math.max(filteredRows.length - candidateUserIds.length, 0),
        candidateUserIds
      };
    }

    const enabledRows = [];
    const assignmentRows = [];
    const assignedAt = new Date().toISOString();
    for (const userId of audience.candidateUserIds) {

      const bucket = calculateRolloutBucket(userId, featureKey, experiment.id);
      if (bucket < rollout) {
        const variant = getDeterministicVariant(userId, experiment.id);
        assignmentRows.push({
          user_id: userId,
          experiment_id: experiment.id,
          variant,
          assigned_at: assignedAt,
          assignment_source: "rollout"
        });

        if (variant === "test") {
          enabledRows.push({
            user_id: userId,
            feature_key: featureKey,
            is_enabled: true
          });
        }
      }
    }

    const [exposuresLoggedCount] = await Promise.all([
      insertExposureEventsForNewUsers(experiment.id, assignmentRows),
      upsertExperimentAssignments(assignmentRows),
      upsertUserFeatures(enabledRows)
    ]);
    const testAssignedCount = assignmentRows.filter((row) => row.variant === "test").length;
    const controlAssignedCount = assignmentRows.filter((row) => row.variant === "control").length;
    return {
      onboardingCount: audience.onboardingCount,
      filteredCount: audience.filteredCount,
      validUserIdCount: audience.validUserIdCount,
      skippedInvalidUserIdCount: audience.skippedInvalidUserIdCount,
      exposedCount: assignmentRows.length,
      exposuresLoggedCount,
      testAssignedCount,
      controlAssignedCount,
      enabledCount: enabledRows.length
    };
  }

  async function loadFeatureOptionsFromSupabase() {
    const featureSelect = configForm.elements.featureName;
    if (!featureSelect) return;
    try {
      const rows = await fetchSupabaseRest(
        `${SUPABASE_FEATURES_TABLE}?select=display_name,feature_key`,
        "Failed to load features"
      );
      featureKeyByDisplayName.clear();
      featureDisplayNameByKey.clear();
      (Array.isArray(rows) ? rows : []).forEach((row) => {
        const name = String((row && row.display_name) || "").trim();
        const key = String((row && row.feature_key) || "").trim();
        if (name && key && !featureKeyByDisplayName.has(name)) {
          featureKeyByDisplayName.set(name, key);
        }
        if (name && key && !featureDisplayNameByKey.has(key)) {
          featureDisplayNameByKey.set(key, name);
        }
      });

      const uniqueFeatures = Array.from(
        new Set(
          (Array.isArray(rows) ? rows : [])
            .map((row) => String((row && row.display_name) || "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));

      if (uniqueFeatures.length) {
        setFeatureOptions(uniqueFeatures);
      }
    } catch (error) {
      console.error("Unable to load features from Supabase", error);
      showToast(`Unable to load feature list: ${normalizeErrorMessage(error, "Unknown error")}`, "error");
    }
  }

  async function loadAttributeOptionsFromSupabase() {
    // Strict DB mode: clear local/default attributes before attempting fetch.
    filterDefinitions = [];
    refreshRuleAttributes();

    try {
      const payload = await fetchSupabaseRest(
        `${SUPABASE_SEGMENT_PARAMS_TABLE}?select=param_key,data_type&is_active=eq.true`,
        "Failed to load filter attributes"
      );
      const rows = Array.isArray(payload) ? payload : [];
      const labelMap = new Map();

      rows.forEach((row) => {
        const label = String((row && row.param_key) || "").trim();
        if (!label) return;
        const key = label.toLowerCase();

        if (!labelMap.has(key)) {
          labelMap.set(key, {
            name: label,
            dataType: String((row && row.data_type) || "").trim().toLowerCase()
          });
          return;
        }

        const existing = labelMap.get(key);
        if (existing && !existing.dataType) {
          existing.dataType = String((row && row.data_type) || "").trim().toLowerCase();
        }
      });

      const labels = Array.from(labelMap.values()).sort((a, b) => a.name.localeCompare(b.name));
      if (!labels.length) {
        filterDefinitions = [];
        refreshRuleAttributes();
        return;
      }

      filterDefinitions = labels.map((item) => {
        const rawType = item.dataType;
        const normalized = rawType.includes("bool")
          ? "boolean"
          : rawType.includes("timestamp") || rawType.includes("datetime")
            ? "datetime"
            : rawType.includes("date")
              ? "date"
              : rawType.includes("int")
                ? "int"
                : rawType.includes("float") || rawType.includes("double") || rawType.includes("numeric")
                  ? "float"
                  : rawType || "string";
        if (normalized === "date") {
          return { name: item.name, type: "date", dataType: "date", values: [] };
        }
        if (normalized === "datetime") {
          return { name: item.name, type: "text", dataType: "datetime", values: [] };
        }
        if (normalized === "boolean") {
          return { name: item.name, type: "dropdown", dataType: "boolean", values: ["1", "0"] };
        }
        if (["int", "float", "string"].includes(normalized)) {
          return { name: item.name, type: "text", dataType: normalized, values: [] };
        }
        return { name: item.name, type: "text", dataType: "string", values: [] };
      });
      refreshRuleAttributes();
    } catch (error) {
      filterDefinitions = [];
      refreshRuleAttributes();
      console.error("Unable to load segment attribute labels from Supabase", error);
      showToast(`Unable to load filter attributes: ${normalizeErrorMessage(error, "Unknown error")}`, "error");
    }
  }

  async function syncExperimentsFromSupabase() {
    if (!supabaseClient) return;
    try {
      const existingExperiments = getExperiments();
      const existingById = new Map(existingExperiments.map((experiment) => [Number(experiment.id), experiment]));
      const historyById = new Map(
        existingExperiments.map((experiment) => [Number(experiment.id), Array.isArray(experiment.history) ? experiment.history : []])
      );

      const { data, error } = await supabaseClient
        .schema(SUPABASE_EXPERIMENTS_SCHEMA)
        .from(SUPABASE_EXPERIMENTS_TABLE)
        .select("experiment_id,experiment_name,feature_key,status,rollout_percent,created_by,updated_at,created_at,applied_filters,exposed_users_count")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const mapped = (Array.isArray(data) ? data : []).map((row) => {
        const updatedAtRaw = row.updated_at || row.created_at || new Date().toISOString();
        const updatedAtTs = new Date(updatedAtRaw).getTime();
        const safeUpdatedTs = Number.isNaN(updatedAtTs) ? Date.now() : updatedAtTs;
        const displayFeatureName = featureDisplayNameByKey.get(String(row.feature_key || "").trim()) || String(row.feature_key || "");
        const experimentId = Number(row.experiment_id);
        const incomingFilters = serializeFilterBuilder(deserializeFilterBuilder(row.applied_filters));
        const existingExperiment = existingById.get(experimentId);
        const existingFilters = existingExperiment && existingExperiment.config ? existingExperiment.config.filters : [];
        const appliedFilters =
          !hasActiveFilters(incomingFilters) && hasActiveFilters(existingFilters)
            ? serializeFilterBuilder(existingFilters)
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
          history: historyById.get(experimentId) || [],
          config: {
            featureName: displayFeatureName,
            rollout: Number(row.rollout_percent || 0),
            scheduleAt: "",
            filters: appliedFilters
          },
          exposedUsersCount: Number(row.exposed_users_count || 0)
        };
      });

      saveExperiments(mapped);
    } catch (error) {
      console.error("Unable to load experiments from Supabase", error);
      showToast(`Unable to sync experiments: ${normalizeErrorMessage(error, "Unknown error")}`, "error");
    }
  }

  function fillExperimentForm(values) {
    configForm.elements.experimentName.value = values.name;
    setFeatureNameValue(values.featureName);
    configForm.elements.rollout.value = String(values.rollout);
    configForm.elements.scheduleAt.value = values.scheduleAt || "";
    if (testTargetType) testTargetType.value = "user_id";
    updateTestInputPlaceholder();
    if (testUserIdInput) testUserIdInput.value = "";
    setAudienceCountLabel("Target Audience: -- users");
    setAudienceCountLoading(false);
    setTestMessage("", null);
    rolloutValue.textContent = `${values.rollout}%`;
    setFilterRules(values.filters || []);

    if (values.scheduleAt) {
      scheduleWrap.style.display = "block";
    } else {
      scheduleWrap.style.display = "none";
    }
  }

  function updatePauseResumeButton(isExisting, status) {
    if (!isExisting || status === "Saved") {
      pauseResumeBtn.style.display = "none";
      pauseResumeBtn.dataset.action = "";
      pauseResumeBtn.classList.remove("btn-resume");
      return;
    }

    pauseResumeBtn.style.display = "inline-block";
    if (status === "Paused") {
      pauseResumeBtn.textContent = "Resume Experiment";
      pauseResumeBtn.dataset.action = "resume";
      pauseResumeBtn.classList.add("btn-resume");
    } else {
      pauseResumeBtn.textContent = "Pause Experiment";
      pauseResumeBtn.dataset.action = "pause";
      pauseResumeBtn.classList.remove("btn-resume");
    }
  }

  function setActiveWorkspaceTab(tabName) {
    currentWorkspaceTab = tabName;

    workspaceTabs.forEach((tabBtn) => {
      tabBtn.classList.toggle("is-active", tabBtn.dataset.tab === tabName);
    });

    workspaceConfigurationPanel.style.display = tabName === "configuration" ? "block" : "none";
    workspaceAnalyticsPanel.style.display = tabName === "analytics" ? "block" : "none";
    workspaceHistoryPanel.style.display = tabName === "history" ? "block" : "none";

    if (tabName !== "analytics") {
      destroyTrendChart();
    }

    if (tabName === "analytics") {
      renderAnalyticsView();
    }
    if (tabName === "history") {
      renderHistoryView();
    }

    localStorage.setItem(LAST_TAB_KEY, tabName);
  }

  function getCurrentExperimentForWorkspace() {
    if (editingExperimentId !== null) {
      return getExperiments().find((item) => item.id === editingExperimentId) || null;
    }

    return {
      id: null,
      name: configForm.elements.experimentName.value.trim() || "Untitled Experiment",
      status: "Saved",
        config: {
          featureName: configForm.elements.featureName.value.trim() || "Untitled Feature",
          rollout: Number(configForm.elements.rollout.value || 0),
          scheduleAt: configForm.elements.scheduleAt.value,
          filters: readFilterRules()
        }
      };
  }

  async function openExperiment(id, activeTab) {
    destroyTrendChart();
    currentAnalyticsData = null;

    if (id === null || typeof id === "undefined") {
      editingExperimentId = null;
      editingExperimentStatus = null;
      if (configTitleMode) configTitleMode.textContent = "(New)";
      fillExperimentForm(defaultFormPayload());
      updatePauseResumeButton(false, "Saved");
      showView("experiment-form");
      const nextTab = activeTab || "configuration";
      setActiveWorkspaceTab(nextTab);
      persistExperimentWorkspaceState(null, nextTab);
      syncWorkspaceSwitcherLabel();
      renderWorkspaceSwitcherList();
      markWorkspaceBaseline();
      return;
    }

    const experiments = getExperiments();
    const experiment = experiments.find((item) => item.id === id);
    if (!experiment) return;

    editingExperimentId = id;
    editingExperimentStatus = experiment.status;
    if (configTitleMode) configTitleMode.textContent = "(Edit)";

    const featureNameFallback =
      (experiment.config && experiment.config.featureName && experiment.config.featureName.trim()) ||
      experiment.name;

    const localFiltersRaw = experiment && experiment.config ? experiment.config.filters : [];
    let filtersForForm = serializeFilterBuilder(localFiltersRaw);
    let fetchedFiltersRaw = null;

    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENTS_TABLE)
          .select("applied_filters")
          .eq("experiment_id", id)
          .limit(1)
          .maybeSingle();

        if (!error && data && typeof data.applied_filters !== "undefined") {
          fetchedFiltersRaw = data.applied_filters;
          filtersForForm = serializeFilterBuilder(deserializeFilterBuilder(data.applied_filters));
          experiment.config = experiment.config || {};
          experiment.config.filters = filtersForForm;
          saveExperiments(experiments);
        }
      } catch (_error) {
        console.error("Unable to live-fetch applied_filters for edit prefill", _error);
      }
    }

    showOneRunFilterDebug({
      experimentId: id,
      localFiltersRaw,
      fetchedFiltersRaw,
      finalFiltersForForm: filtersForForm
    });

    fillExperimentForm({
      name: experiment.name,
      featureName: featureNameFallback,
      rollout: Number(experiment.config.rollout || 50),
      scheduleAt: experiment.config.scheduleAt || "",
      filters: filtersForForm
    });

    updatePauseResumeButton(true, experiment.status);
    showView("experiment-form");
    const nextTab = activeTab || "configuration";
    setActiveWorkspaceTab(nextTab);
    persistExperimentWorkspaceState(id, nextTab);
    syncWorkspaceSwitcherLabel();
    renderWorkspaceSwitcherList();
    markWorkspaceBaseline();
  }

  function readExperimentPayloadFromForm() {
    return sanitizeExperimentPayload({
      name: configForm.elements.experimentName.value.trim(),
      featureName: configForm.elements.featureName.value.trim(),
      rollout: Number(configForm.elements.rollout.value),
      scheduleAt: configForm.elements.scheduleAt.value,
      filters: readFilterRules()
    });
  }

  function getPublishedStatus(payload) {
    if (Number(payload.rollout) >= 100) {
      return "Completed";
    }

    if (payload.scheduleAt) {
      const scheduleTs = new Date(payload.scheduleAt).getTime();
      if (!Number.isNaN(scheduleTs) && scheduleTs > Date.now()) {
        return "Planned";
      }
    }

    return "Running";
  }

  function resolveStatus(intent, payload, existingStatus, isNew) {
    if (intent === "publish") {
      return getPublishedStatus(payload);
    }

    if (intent === "pause") {
      return "Paused";
    }

    if (intent === "resume") {
      return "Running";
    }

    if (intent === "draft") {
      if (isNew || existingStatus === "Saved") return "Saved";
      if (["Running", "Paused", "Planned", "Completed"].includes(existingStatus)) return existingStatus;
      return "Saved";
    }

    return existingStatus || "Saved";
  }

  async function upsertExperiment(payload, intent, options) {
    const experiments = getExperiments();
    const now = new Date().toISOString().slice(0, 10);
    const nowTs = Date.now();
    const lastModifiedAt = new Date(nowTs).toISOString();
    const actor = getActorLabel();
    const ownerIdentifier = await getCurrentOwnerIdentifier();
    const featureKey = featureKeyByDisplayName.get(String(payload.featureName || "").trim());
    if (!featureKey) {
      throw new Error("Feature key not found for selected feature");
    }

    if (editingExperimentId === null) {
      const status = resolveStatus(intent, payload, null, true);
      const newExperiment = {
        id: Date.now(),
        name: payload.name,
        owner: currentUser && currentUser.role === "admin" ? "Admin" : "User",
        lastEditedBy: currentUser ? currentUser.name : "",
        status,
        updatedAt: now,
        updatedAtTs: nowTs,
        lastModifiedAt,
        config: {
          featureName: payload.featureName,
          rollout: payload.rollout,
          scheduleAt: payload.scheduleAt,
          filters: serializeFilterBuilder(payload.filters)
        }
      };
      const action = getIntentActionLabel(intent, true, null);
      const details = buildHistoryDetails(null, payload, status, true);
      addHistoryEntry(newExperiment, {
        at: lastModifiedAt,
        actor,
        action,
        summary: details.length ? `${details.length} change${details.length === 1 ? "" : "s"} recorded.` : "",
        details
      });

      if (supabaseClient) {
        const { data, error } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENTS_TABLE)
          .upsert({
            experiment_name: payload.name,
            feature_key: featureKey,
            status,
            rollout_percent: Number(payload.rollout || 0),
            created_by: ownerIdentifier,
            applied_filters: serializeFilterBuilder(payload.filters),
            exposed_users_count: 0
          }, { onConflict: "experiment_name,feature_key" })
          .select("experiment_id,status,applied_filters,exposed_users_count")
          .single();

        if (error) throw error;
        newExperiment.id = Number(data.experiment_id);
        newExperiment.status = String(data.status || status);
        newExperiment.config.filters = serializeFilterBuilder(deserializeFilterBuilder(data.applied_filters));
      }

      experiments.unshift(newExperiment);
      editingExperimentId = newExperiment.id;
      editingExperimentStatus = newExperiment.status;
      analyticsCache.delete(String(newExperiment.id));
      saveExperiments(experiments);
      updatePauseResumeButton(true, editingExperimentStatus);

      if (!(options && options.skipSync)) {
        await syncExperimentsFromSupabase();
      }
      markWorkspaceBaseline();
      return getExperiments().find((item) => item.id === newExperiment.id) || newExperiment;
    } else {
      const target = experiments.find((item) => item.id === editingExperimentId);
      if (!target) return null;

      const previousSnapshot = {
        name: target.name,
        status: target.status,
        config: {
          featureName: target.config && target.config.featureName ? target.config.featureName : "",
          rollout: Number(target.config && typeof target.config.rollout !== "undefined" ? target.config.rollout : 0),
          scheduleAt: target.config && target.config.scheduleAt ? target.config.scheduleAt : "",
          filters: serializeFilterBuilder(target.config && target.config.filters)
        }
      };

      const status = resolveStatus(intent, payload, target.status, false);
      const incomingFilters = serializeFilterBuilder(payload.filters);
      const shouldPreserveExistingFilters =
        !hasActiveFilters(incomingFilters) && hasActiveFilters(previousSnapshot.config.filters);
      const finalFilters = shouldPreserveExistingFilters ? previousSnapshot.config.filters : incomingFilters;

      target.name = payload.name;
      target.lastEditedBy = currentUser ? currentUser.name : target.lastEditedBy || "";
      target.status = status;
      target.updatedAt = now;
      target.updatedAtTs = nowTs;
      target.lastModifiedAt = lastModifiedAt;
      target.config = target.config || {};
      target.config.featureName = payload.featureName;
      target.config.rollout = payload.rollout;
      target.config.scheduleAt = payload.scheduleAt;
      target.config.filters = finalFilters;

      const action = getIntentActionLabel(intent, false, previousSnapshot.status);
      const details = buildHistoryDetails(previousSnapshot, payload, status, false);
      addHistoryEntry(target, {
        at: lastModifiedAt,
        actor,
        action,
        summary: details.length ? `${details.length} change${details.length === 1 ? "" : "s"} recorded.` : "No field-level changes.",
        details
      });

      if (supabaseClient) {
        const { error } = await supabaseClient
          .schema(SUPABASE_EXPERIMENTS_SCHEMA)
          .from(SUPABASE_EXPERIMENTS_TABLE)
          .update({
            experiment_name: payload.name,
            feature_key: featureKey,
            status,
            rollout_percent: Number(payload.rollout || 0),
            created_by: ownerIdentifier,
            applied_filters: finalFilters
          })
          .eq("experiment_id", editingExperimentId);

        if (error) throw error;
      }

      saveExperiments(experiments);
      editingExperimentStatus = resolveStatus(intent, payload, editingExperimentStatus, false);
      analyticsCache.delete(String(editingExperimentId));
      updatePauseResumeButton(true, editingExperimentStatus);

      if (!(options && options.skipSync)) {
        await syncExperimentsFromSupabase();
      }
      markWorkspaceBaseline();
      return getExperiments().find((item) => item.id === editingExperimentId) || target;
    }
  }

  async function saveDraftCurrentExperiment(options) {
    const opts = options || {};
    const payload = readExperimentPayloadFromForm();
    if (!payload.name) payload.name = "Untitled Experiment";
    if (!payload.featureName) payload.featureName = "Untitled Feature";

    await upsertExperiment(payload, "draft");
    if (opts.redirectToDashboard !== false) {
      await openDashboardView();
    }
    return true;
  }

  async function publishCurrentExperiment(options) {
    const opts = options || {};
    const payload = readExperimentPayloadFromForm();
    if (!payload.name && !payload.featureName) {
      showToast("Experiment Name and Feature Name are required.", "error");
      return false;
    }
    if (!payload.name) {
      showToast("Experiment Name is required.", "error");
      return false;
    }
    if (!payload.featureName) {
      showToast("Feature Name is required.", "error");
      return false;
    }

    let savedExperiment = null;
    try {
      savedExperiment = await upsertExperiment(payload, "publish", { skipSync: true });
      if (!savedExperiment) {
        throw new Error("Unable to save experiment before rollout.");
      }
      const result = await applyPublishRollout(savedExperiment);
      await updateExperimentRolloutStats(savedExperiment.id, payload.filters, result.exposedCount);
      const summary = `Rollout applied. Onboarding: ${result.onboardingCount}, After filters: ${result.filteredCount}, Valid IDs: ${result.validUserIdCount}, Skipped invalid IDs: ${result.skippedInvalidUserIdCount}, Exposed: ${result.exposedCount}, New Exposures Logged: ${result.exposuresLoggedCount}, Test: ${result.testAssignedCount}, Control: ${result.controlAssignedCount}, Feature Live: ${result.enabledCount}.`;
      if (result.exposedCount === 0) {
        setTestMessage(`${summary} No users were upserted into ab_user_features.`, "error");
        showToast("Publish completed but no users qualified for rollout.", "error");
        return false;
      }
      setTestMessage(summary, "success");
      showToast("Experiment published successfully.", "success");
      if (opts.redirectToDashboard !== false) {
        await openDashboardView();
      } else {
        markWorkspaceBaseline();
      }
      return true;
    } catch (error) {
      const message = normalizeErrorMessage(error, "Unknown error");
      setTestMessage(`Published, but rollout sync failed: ${message}`, "error");
      showToast(`Publish failed: ${message}`, "error");
      return false;
    }
  }

  async function handleExperimentSwitchRequest(targetId) {
    if (!hasUnsavedWorkspaceChanges()) {
      return true;
    }
    const action = await openUnsavedSwitchModal();
    if (action === "cancel") return false;
    if (action === "draft") {
      return saveDraftCurrentExperiment({ redirectToDashboard: false });
    }
    return false;
  }

  async function updateExperimentRolloutStats(experimentId, filters, exposedUsersCount) {
    if (!supabaseClient || !experimentId) return;

    const { error } = await supabaseClient
      .schema(SUPABASE_EXPERIMENTS_SCHEMA)
      .from(SUPABASE_EXPERIMENTS_TABLE)
      .update({
        applied_filters: serializeFilterBuilder(filters),
        exposed_users_count: Number(exposedUsersCount || 0)
      })
      .eq("experiment_id", experimentId);

    if (error) {
      throw error;
    }
  }

  async function loadCohortAnalytics(experimentId) {
    const dateKeys = getLast7DateKeys();
    const cacheKey = String(experimentId || "");
    const cached = analyticsCache.get(cacheKey);
    if (cached && Date.now() - cached.at < ANALYTICS_CACHE_TTL_MS) {
      return cached.data;
    }

    const precomputed = await loadPrecomputedCohortAnalytics(experimentId);
    const rawComputed = precomputed ? null : await loadRawCohortAnalytics(experimentId);
    const result = precomputed || rawComputed || buildEmptyAnalyticsPayload(dateKeys);
    result.experimentId = experimentId;
    result.snapshotDate = precomputed && precomputed.snapshotDate ? precomputed.snapshotDate : null;
    analyticsCache.set(cacheKey, { at: Date.now(), data: result });
    return result;
  }

  async function renderAnalyticsView() {
    const experiment = getCurrentExperimentForWorkspace();
    if (!experiment) return;

    const featureName = (experiment.config && experiment.config.featureName) || "-";
    const status = experiment.status || "Saved";
    const rollout = experiment.config && typeof experiment.config.rollout !== "undefined" ? experiment.config.rollout : 0;

    analyticsExperimentName.textContent = experiment.name || "Untitled Experiment";
    analyticsFeatureName.textContent = `Feature: ${featureName}`;
    analyticsStatusBadge.className = `status ${String(status).toLowerCase()}`;
    analyticsStatusBadge.textContent = status;
    analyticsRollout.textContent = `${rollout}%`;

    if (status === "Saved") {
      analyticsEmptyState.style.display = "grid";
      analyticsDataSections.style.display = "none";
      destroyTrendChart();
      return;
    }

    analyticsEmptyState.style.display = "none";
    analyticsDataSections.style.display = "grid";
    if (analyticsNoData) {
      analyticsNoData.hidden = false;
      analyticsNoData.textContent = "Loading cohort analytics...";
    }

    try {
      currentAnalyticsData = await loadCohortAnalytics(experiment.id);
      updateAnalyticsPresentation();
    } catch (error) {
      destroyTrendChart();
      if (analyticsNoData) {
        analyticsNoData.hidden = false;
        analyticsNoData.textContent = `Unable to load analytics: ${error.message || "Unknown error"}`;
      }
    }
  }

  function renderMetadataList() {
    metadataList.innerHTML = "";
    filterDefinitions.forEach((definition) => {
      const li = document.createElement("li");
      const valuesText =
        definition.type === "dropdown"
          ? definition.values.join(", ")
          : definition.type === "date"
            ? "calendar date picker"
            : "free text";
      li.textContent = `${definition.name} (${definition.type}) - ${valuesText}`;
      metadataList.appendChild(li);
    });
  }

  function openMetadataModal() {
    if (!currentUser || currentUser.role !== "admin") return;
    renderMetadataList();
    metadataModal.style.display = "flex";
    metadataModal.setAttribute("aria-hidden", "false");
  }

  function closeMetadataModal() {
    metadataModal.style.display = "none";
    metadataModal.setAttribute("aria-hidden", "true");
  }

  function setupWorkspaceTabs() {
    workspaceTabs.forEach((tabBtn) => {
      tabBtn.addEventListener("click", () => {
        setActiveWorkspaceTab(tabBtn.dataset.tab || "configuration");
      });
    });
  }

  function setupExperimentFormEvents() {
    if (workspaceSwitcherToggle) {
      workspaceSwitcherToggle.addEventListener("click", () => {
        toggleWorkspaceSwitcher();
      });
    }

    if (workspaceSwitcherClose) {
      workspaceSwitcherClose.addEventListener("click", () => {
        toggleWorkspaceSwitcher(false);
      });
    }

    if (workspaceSwitcherSearch) {
      workspaceSwitcherSearch.addEventListener("input", () => {
        renderWorkspaceSwitcherList();
      });
    }

    if (workspaceSwitcherList) {
      workspaceSwitcherList.addEventListener("click", async (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const button = target.closest("button[data-id]");
        if (!button) return;
        const id = Number(button.getAttribute("data-id"));
        if (Number.isNaN(id)) return;
        if (editingExperimentId !== null && Number(editingExperimentId) === id) {
          toggleWorkspaceSwitcher(false);
          return;
        }
        const canSwitch = await handleExperimentSwitchRequest(id);
        if (!canSwitch) return;
        await openExperiment(id, currentWorkspaceTab || "configuration");
        toggleWorkspaceSwitcher(false);
      });
    }

    if (unsavedCancelBtn) {
      unsavedCancelBtn.addEventListener("click", () => resolveUnsavedSwitch("cancel"));
    }
    if (unsavedSaveDraftBtn) {
      unsavedSaveDraftBtn.addEventListener("click", () => resolveUnsavedSwitch("draft"));
    }

    document.addEventListener("click", (event) => {
      if (!isWorkspaceSwitcherOpen || !workspaceSwitcherPanel || !workspaceSwitcherToggle) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (workspaceSwitcherPanel.contains(target) || workspaceSwitcherToggle.contains(target)) return;
      toggleWorkspaceSwitcher(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isWorkspaceSwitcherOpen) {
        toggleWorkspaceSwitcher(false);
      }
    });

    if (testTargetType) {
      testTargetType.addEventListener("change", () => {
        updateTestInputPlaceholder();
        if (testUserIdInput) testUserIdInput.value = "";
      });
    }

    rolloutControl.addEventListener("input", () => {
      rolloutValue.textContent = `${rolloutControl.value}%`;
    });

    scheduleBtn.addEventListener("click", () => {
      scheduleWrap.style.display = scheduleWrap.style.display === "none" ? "block" : "none";
    });

    if (configCloseBtn) {
      configCloseBtn.addEventListener("click", () => {
        openDashboardView();
      });
    }

    if (configBackBtn) {
      configBackBtn.addEventListener("click", () => {
        openDashboardView();
      });
    }

    pauseResumeBtn.addEventListener("click", async () => {
      if (editingExperimentId === null) return;

      const action = pauseResumeBtn.dataset.action;
      if (action !== "pause" && action !== "resume") return;

      const payload = readExperimentPayloadFromForm();
      if (!payload.name) payload.name = "Untitled Experiment";
      if (!payload.featureName) payload.featureName = "Untitled Feature";

      try {
        await upsertExperiment(payload, action);
        openDashboardView();
      } catch (error) {
        setTestMessage(`Unable to ${action} experiment: ${error.message || "Unknown error"}`, "error");
      }
    });

    testBtn.addEventListener("click", async () => {
      await withButtonLoading(testBtn, "Testing...", async () => {
        await testManualFeatureOverride();
      });
    });

    viewCountBtn.addEventListener("click", () => {
      calculateTargetAudienceCount();
    });

    updateTestInputPlaceholder();

    addFilterRuleBtn.addEventListener("click", () => addFilterRule());

    configForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    saveDraftBtn.addEventListener("click", async () => {
      try {
        await withButtonLoading(saveDraftBtn, "Saving...", async () => {
          await saveDraftCurrentExperiment({ redirectToDashboard: true });
        });
      } catch (error) {
        const message = normalizeErrorMessage(error, "Unknown error");
        setTestMessage(`Unable to save draft: ${message}`, "error");
        showToast(`Unable to save draft: ${message}`, "error");
      }
    });

    publishExperimentBtn.addEventListener("click", async () => {
      await withButtonLoading(publishExperimentBtn, "Publishing...", async () => {
        await publishCurrentExperiment({ redirectToDashboard: true });
      });
    });

  }

  function setupAnalyticsEvents() {
    if (analyticsMetricSelect) {
      analyticsMetricSelect.addEventListener("change", () => {
        updateAnalyticsPresentation();
      });
    }

    if (analyticsFormatSelect) {
      analyticsFormatSelect.addEventListener("change", () => {
        updateAnalyticsPresentation();
      });
    }

    if (downloadAnalyticsPdfBtn) {
      downloadAnalyticsPdfBtn.addEventListener("click", async () => {
        try {
          await withButtonLoading(downloadAnalyticsPdfBtn, "Downloading...", async () => {
            await downloadAnalyticsAsPdf();
          });
        } catch (error) {
          showToast(`Unable to download PDF: ${normalizeErrorMessage(error, "Unknown error")}`, "error");
        }
      });
    }
  }

  function setupMetadataEvents() {
    // Manage Metadata feature intentionally disabled for all roles.
    return;

    metaDataType.addEventListener("change", () => {
      const isDropdown = metaDataType.value === "dropdown";
      metaAllowedValues.disabled = !isDropdown;
      if (!isDropdown) metaAllowedValues.value = "";
    });

    metadataForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!currentUser || currentUser.role !== "admin") {
        closeMetadataModal();
        return;
      }

      const name = metaFieldName.value.trim();
      const type = metaDataType.value;
      const values = metaAllowedValues.value
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);

      if (!name) {
        showToast("Field Name is required.", "error");
        return;
      }

      if (type === "dropdown" && !values.length) {
        showToast("Allowed Values are required for Dropdown type.", "error");
        return;
      }

      const duplicate = filterDefinitions.some((definition) => definition.name.toLowerCase() === name.toLowerCase());
      if (duplicate) {
        showToast("This filter definition already exists.", "error");
        return;
      }

      filterDefinitions.push({ name, type, values: type === "dropdown" ? values : [] });
      saveFilterDefinitions();
      renderMetadataList();
      refreshRuleAttributes();
      metadataForm.reset();
      metaDataType.value = "dropdown";
      metaAllowedValues.disabled = false;
    });
  }

  function setupDashboardEvents() {
    homeSearch.addEventListener("input", refreshRecentList);
    addExperimentBtn.addEventListener("click", () => openExperiment(null, "configuration"));

    recentList.addEventListener("click", async (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const actionBtn = target.closest("button[data-action]");
      if (!actionBtn) return;

      const row = actionBtn.closest("li[data-id]");
      if (!row) return;

      const id = Number(row.dataset.id);
      if (Number.isNaN(id)) return;

      const action = actionBtn.getAttribute("data-action");
      if (action === "analyze") {
        openExperiment(id, "analytics");
      } else if (action === "edit") {
        openExperiment(id, "configuration");
      } else if (action === "delete") {
        await deleteExperimentById(id);
      }
    });

    if (profileBtn) {
      profileBtn.addEventListener("click", async () => {
        await handleOpenProfile();
      });
    }

    if (profileBackBtn) {
      profileBackBtn.addEventListener("click", async () => {
        await openDashboardView();
      });
    }
    if (backToDashboardBtn) {
      backToDashboardBtn.addEventListener("click", () => openDashboardView());
    }

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        handleLogout();
      });
    }

    if (profileLogoutBtn) {
      profileLogoutBtn.addEventListener("click", () => {
        handleLogout();
      });
    }

    navProfileButtons.forEach((button) => {
      if (button === profileBtn) return;
      button.addEventListener("click", async () => {
        await handleOpenProfile();
      });
    });

    navBackButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        await handleTopNavBack();
      });
    });

    navHomeButtons.forEach((button) => {
      button.addEventListener("click", async () => {
        await handleTopNavHome();
      });
    });

    navLogoutButtons.forEach((button) => {
      if (button === logoutBtn) return;
      button.addEventListener("click", () => {
        handleLogout();
      });
    });

    if (globalBackBtn) {
      globalBackBtn.addEventListener("click", async () => {
        const snapshot = viewHistoryStack.pop();
        if (!snapshot) {
          await openDashboardView();
          return;
        }
        updateGlobalBackButton();
        await navigateFromSnapshot(snapshot);
      });
    }
  }

  function setupAuthEvents() {
    togglePassword.addEventListener("click", () => {
      const hidden = authPasswordInput.type === "password";
      authPasswordInput.type = hidden ? "text" : "password";
      togglePassword.textContent = hidden ? "Hide" : "Show";
      togglePassword.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    });

    toggleSignupPassword.addEventListener("click", () => {
      const hidden = signupPasswordInput.type === "password";
      signupPasswordInput.type = hidden ? "text" : "password";
      toggleSignupPassword.textContent = hidden ? "Hide" : "Show";
      toggleSignupPassword.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
    });

    toggleSignupConfirmPassword.addEventListener("click", () => {
      const hidden = signupConfirmPasswordInput.type === "password";
      signupConfirmPasswordInput.type = hidden ? "text" : "password";
      toggleSignupConfirmPassword.textContent = hidden ? "Hide" : "Show";
      toggleSignupConfirmPassword.setAttribute("aria-label", hidden ? "Hide confirm password" : "Show confirm password");
    });

    openSignupBtn.addEventListener("click", () => {
      authMessage.textContent = "";
      signupMessage.textContent = "";
      showView("signup");
    });

    openLoginBtn.addEventListener("click", () => {
      authMessage.textContent = "";
      signupMessage.textContent = "";
      showView("login");
    });

    authForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = authPasswordInput.value;

      const user = findUserByCredentials(email, password);
      if (!user) {
        authMessage.textContent = "Invalid credentials.";
        return;
      }

      setActiveSessionFromUser(user);
      syncTopNavProfileChips();
      syncWorkspaceSwitcherLabel();

      authMessage.textContent = "";
      updateRoleUI();
      await loadFeatureOptionsFromSupabase();
      await syncExperimentsFromSupabase();
      await detectExperimentDeletePermission();
      checkExperimentStatus();
      refreshRecentList();

      const pendingEditId = Number(localStorage.getItem(PENDING_EDIT_KEY));
      if (!Number.isNaN(pendingEditId) && pendingEditId > 0) {
        const pendingTab = localStorage.getItem(PENDING_TAB_KEY) || "configuration";
        localStorage.removeItem(PENDING_EDIT_KEY);
        localStorage.removeItem(PENDING_TAB_KEY);
        openExperiment(pendingEditId, pendingTab);
      } else {
        await openDashboardView();
      }
    });

    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const fullName = signupFullNameInput.value.trim();
      const email = signupEmailInput.value.trim().toLowerCase();
      const profileRole = signupRoleInput.value.trim();
      const team = signupTeamInput.value.trim();
      const password = signupPasswordInput.value;
      const confirmPassword = signupConfirmPasswordInput.value;

      if (!fullName) {
        signupMessage.textContent = "Full Name is required.";
        return;
      }

      if (!email) {
        signupMessage.textContent = "Email is required.";
        return;
      }

      if (password !== confirmPassword) {
        signupMessage.textContent = "Passwords do not match.";
        return;
      }

      if (!password) {
        signupMessage.textContent = "Password is required.";
        return;
      }

      if (findUserByEmail(email)) {
        showToast("User already exists.", "error");
        return;
      }

      const users = getStoredUsers();
      const newUser = {
        email,
        password,
        role: "user",
        fullName,
        profileRole,
        team
      };
      users.push(newUser);
      saveStoredUsers(users);
      setActiveSessionFromUser(newUser);
      syncTopNavProfileChips();
      syncWorkspaceSwitcherLabel();
      await saveUserProfileToSupabase(newUser);

      signupMessage.textContent = "";
      signupForm.reset();
      updateRoleUI();
      await loadFeatureOptionsFromSupabase();
      await syncExperimentsFromSupabase();
      await detectExperimentDeletePermission();
      await openDashboardView();
    });
  }

  async function bootSession() {
    initUsersStore();

    const active = localStorage.getItem(SESSION_KEY) === "active";
    if (!active) {
      currentUser = null;
      updateRoleUI();
      showView("login");
      return;
    }

    try {
      const stored = JSON.parse(localStorage.getItem(SESSION_USER_KEY) || "{}");
      const user = findUserByEmail(stored.email || "");
      if (!stored.email || !user) {
        throw new Error("invalid session");
      }
      currentUser = {
        email: user.email,
        role: user.role,
        name: getUserDisplayName(user.email, user.role, user.fullName),
        fullName: String(user.fullName || "").trim(),
        profileRole: String(user.profileRole || "").trim(),
        team: String(user.team || "").trim(),
        userId: String(stored.userId || stored.id || user.userId || user.id || "").trim()
      };
    } catch (_e) {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
      currentUser = null;
      updateRoleUI();
      showView("login");
      return;
    }

    updateRoleUI();
    syncTopNavProfileChips();
    syncWorkspaceSwitcherLabel();
    const remoteProfile = await loadUserProfileFromSupabase(currentUser.email);
    if (remoteProfile) {
      currentUser.fullName = String(remoteProfile.full_name || currentUser.fullName || currentUser.name || "").trim();
      currentUser.profileRole = String(remoteProfile.role || currentUser.profileRole || "").trim();
      currentUser.team = String(remoteProfile.team || currentUser.team || "").trim();
      currentUser.userId = String(remoteProfile.id || currentUser.userId || "").trim();
      currentUser.name = currentUser.fullName || currentUser.name;
      localStorage.setItem(SESSION_USER_KEY, JSON.stringify(currentUser));
    }
    syncTopNavProfileChips();
    const lastView = localStorage.getItem(LAST_VIEW_KEY);
    showView("dashboard", { persist: false });
    await loadFeatureOptionsFromSupabase();
    await syncExperimentsFromSupabase();
    await detectExperimentDeletePermission();
    checkExperimentStatus();
    refreshRecentList();

    const pendingEditId = Number(localStorage.getItem(PENDING_EDIT_KEY));
    if (!Number.isNaN(pendingEditId) && pendingEditId > 0) {
      const pendingTab = localStorage.getItem(PENDING_TAB_KEY) || "configuration";
      localStorage.removeItem(PENDING_EDIT_KEY);
      localStorage.removeItem(PENDING_TAB_KEY);
      openExperiment(pendingEditId, pendingTab);
    } else {
      if (lastView === "profile") {
        await renderProfileView();
        showView("profile");
        return;
      }

      if (lastView === "experiment-form") {
        const savedTab = localStorage.getItem(LAST_TAB_KEY) || "configuration";
        const savedExperimentId = Number(localStorage.getItem(LAST_EXPERIMENT_ID_KEY));
        if (!Number.isNaN(savedExperimentId) && savedExperimentId > 0) {
          openExperiment(savedExperimentId, savedTab);
          return;
        }

        openExperiment(null, savedTab);
        return;
      }

      await openDashboardView();
    }
  }

  setupLoginUI();
  setupWorkspaceTabs();
  setupAuthEvents();
  setupDashboardEvents();
  setupExperimentFormEvents();
  setupAnalyticsEvents();
  loadFeatureOptionsFromSupabase();
  loadAttributeOptionsFromSupabase();
  bootSession();
})();
