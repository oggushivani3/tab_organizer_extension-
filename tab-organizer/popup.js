function getDomain(url) {
  try {
    const u = new URL(url);
    if (u.protocol.startsWith("chrome") || u.protocol.startsWith("about")) {
      return u.protocol.replace(":", "") + " pages";
    }
    return u.hostname.replace(/^www\./, "");
  } catch (e) {
    return "other";
  }
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
  if (msg) setTimeout(() => (document.getElementById("status").textContent = ""), 2500);
}

async function render() {
  const tabs = await chrome.tabs.query({});
  const windows = new Set(tabs.map((t) => t.windowId));

  document.getElementById("tabCount").textContent = tabs.length;
  document.getElementById("subLine").textContent =
    `across ${windows.size} window${windows.size === 1 ? "" : "s"}`;

  const counts = {};
  for (const t of tabs) {
    const d = getDomain(t.url || "");
    counts[d] = (counts[d] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const list = document.getElementById("domainList");
  list.innerHTML = "";

  if (sorted.length === 0) {
    list.innerHTML = '<div class="empty">No tabs found</div>';
    return;
  }

  for (const [domain, count] of sorted) {
    const row = document.createElement("div");
    row.className = "domain-row";
    row.innerHTML = `
      <span class="domain-name" title="${domain}">${domain}</span>
      <span class="domain-badge">${count}</span>
    `;
    list.appendChild(row);
  }
}

async function closeDuplicates() {
  const tabs = await chrome.tabs.query({});
  const seen = new Set();
  const toClose = [];

  for (const t of tabs) {
    const key = t.url;
    if (!key) continue;
    if (seen.has(key)) {
      toClose.push(t.id);
    } else {
      seen.add(key);
    }
  }

  if (toClose.length === 0) {
    setStatus("No duplicates found");
    return;
  }

  await chrome.tabs.remove(toClose);
  setStatus(`Closed ${toClose.length} duplicate tab${toClose.length === 1 ? "" : "s"}`);
  render();
}

async function groupByDomain() {
  if (!chrome.tabGroups) {
    setStatus("Grouping not supported in this browser");
    return;
  }

  const tabs = await chrome.tabs.query({ currentWindow: true });
  const byDomain = {};

  for (const t of tabs) {
    const d = getDomain(t.url || "");
    if (!byDomain[d]) byDomain[d] = [];
    byDomain[d].push(t.id);
  }

  let groupedCount = 0;
  for (const [domain, ids] of Object.entries(byDomain)) {
    if (ids.length < 2) continue; // only group domains with 2+ tabs
    const groupId = await chrome.tabs.group({ tabIds: ids });
    await chrome.tabGroups.update(groupId, { title: domain });
    groupedCount++;
  }

  setStatus(groupedCount ? `Grouped ${groupedCount} site${groupedCount === 1 ? "" : "s"}` : "Nothing to group (no repeat sites)");
}

document.getElementById("closeDupes").addEventListener("click", closeDuplicates);
document.getElementById("groupByDomain").addEventListener("click", groupByDomain);

render();
