const LEGACY_SEGMENT_LABELS = {
  userType: "User Type",
  userStatus: "User Status",
  tmxFlag: "TMX Flag",
  classFlag: "Class Flag",
  contentFlag: "Content Flag",
  acadStage: "Current ACAD Stage",
  trialPaid: "Trial Paid",
  mandatePaid: "Mandate Paid"
};

function makeDefaultConfig() {
  return {
    featureName: "",
    rollout: 50,
    scheduleAt: "",
    filters: []
  };
}

function legacySegmentsToFilters(segments) {
  if (!segments || typeof segments !== "object") return [];

  return Object.keys(LEGACY_SEGMENT_LABELS)
    .map((key) => {
      const rawValue = segments[key];
      if (typeof rawValue === "undefined" || rawValue === null || String(rawValue).trim() === "") return null;
      return {
        attribute: LEGACY_SEGMENT_LABELS[key],
        operator: "is",
        value: String(rawValue)
      };
    })
    .filter(Boolean);
}

function withDefaults(experiment) {
  const config = {
    ...makeDefaultConfig(),
    ...(experiment.config || {})
  };

  const updatedAtTs =
    typeof experiment.updatedAtTs === "number"
      ? experiment.updatedAtTs
      : Number(new Date(`${experiment.updatedAt || "1970-01-01"}T00:00:00`).getTime());

  const filters = Array.isArray(config.filters) && config.filters.length
    ? config.filters
    : legacySegmentsToFilters(config.segments);

  const history = Array.isArray(experiment.history) ? experiment.history : [];
  if (!history.length) {
    const baselineDate = experiment.updatedAt ? `${experiment.updatedAt}T09:00:00.000Z` : new Date().toISOString();
    history.push({
      id: Number(experiment.id || Date.now()) * 1000,
      at: baselineDate,
      actor: experiment.owner || "System",
      action: "Baseline Snapshot",
      summary: "Experiment imported into workspace.",
      details: ["Initial state available from this point."]
    });
  }

  let lastEditedBy = experiment.lastEditedBy || "";
  if (!lastEditedBy && history.length) {
    lastEditedBy = String(history[0].actor || "").trim();
  }

  return {
    ...experiment,
    status: experiment.status || "Planned",
    updatedAtTs,
    history,
    lastEditedBy,
    config: {
      ...config,
      filters
    }
  };
}

