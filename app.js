(function () {
  const SESSION_KEY = "eh_session";
  const SESSION_USER_KEY = "eh_session_user";
  const PENDING_EDIT_KEY = "eh_pending_edit_id";
  const PENDING_TAB_KEY = "eh_pending_tab";
  const FILTER_DEFINITIONS_KEY = "eh_filter_definitions";
  const USERS_KEY = "ab_platform_users";

  const OPERATORS = ["is", "is not", "contains", "does not contain", "starts with", "ends with", "exists"];
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

  const authForm = document.getElementById("authForm");
  const authMessage = document.getElementById("formMessage");
  const authPasswordInput = document.getElementById("password");
  const togglePassword = document.getElementById("togglePassword");
  const openSignupBtn = document.getElementById("openSignupBtn");

  const signupForm = document.getElementById("signupForm");
  const signupEmailInput = document.getElementById("signupEmail");
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
  const logoutBtn = document.getElementById("logoutBtn");
  const backToDashboardBtn = document.getElementById("backToDashboardBtn");
  const manageMetadataBtn = document.getElementById("manageMetadataBtn");

  const recentList = document.getElementById("recentList");
  const emptyRecent = document.getElementById("emptyRecent");
  const homeSearch = document.getElementById("homeSearch");
  const addExperimentBtn = document.getElementById("addExperimentBtn");

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
  const testBtn = document.getElementById("testBtn");
  const addFilterRuleBtn = document.getElementById("addFilterRuleBtn");
  const filterRulesContainer = document.getElementById("filterRulesContainer");

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
  const analyticsEmptyState = document.getElementById("analyticsEmptyState");
  const analyticsDataSections = document.getElementById("analyticsDataSections");

  const kpiLift = document.getElementById("kpiLift");
  const kpiSignificance = document.getElementById("kpiSignificance");
  const kpiUsers = document.getElementById("kpiUsers");
  const kpiGuardrails = document.getElementById("kpiGuardrails");
  const kpiRecommendation = document.getElementById("kpiRecommendation");

  const metricViewSelect = document.getElementById("metricViewSelect");
  const comparisonTableBody = document.getElementById("comparisonTableBody");
  const trendModeRadios = Array.from(document.querySelectorAll("input[name='trendMode']"));
  const trendChartCanvas = document.getElementById("analyticsTrendChart");
  const segmentationBreakdown = document.getElementById("segmentationBreakdown");
  const guardrailGrid = document.getElementById("guardrailGrid");
  const statsGrid = document.getElementById("statsGrid");
  const historyTimeline = document.getElementById("historyTimeline");
  const historyEmpty = document.getElementById("historyEmpty");

  let currentUser = null;
  let editingExperimentId = null;
  let editingExperimentStatus = null;
  let currentWorkspaceTab = "configuration";
  let filterDefinitions = loadFilterDefinitions();
  let currentAnalyticsData = null;
  let trendChart = null;

  function showView(viewName) {
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
  }

  function setupLoginUI() {
    const title = document.querySelector(".form-head h1");
    const sub = document.querySelector(".form-head p");
    title.textContent = "Log in to Experiment Hub";
    sub.innerHTML = "Use your registered credentials. Default admin: <strong>admin@company.com / 1234</strong>.";

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

    const seed = [{ email: "admin@company.com", password: "1234", role: "admin" }];
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
          role: user.role === "admin" ? "admin" : "user"
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

  function getUserDisplayName(email, role) {
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
      name: getUserDisplayName(user.email, user.role)
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
    const isAdmin = currentUser && currentUser.role === "admin";
    manageMetadataBtn.style.display = isAdmin ? "inline-block" : "none";
  }

  function refreshRecentList() {
    const allExperiments = getExperiments();
    const filtered = sortExperimentsByRecency(filterExperiments(allExperiments, homeSearch.value)).slice(0, 5);

    renderList(recentList, emptyRecent, filtered, { actionMode: "workspace" });
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

  function openDashboardView() {
    checkExperimentStatus();
    refreshRecentList();
    showView("dashboard");
  }

  function getActorLabel() {
    if (!currentUser) return "System";
    return currentUser.email;
  }

  function normalizeFiltersForCompare(filters) {
    if (!Array.isArray(filters)) return [];
    return filters.map((rule) => ({
      attribute: String(rule.attribute || "").trim(),
      operator: String(rule.operator || "").trim(),
      value: String(rule.value || "").trim()
    }));
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

    const prevByAttribute = new Map();
    const nextByAttribute = new Map();

    prev.forEach((rule) => {
      const key = rule.attribute.toLowerCase();
      if (!key) return;
      prevByAttribute.set(key, rule);
    });

    next.forEach((rule) => {
      const key = rule.attribute.toLowerCase();
      if (!key) return;
      nextByAttribute.set(key, rule);
    });

    const allKeys = new Set([...prevByAttribute.keys(), ...nextByAttribute.keys()]);
    const lines = [];

    allKeys.forEach((key) => {
      const before = prevByAttribute.get(key);
      const after = nextByAttribute.get(key);
      const label = (after && after.attribute) || (before && before.attribute) || "Unknown Filter";

      if (!before && after) {
        lines.push(`Added filter "${label}": ${after.operator} ${formatFilterValue(after.value)}.`);
        return;
      }

      if (before && !after) {
        lines.push(`Removed filter "${label}" (was ${before.operator} ${formatFilterValue(before.value)}).`);
        return;
      }

      if (!before || !after) return;

      if (before.operator !== after.operator || before.value !== after.value) {
        lines.push(
          `Filter "${label}" changed: ${before.operator} ${formatFilterValue(before.value)} -> ${after.operator} ${formatFilterValue(after.value)}.`
        );
      }
    });

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
      if (Array.isArray(payload.filters) && payload.filters.length) {
        details.push(`Applied ${payload.filters.length} filter rule${payload.filters.length === 1 ? "" : "s"}.`);
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
        const count = Array.isArray(payload.filters) ? payload.filters.length : 0;
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

  function getSelectedMetricView() {
    const selected = metricViewSelect ? metricViewSelect.value : "";
    if (selected && METRIC_VIEWS[selected]) return selected;
    return "signup_success_rate";
  }

  function getSelectedTrendMode() {
    return trendModeRadios.find((radio) => radio.checked)?.value || "daily";
  }

  function renderSelectedMetricViews() {
    renderComparisonTable();
    renderTrendChart(getSelectedTrendMode());
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

    if (definition && definition.type === "dropdown") {
      const select = document.createElement("select");
      select.className = "rule-value";
      definition.values.forEach((value) => {
        select.appendChild(createOption(value));
      });
      if (currentValue && definition.values.includes(currentValue)) {
        select.value = currentValue;
      }
      return select;
    }

    if (definition && definition.type === "date") {
      const input = document.createElement("input");
      input.type = "date";
      input.className = "rule-value";
      input.value = currentValue || "";
      return input;
    }

    const input = document.createElement("input");
    input.type = "text";
    input.className = "rule-value";
    input.placeholder = "Type value here...";
    input.value = currentValue || "";
    return input;
  }

  function buildRuleRow(rule) {
    const row = document.createElement("div");
    row.className = "filter-rule-row";

    const attrWrap = document.createElement("label");
    attrWrap.className = "rule-field";
    attrWrap.textContent = "Attribute";

    const attrSelect = document.createElement("select");
    attrSelect.className = "rule-attribute";
    attrSelect.appendChild(createOption("", "Select attribute"));
    filterDefinitions.forEach((definition) => {
      attrSelect.appendChild(createOption(definition.name));
    });
    attrSelect.value = rule.attribute || "";
    attrWrap.appendChild(attrSelect);

    const opWrap = document.createElement("label");
    opWrap.className = "rule-field";
    opWrap.textContent = "Operator";

    const opSelect = document.createElement("select");
    opSelect.className = "rule-operator";
    OPERATORS.forEach((op) => opSelect.appendChild(createOption(op)));
    opSelect.value = rule.operator && OPERATORS.includes(rule.operator) ? rule.operator : "is";
    opWrap.appendChild(opSelect);

    const valueWrap = document.createElement("label");
    valueWrap.className = "rule-field";
    valueWrap.textContent = "Value";

    const valueHost = document.createElement("div");
    valueHost.className = "rule-value-host";
    valueWrap.appendChild(valueHost);

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-rule-btn";
    deleteBtn.textContent = "Delete";

    function renderValueInput() {
      const currentInput = valueHost.querySelector(".rule-value");
      const previousValue = currentInput ? currentInput.value : rule.value || "";
      const definition = getDefinition(attrSelect.value);

      valueHost.innerHTML = "";
      valueHost.appendChild(buildValueControl(definition, previousValue, opSelect.value));
    }

    attrSelect.addEventListener("change", renderValueInput);
    opSelect.addEventListener("change", renderValueInput);

    deleteBtn.addEventListener("click", () => {
      row.remove();
      if (!filterRulesContainer.children.length) {
        addFilterRule();
      }
    });

    row.appendChild(attrWrap);
    row.appendChild(opWrap);
    row.appendChild(valueWrap);
    row.appendChild(deleteBtn);

    row.__attrSelect = attrSelect;
    row.__refreshValue = renderValueInput;

    renderValueInput();
    return row;
  }

  function addFilterRule(rule) {
    filterRulesContainer.appendChild(
      buildRuleRow(
        rule || {
          attribute: "",
          operator: "is",
          value: ""
        }
      )
    );
  }

  function setFilterRules(rules) {
    filterRulesContainer.innerHTML = "";
    if (!Array.isArray(rules) || !rules.length) {
      addFilterRule();
      return;
    }

    rules.forEach((rule) => addFilterRule(rule));
  }

  function readFilterRules() {
    const rows = Array.from(filterRulesContainer.querySelectorAll(".filter-rule-row"));

    return rows
      .map((row) => {
        const attribute = row.querySelector(".rule-attribute").value;
        const operator = row.querySelector(".rule-operator").value;
        const valueControl = row.querySelector(".rule-value");
        const value = valueControl && !valueControl.disabled ? valueControl.value.trim() : "";
        return { attribute, operator, value };
      })
      .filter((rule) => rule.attribute);
  }

  function refreshRuleAttributes() {
    const rows = Array.from(filterRulesContainer.querySelectorAll(".filter-rule-row"));

    rows.forEach((row) => {
      const select = row.__attrSelect;
      if (!select) return;

      const current = select.value;
      select.innerHTML = "";
      select.appendChild(createOption("", "Select attribute"));
      filterDefinitions.forEach((definition) => {
        select.appendChild(createOption(definition.name));
      });
      select.value = filterDefinitions.some((d) => d.name === current) ? current : "";

      if (typeof row.__refreshValue === "function") {
        row.__refreshValue();
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

  function fillExperimentForm(values) {
    configForm.elements.experimentName.value = values.name;
    configForm.elements.featureName.value = values.featureName;
    configForm.elements.rollout.value = String(values.rollout);
    configForm.elements.scheduleAt.value = values.scheduleAt || "";
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

    if (tabName === "analytics") {
      renderAnalyticsView();
    }
    if (tabName === "history") {
      renderHistoryView();
    }
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

  function openExperiment(id, activeTab) {
    if (id === null || typeof id === "undefined") {
      editingExperimentId = null;
      editingExperimentStatus = null;
      configTitleMode.textContent = "(New)";
      fillExperimentForm(defaultFormPayload());
      updatePauseResumeButton(false, "Saved");
      showView("experiment-form");
      setActiveWorkspaceTab(activeTab || "configuration");
      return;
    }

    const experiment = getExperiments().find((item) => item.id === id);
    if (!experiment) return;

    editingExperimentId = id;
    editingExperimentStatus = experiment.status;
    configTitleMode.textContent = "(Edit)";

    const featureNameFallback =
      (experiment.config && experiment.config.featureName && experiment.config.featureName.trim()) ||
      experiment.name;

    fillExperimentForm({
      name: experiment.name,
      featureName: featureNameFallback,
      rollout: Number(experiment.config.rollout || 50),
      scheduleAt: experiment.config.scheduleAt || "",
      filters: Array.isArray(experiment.config.filters) ? experiment.config.filters : []
    });

    updatePauseResumeButton(true, experiment.status);
    showView("experiment-form");
    setActiveWorkspaceTab(activeTab || "configuration");
  }

  function readExperimentPayloadFromForm() {
    return {
      name: configForm.elements.experimentName.value.trim(),
      featureName: configForm.elements.featureName.value.trim(),
      rollout: Number(configForm.elements.rollout.value),
      scheduleAt: configForm.elements.scheduleAt.value,
      filters: readFilterRules()
    };
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

  function upsertExperiment(payload, intent) {
    const experiments = getExperiments();
    const now = new Date().toISOString().slice(0, 10);
    const nowTs = Date.now();
    const lastModifiedAt = new Date(nowTs).toISOString();
    const actor = getActorLabel();

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
          filters: payload.filters
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
      experiments.unshift(newExperiment);
    } else {
      const target = experiments.find((item) => item.id === editingExperimentId);
      if (!target) return;

      const previousSnapshot = {
        name: target.name,
        status: target.status,
        config: {
          featureName: target.config && target.config.featureName ? target.config.featureName : "",
          rollout: Number(target.config && typeof target.config.rollout !== "undefined" ? target.config.rollout : 0),
          scheduleAt: target.config && target.config.scheduleAt ? target.config.scheduleAt : "",
          filters: target.config && Array.isArray(target.config.filters) ? target.config.filters : []
        }
      };

      const status = resolveStatus(intent, payload, target.status, false);

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
      target.config.filters = payload.filters;

      const action = getIntentActionLabel(intent, false, previousSnapshot.status);
      const details = buildHistoryDetails(previousSnapshot, payload, status, false);
      addHistoryEntry(target, {
        at: lastModifiedAt,
        actor,
        action,
        summary: details.length ? `${details.length} change${details.length === 1 ? "" : "s"} recorded.` : "No field-level changes.",
        details
      });
    }

    saveExperiments(experiments);

    if (editingExperimentId !== null) {
      editingExperimentStatus = resolveStatus(intent, payload, editingExperimentStatus, false);
      updatePauseResumeButton(true, editingExperimentStatus);
    }
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function computeCumulativeSeries(values) {
    const result = [];
    let running = 0;
    for (let i = 0; i < values.length; i += 1) {
      running += values[i];
      result.push(Number((running / (i + 1)).toFixed(2)));
    }
    return result;
  }

  function generateMockAnalytics() {
    const controlUsers = Math.round(randomInRange(50000, 90000));
    const testUsers = Math.round(randomInRange(50000, 90000));
    const totalUsers = controlUsers + testUsers;

    const guardrails = [
      { name: "Latency", delta: Number(randomInRange(-4, 6).toFixed(2)) },
      { name: "Crash Rate", delta: Number(randomInRange(-2, 3).toFixed(2)) },
      { name: "Support Tickets", delta: Number(randomInRange(-3, 5).toFixed(2)) }
    ];

    const atRisk = guardrails.filter((g) => g.delta < -1.5).length;

    const signupControlDaily = Array.from({ length: 8 }, () => Number(randomInRange(54, 66).toFixed(2)));
    const signupTestDaily = signupControlDaily.map((value) => Number((value * (1 + randomInRange(-0.04, 0.1))).toFixed(2)));

    const retentionControlDaily = Array.from({ length: 7 }, (_v, index) =>
      Number((31 - index * randomInRange(0.9, 1.3)).toFixed(2))
    );
    const retentionTestDaily = retentionControlDaily.map((value) => Number((value * (1 + randomInRange(0.03, 0.14))).toFixed(2)));

    const conversionControlDaily = Array.from({ length: 8 }, () => Number(randomInRange(8, 18).toFixed(2)));
    const conversionTestDaily = conversionControlDaily.map((value) => Number((value * (1 + randomInRange(-0.07, 0.12))).toFixed(2)));

    const signupControlAvg = Number((signupControlDaily.reduce((sum, value) => sum + value, 0) / signupControlDaily.length).toFixed(2));
    const signupTestAvg = Number((signupTestDaily.reduce((sum, value) => sum + value, 0) / signupTestDaily.length).toFixed(2));
    const retentionControlAvg = Number(
      (retentionControlDaily.reduce((sum, value) => sum + value, 0) / retentionControlDaily.length).toFixed(2)
    );
    const retentionTestAvg = Number(
      (retentionTestDaily.reduce((sum, value) => sum + value, 0) / retentionTestDaily.length).toFixed(2)
    );
    const conversionControlAvg = Number(
      (conversionControlDaily.reduce((sum, value) => sum + value, 0) / conversionControlDaily.length).toFixed(2)
    );
    const conversionTestAvg = Number(
      (conversionTestDaily.reduce((sum, value) => sum + value, 0) / conversionTestDaily.length).toFixed(2)
    );

    const conversionLift = Number((((conversionTestAvg - conversionControlAvg) / Math.max(conversionControlAvg, 0.1)) * 100).toFixed(2));
    const pValue = Number(randomInRange(0.01, 0.19).toFixed(3));
    const significant = pValue < 0.05;
    const recommendation = significant && conversionLift > 0 ? "Likely Ship" : significant && conversionLift < 0 ? "Stop" : "Wait";

    return {
      lift: conversionLift,
      significant,
      totalUsers,
      variantUsers: { control: controlUsers, test: testUsers },
      atRisk,
      recommendation,
      metrics: {
        signup_success_rate: {
          pValue: Number(randomInRange(0.02, 0.14).toFixed(3)),
          summaryControl: signupControlAvg,
          summaryTest: signupTestAvg,
          trend: {
            labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            dailyControl: signupControlDaily,
            dailyTest: signupTestDaily,
            cumulativeControl: computeCumulativeSeries(signupControlDaily),
            cumulativeTest: computeCumulativeSeries(signupTestDaily)
          }
        },
        day1_day7_retention: {
          pValue: Number(randomInRange(0.01, 0.1).toFixed(3)),
          summaryControl: retentionControlAvg,
          summaryTest: retentionTestAvg,
          trend: {
            labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
            dailyControl: retentionControlDaily,
            dailyTest: retentionTestDaily,
            cumulativeControl: computeCumulativeSeries(retentionControlDaily),
            cumulativeTest: computeCumulativeSeries(retentionTestDaily)
          }
        },
        conversion_rate: {
          pValue: pValue,
          summaryControl: conversionControlAvg,
          summaryTest: conversionTestAvg,
          trend: {
            labels: ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"],
            dailyControl: conversionControlDaily,
            dailyTest: conversionTestDaily,
            cumulativeControl: computeCumulativeSeries(conversionControlDaily),
            cumulativeTest: computeCumulativeSeries(conversionTestDaily)
          }
        }
      },
      segmentation: {
        newUsers: {
          control: `${randomInRange(8, 16).toFixed(2)}%`,
          test: `${randomInRange(8, 18).toFixed(2)}%`
        },
        returningUsers: {
          control: `${randomInRange(10, 20).toFixed(2)}%`,
          test: `${randomInRange(10, 22).toFixed(2)}%`
        }
      },
      guardrails,
      stats: {
        pValue: pValue.toFixed(3),
        power: `${randomInRange(70, 96).toFixed(1)}%`,
        mde: `${randomInRange(1.5, 5.5).toFixed(2)}%`
      }
    };
  }

  function renderComparisonTable() {
    if (!currentAnalyticsData) return;

    const metricKey = getSelectedMetricView();
    const metricData = currentAnalyticsData.metrics && currentAnalyticsData.metrics[metricKey];
    if (!metricData) return;

    const controlUsers = currentAnalyticsData.variantUsers ? currentAnalyticsData.variantUsers.control : 0;
    const testUsers = currentAnalyticsData.variantUsers ? currentAnalyticsData.variantUsers.test : 0;
    const controlValue = Number(metricData.summaryControl || 0);
    const testValue = Number(metricData.summaryTest || 0);
    const lift = Number((((testValue - controlValue) / Math.max(controlValue, 0.1)) * 100).toFixed(2));

    comparisonTableBody.innerHTML = "";
    [
      {
        variant: "Control",
        users: controlUsers,
        value: `${controlValue.toFixed(2)}%`,
        lift: "-",
        pValue: "-",
        rowClass: "comparison-control-row"
      },
      {
        variant: "Test",
        users: testUsers,
        value: `${testValue.toFixed(2)}%`,
        lift: `${lift > 0 ? "+" : ""}${lift.toFixed(2)}%`,
        pValue: Number(metricData.pValue || 0).toFixed(3),
        rowClass: "comparison-test-row"
      }
    ].forEach((row) => {
      const tr = document.createElement("tr");
      tr.className = row.rowClass;
      tr.innerHTML = `
        <td>${row.variant}</td>
        <td>${row.users.toLocaleString()}</td>
        <td>${row.value}</td>
        <td>${row.lift}</td>
        <td>${row.pValue}</td>
      `;
      comparisonTableBody.appendChild(tr);
    });
  }

  function renderTrendChart(mode) {
    if (!currentAnalyticsData || !trendChartCanvas || typeof Chart === "undefined") return;

    const metricKey = getSelectedMetricView();
    const metricData = currentAnalyticsData.metrics && currentAnalyticsData.metrics[metricKey];
    if (!metricData || !metricData.trend) return;

    const trend = metricData.trend;
    const controlSeries = mode === "cumulative" ? trend.cumulativeControl : trend.dailyControl;
    const testSeries = mode === "cumulative" ? trend.cumulativeTest : trend.dailyTest;

    const data = {
      labels: trend.labels,
      datasets: [
        {
          label: "Control",
          data: controlSeries,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59,130,246,0.15)",
          tension: 0.35,
          fill: false
        },
        {
          label: "Test",
          data: testSeries,
          borderColor: "#6C63FF",
          backgroundColor: "rgba(108,99,255,0.15)",
          tension: 0.35,
          fill: false
        }
      ]
    };

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
        plugins: { legend: { position: "top" } },
        scales: {
          y: {
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

  function renderAnalyticsView() {
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
      return;
    }

    analyticsEmptyState.style.display = "none";
    analyticsDataSections.style.display = "grid";

    currentAnalyticsData = generateMockAnalytics();

    kpiLift.textContent = `${currentAnalyticsData.lift > 0 ? "+" : ""}${currentAnalyticsData.lift.toFixed(2)}%`;
    kpiLift.className = currentAnalyticsData.lift >= 0 ? "kpi-positive" : "kpi-negative";

    kpiSignificance.textContent = currentAnalyticsData.significant ? "Significant" : "Inconclusive";
    kpiUsers.textContent = currentAnalyticsData.totalUsers.toLocaleString();
    kpiGuardrails.textContent = currentAnalyticsData.atRisk > 0 ? `${currentAnalyticsData.atRisk} At Risk` : "All Healthy";
    kpiGuardrails.className = currentAnalyticsData.atRisk > 0 ? "kpi-negative" : "kpi-positive";
    kpiRecommendation.textContent = currentAnalyticsData.recommendation;

    renderSelectedMetricViews();

    segmentationBreakdown.innerHTML = `
      <div><strong>New Users - Control:</strong> ${currentAnalyticsData.segmentation.newUsers.control}</div>
      <div><strong>New Users - Test:</strong> ${currentAnalyticsData.segmentation.newUsers.test}</div>
      <div><strong>Returning - Control:</strong> ${currentAnalyticsData.segmentation.returningUsers.control}</div>
      <div><strong>Returning - Test:</strong> ${currentAnalyticsData.segmentation.returningUsers.test}</div>
    `;

    guardrailGrid.innerHTML = "";
    currentAnalyticsData.guardrails.forEach((item) => {
      const cell = document.createElement("div");
      const deltaText = `${item.delta > 0 ? "+" : ""}${item.delta.toFixed(2)}%`;
      cell.className = item.delta < 0 ? "guardrail-item is-risk" : "guardrail-item";
      cell.innerHTML = `<p>${item.name}</p><strong>${deltaText}</strong>`;
      guardrailGrid.appendChild(cell);
    });

    statsGrid.innerHTML = `
      <div><strong>P-value:</strong> ${currentAnalyticsData.stats.pValue}</div>
      <div><strong>Power:</strong> ${currentAnalyticsData.stats.power}</div>
      <div><strong>MDE:</strong> ${currentAnalyticsData.stats.mde}</div>
    `;
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
    rolloutControl.addEventListener("input", () => {
      rolloutValue.textContent = `${rolloutControl.value}%`;
    });

    scheduleBtn.addEventListener("click", () => {
      scheduleWrap.style.display = scheduleWrap.style.display === "none" ? "block" : "none";
    });

    configCloseBtn.addEventListener("click", () => {
      openDashboardView();
    });

    configBackBtn.addEventListener("click", () => {
      openDashboardView();
    });

    pauseResumeBtn.addEventListener("click", () => {
      if (editingExperimentId === null) return;

      const action = pauseResumeBtn.dataset.action;
      if (action !== "pause" && action !== "resume") return;

      const payload = readExperimentPayloadFromForm();
      if (!payload.name) payload.name = "Untitled Experiment";
      if (!payload.featureName) payload.featureName = "Untitled Feature";

      upsertExperiment(payload, action);
      openDashboardView();
    });

    testBtn.addEventListener("click", () => {
      alert("User falls into bucket A");
    });

    addFilterRuleBtn.addEventListener("click", () => addFilterRule());

    configForm.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    saveDraftBtn.addEventListener("click", () => {
      const payload = readExperimentPayloadFromForm();
      if (!payload.name) payload.name = "Untitled Experiment";
      if (!payload.featureName) payload.featureName = "Untitled Feature";

      upsertExperiment(payload, "draft");
      openDashboardView();
    });

    publishExperimentBtn.addEventListener("click", () => {
      const payload = readExperimentPayloadFromForm();
      if (!payload.name && !payload.featureName) {
        alert("Experiment Name and Feature Name are required.");
        return;
      }

      if (!payload.name) {
        alert("Experiment Name is required.");
        return;
      }

      if (!payload.featureName) {
        alert("Feature Name is required.");
        return;
      }

      upsertExperiment(payload, "publish");
      openDashboardView();
    });
  }

  function setupAnalyticsEvents() {
    trendModeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (!radio.checked) return;
        renderSelectedMetricViews();
      });
    });

    metricViewSelect.addEventListener("change", () => {
      renderSelectedMetricViews();
    });
  }

  function setupMetadataEvents() {
    manageMetadataBtn.addEventListener("click", openMetadataModal);
    closeMetadataBtn.addEventListener("click", closeMetadataModal);

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
        alert("Field Name is required.");
        return;
      }

      if (type === "dropdown" && !values.length) {
        alert("Allowed Values are required for Dropdown type.");
        return;
      }

      const duplicate = filterDefinitions.some((definition) => definition.name.toLowerCase() === name.toLowerCase());
      if (duplicate) {
        alert("This filter definition already exists.");
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

    recentList.addEventListener("click", (event) => {
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
      }
    });

    profileBtn.addEventListener("click", () => showView("profile"));
    backToDashboardBtn.addEventListener("click", () => openDashboardView());

    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_USER_KEY);
      localStorage.removeItem(PENDING_EDIT_KEY);
      localStorage.removeItem(PENDING_TAB_KEY);
      currentUser = null;
      updateRoleUI();
      authForm.reset();
      signupForm.reset();
      authMessage.textContent = "";
      signupMessage.textContent = "";
      showView("login");
    });
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

    authForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.getElementById("email").value.trim().toLowerCase();
      const password = authPasswordInput.value;

      const user = findUserByCredentials(email, password);
      if (!user) {
        authMessage.textContent = "Invalid credentials.";
        return;
      }

      setActiveSessionFromUser(user);

      authMessage.textContent = "";
      updateRoleUI();
      checkExperimentStatus();
      refreshRecentList();

      const pendingEditId = Number(localStorage.getItem(PENDING_EDIT_KEY));
      if (!Number.isNaN(pendingEditId) && pendingEditId > 0) {
        const pendingTab = localStorage.getItem(PENDING_TAB_KEY) || "configuration";
        localStorage.removeItem(PENDING_EDIT_KEY);
        localStorage.removeItem(PENDING_TAB_KEY);
        openExperiment(pendingEditId, pendingTab);
      } else {
        openDashboardView();
      }
    });

    signupForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = signupEmailInput.value.trim().toLowerCase();
      const password = signupPasswordInput.value;
      const confirmPassword = signupConfirmPasswordInput.value;

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
        alert("User already exists.");
        return;
      }

      const users = getStoredUsers();
      const newUser = { email, password, role: "user" };
      users.push(newUser);
      saveStoredUsers(users);
      setActiveSessionFromUser(newUser);

      signupMessage.textContent = "";
      signupForm.reset();
      updateRoleUI();
      openDashboardView();
    });
  }

  function bootSession() {
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
        name: getUserDisplayName(user.email, user.role)
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
    checkExperimentStatus();
    refreshRecentList();

    const pendingEditId = Number(localStorage.getItem(PENDING_EDIT_KEY));
    if (!Number.isNaN(pendingEditId) && pendingEditId > 0) {
      const pendingTab = localStorage.getItem(PENDING_TAB_KEY) || "configuration";
      localStorage.removeItem(PENDING_EDIT_KEY);
      localStorage.removeItem(PENDING_TAB_KEY);
      openExperiment(pendingEditId, pendingTab);
    } else {
      openDashboardView();
    }
  }

  setupLoginUI();
  setupWorkspaceTabs();
  setupAuthEvents();
  setupDashboardEvents();
  setupExperimentFormEvents();
  setupMetadataEvents();
  setupAnalyticsEvents();
  bootSession();
})();