function formatUpdatedAtLabel(experiment) {
  const raw = experiment.lastModifiedAt || (experiment.updatedAt ? `${experiment.updatedAt}T00:00:00` : "");
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return experiment.updatedAt || "-";

  const datePart = parsed.toISOString().slice(0, 10);
  const timePart = parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${datePart} ${timePart}`;
}

const seedExperiments = [
  {
    id: 1,
    name: "Homepage CTA Copy Test",
    owner: "Priya",
    status: "Running",
    updatedAt: "2026-02-08",
    config: {
      featureName: "Homepage CTA",
      rollout: 50,
      filters: [
        { attribute: "User Type", operator: "is", value: "1" },
        { attribute: "Current ACAD Stage", operator: "is", value: "College" }
      ]
    }
  },
  {
    id: 2,
    name: "Pricing Card Order",
    owner: "Ravi",
    status: "Planned",
    updatedAt: "2026-02-06",
    config: {
      featureName: "Pricing Layout",
      rollout: 30,
      filters: [{ attribute: "User Status", operator: "is", value: "1" }]
    }
  },
  {
    id: 3,
    name: "Signup Form Variant",
    owner: "Lena",
    status: "Completed",
    updatedAt: "2026-02-02",
    config: {
      featureName: "Signup UX",
      rollout: 100,
      filters: [{ attribute: "Trial Paid", operator: "is", value: "1" }]
    }
  },
  {
    id: 4,
    name: "Navigation Label Test",
    owner: "Aman",
    status: "Running",
    updatedAt: "2026-02-01",
    config: {
      featureName: "Nav Labels",
      rollout: 45,
      filters: [{ attribute: "Class Flag", operator: "is", value: "1" }]
    }
  },
  {
    id: 5,
    name: "Hero Image Version B",
    owner: "Mira",
    status: "Completed",
    updatedAt: "2026-01-29",
    config: {
      featureName: "Hero Banner",
      rollout: 100,
      filters: [{ attribute: "Content Flag", operator: "is", value: "1" }]
    }
  },
  {
    id: 6,
    name: "Checkout Button Color",
    owner: "Arjun",
    status: "Planned",
    updatedAt: "2026-01-26",
    config: {
      featureName: "Checkout CTA",
      rollout: 20,
      filters: [{ attribute: "User Type", operator: "is", value: "2" }]
    }
  },
  {
    id: 7,
    name: "Email Capture Modal Timing",
    owner: "Neha",
    status: "Running",
    updatedAt: "2026-01-24",
    config: {
      featureName: "Modal Timing",
      rollout: 60,
      filters: [{ attribute: "Mandate Paid", operator: "is", value: "1" }]
    }
  }
];

function getExperiments() {
  const raw = localStorage.getItem("experiments");
  if (raw) {
    return JSON.parse(raw).map(withDefaults);
  }

  const seeded = seedExperiments.map(withDefaults);
  localStorage.setItem("experiments", JSON.stringify(seeded));
  return seeded;
}

function saveExperiments(experiments) {
  localStorage.setItem("experiments", JSON.stringify(experiments));
}

function normalize(value) {
  return String(value || "").toLowerCase().trim();
}

function filterExperiments(experiments, query) {
  if (!query) return experiments;
  const q = normalize(query);
  return experiments.filter((item) => {
    return normalize(item.name).includes(q) || normalize(item.owner).includes(q);
  });
}

function sortExperimentsByRecency(experiments) {
  return [...experiments].sort((a, b) => {
    const aTs = typeof a.updatedAtTs === "number" ? a.updatedAtTs : 0;
    const bTs = typeof b.updatedAtTs === "number" ? b.updatedAtTs : 0;
    if (aTs !== bTs) return bTs - aTs;

    const aDate = Number(new Date(`${a.updatedAt || "1970-01-01"}T00:00:00`).getTime());
    const bDate = Number(new Date(`${b.updatedAt || "1970-01-01"}T00:00:00`).getTime());
    if (aDate !== bDate) return bDate - aDate;

    return Number(b.id || 0) - Number(a.id || 0);
  });
}

function renderList(listEl, emptyEl, experiments, options = {}) {
  listEl.innerHTML = "";

  if (!experiments.length) {
    emptyEl.hidden = false;
    return;
  }

  emptyEl.hidden = true;
  const showEdit = Boolean(options.showEdit);
  const actionMode = options.actionMode || (showEdit ? "edit" : "none");

  experiments.forEach((experiment) => {
    const li = document.createElement("li");
    li.className = "experiment-item";
    li.dataset.id = String(experiment.id);

    const statusClass = String(experiment.status || "planned").toLowerCase();
    const rollout = experiment.config && typeof experiment.config.rollout !== "undefined" ? experiment.config.rollout : 0;

    let actionsMarkup = "";
    if (actionMode === "workspace") {
      actionsMarkup = `
        <div class="list-action-group">
          <button type="button" class="icon-action analyze-action" data-action="analyze" title="Analyze" aria-label="Analyze">📊</button>
          <button type="button" class="icon-action edit-action" data-action="edit" title="Edit" aria-label="Edit">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 20h4l10-10a2 2 0 0 0-4-4L4 16v4zM13 7l4 4" />
            </svg>
          </button>
        </div>
      `;
    } else if (showEdit) {
      actionsMarkup = `<button type="button" class="edit-btn" data-action="edit">Edit</button>`;
    }

    li.innerHTML = `
      <div class="experiment-main">
        <p class="experiment-title">${experiment.name}</p>
        <p class="experiment-meta">Owner: ${experiment.owner} | Updated: ${formatUpdatedAtLabel(experiment)}${experiment.lastEditedBy ? ` | Last edited by: ${experiment.lastEditedBy}` : ""}</p>
      </div>
      <div class="experiment-actions">
        <span class="rollout-pill" title="Rollout percentage">${rollout}%</span>
        <span class="status ${statusClass}" title="Experiment Status">${experiment.status}</span>
        ${actionsMarkup}
      </div>
    `;

    listEl.appendChild(li);
  });
}
