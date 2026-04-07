// doctorscan — DevTools panel main logic

(function() {
  "use strict";

  // =========================================================================
  // State
  // =========================================================================
  const state = {
    framework: null,       // { framework, confidence, signals }
    allFrameworks: [],      // all detected frameworks
    paths: [],
    sources: [],            // CSPT chains (param -> fetch flows)
    paramSources: [],       // Standalone param accessor detections
    apiCalls: [],           // API calls with dynamic params
    liveSources: [],        // runtime-detected CSPT flows
    scannedUrls: new Set(),
    isScanning: false,
    isMonitoring: false,
    monitorInterval: null,
    pageUrl: "",
    selectedEncodingFramework: null,
  };

  // =========================================================================
  // DevTools API helpers
  // =========================================================================
  function evalInPage(expression) {
    return new Promise((resolve) => {
      chrome.devtools.inspectedWindow.eval(expression, (result, exceptionInfo) => {
        if (exceptionInfo) resolve(null);
        else resolve(result);
      });
    });
  }

  function getHAR() {
    return new Promise((resolve) => {
      try {
        chrome.devtools.network.getHAR((harLog) => resolve(harLog));
      } catch {
        resolve({ entries: [] });
      }
    });
  }

  function getResources() {
    return new Promise((resolve) => {
      try {
        chrome.devtools.inspectedWindow.getResources((resources) => resolve(resources || []));
      } catch {
        resolve([]);
      }
    });
  }

  function getResourceContent(resource) {
    return new Promise((resolve) => {
      try {
        resource.getContent((content) => resolve(content || ""));
      } catch {
        resolve("");
      }
    });
  }

  function getHAREntryContent(entry) {
    return new Promise((resolve) => {
      if (entry.response && entry.response.content && entry.response.content.text) {
        resolve(entry.response.content.text);
      } else if (entry.getContent) {
        try {
          entry.getContent((content) => resolve(content || ""));
        } catch {
          resolve("");
        }
      } else {
        resolve("");
      }
    });
  }

  // =========================================================================
  // Analysis
  // =========================================================================
  function analyzeContent(content, contentType, sourceUrl) {
    if (!content || content.length < 10) return;
    if (state.scannedUrls.has(sourceUrl) && sourceUrl !== "page") return;
    state.scannedUrls.add(sourceUrl);

    // Framework detection — accumulate across all resources
    const detected = DoctorScan.detectAllFrameworks(content);
    if (detected.length > 0) {
      for (const d of detected) {
        const existing = state.allFrameworks.find(f => f.framework === d.framework);
        if (existing) {
          existing.confidence = Math.min(100, existing.confidence + d.confidence);
          for (const s of d.signals) {
            if (!existing.signals.includes(s)) existing.signals.push(s);
          }
        } else {
          state.allFrameworks.push({ ...d });
        }
      }
      state.allFrameworks.sort((a, b) => b.confidence - a.confidence);
      if (state.allFrameworks.length > 0) {
        state.framework = state.allFrameworks[0];
      }
    }

    // Path extraction
    const fw = state.framework ? state.framework.framework : "unknown";
    const paths = DoctorScan.extractPaths(content, fw, sourceUrl, contentType);
    for (const p of paths) {
      const key = `${p.path}|${p.type}`;
      if (!state.paths.some(e => `${e.path}|${e.type}` === key)) {
        state.paths.push(p);
      }
    }

    // CSPT Source analysis (combined chains)
    const sources = DoctorScan.analyzeSources(content, fw, sourceUrl);
    for (const s of sources) {
      const key = `${s.type}|${s.lineContext.substring(0, 80)}`;
      if (!state.sources.some(e => `${e.type}|${e.lineContext.substring(0, 80)}` === key)) {
        state.sources.push(s);
      }
    }

    // Standalone param source detection
    const paramSources = DoctorScan.analyzeParamSources(content, fw, sourceUrl, contentType);
    for (const p of paramSources) {
      const key = `${p.type}|${p.lineNumber}|${sourceUrl}`;
      if (!state.paramSources.some(e => `${e.type}|${e.lineNumber}|${e.source}` === key)) {
        state.paramSources.push(p);
      }
    }

    // API call detection
    const apiCalls = DoctorScan.analyzeApiCalls(content, fw, sourceUrl);
    for (const a of apiCalls) {
      const key = `${a.type}|${a.lineNumber}|${sourceUrl}`;
      if (!state.apiCalls.some(e => `${e.type}|${e.lineNumber}|${e.source}` === key)) {
        state.apiCalls.push(a);
      }
    }
  }

  function getContentTypeFromUrl(url) {
    if (!url) return "other";
    const lower = url.toLowerCase();
    if (lower.endsWith(".js") || lower.endsWith(".mjs") || lower.endsWith(".cjs")) return "js";
    if (lower.endsWith(".html") || lower.endsWith(".htm") || lower === "page") return "html";
    if (lower.includes("/api/") || lower.includes("/graphql")) return "js";
    return "other";
  }

  function getContentTypeFromMime(mimeType) {
    if (!mimeType) return "other";
    const ct = mimeType.toLowerCase();
    if (ct.includes("html") || ct.includes("xhtml")) return "html";
    if (ct.includes("javascript") || ct.includes("ecmascript")) return "js";
    // Next.js RSC Flight payloads — scan as JS (RSC false-positive filters handle the rest)
    if (ct.includes("x-component") || ct.includes("rsc")) return "js";
    return "other";
  }

  // =========================================================================
  // Scan flow
  // =========================================================================
  function log(msg) {
    console.log("[doctorscan]", msg);
  }

  async function scan() {
    try {
      state.isScanning = true;
      setStatus("Scanning...", "scanning");
      log("Scan started");

      if (!chrome.devtools || !chrome.devtools.inspectedWindow) {
        setStatus("Error: DevTools API not available", "error");
        log("chrome.devtools.inspectedWindow not available");
        state.isScanning = false;
        return;
      }

      // 1. Get page URL
      log("Step 1: Getting page URL");
      state.pageUrl = await evalInPage("location.href") || "";
      document.getElementById("page-url").textContent = state.pageUrl;
      log("Page URL: " + state.pageUrl);

      // 2. Get page HTML via eval
      setStatus("Scanning page HTML...", "scanning");
      log("Step 2: Getting page HTML");
      const html = await evalInPage("document.documentElement.outerHTML");
      log("HTML length: " + (html ? html.length : "null"));
      if (html) {
        analyzeContent(html, "html", "page");
        log("After HTML: fw=" + (state.framework ? state.framework.framework : "none") + " paths=" + state.paths.length + " sources=" + state.sources.length);
      }

      // 3. Check runtime globals
      setStatus("Checking runtime globals...", "scanning");
      log("Step 3: Checking globals");
      try {
        const globals = await evalInPage(`JSON.stringify({
          hasNextData: typeof __NEXT_DATA__ !== 'undefined',
          hasNuxt: typeof __NUXT__ !== 'undefined',
          hasSveltekit: typeof __sveltekit !== 'undefined',
          hasEmber: typeof Ember !== 'undefined',
          hasAngularNg: typeof ng !== 'undefined',
          hasReactRoot: !!document.querySelector('[data-reactroot], #__next, #root'),
          hasSolid: typeof _$HY !== 'undefined',
          hasAstroIsland: !!document.querySelector('astro-island'),
          hasVueApp: typeof __vue_app__ !== 'undefined' || !!document.querySelector('[data-v-]'),
          nextDataPage: typeof __NEXT_DATA__ !== 'undefined' ? __NEXT_DATA__.page : null,
        })`);
        log("Globals: " + globals);

        if (globals) {
          const g = JSON.parse(globals);
          if (g.nextDataPage) {
            const key = `${g.nextDataPage}|route`;
            if (!state.paths.some(e => `${e.path}|${e.type}` === key)) {
              state.paths.push({
                path: g.nextDataPage, type: "route", source: "__NEXT_DATA__",
                framework: "nextjs", isDynamic: g.nextDataPage.includes("["),
              });
            }
          }
        }
      } catch (e) {
        log("Globals check failed: " + e.message);
      }

      // 4. Scan loaded resources
      setStatus("Scanning loaded resources...", "scanning");
      log("Step 4: Getting resources");
      try {
        const resources = await getResources();
        log("Resources: " + resources.length);
        const scriptResources = resources.filter(r => r.type === "script" || r.type === "document");
        log("Scripts/docs: " + scriptResources.length);

        for (const resource of scriptResources) {
          if (state.scannedUrls.has(resource.url)) continue;
          try {
            const content = await getResourceContent(resource);
            if (content) {
              const type = resource.type === "document" ? "html" : "js";
              analyzeContent(content, type, resource.url);
            }
          } catch (e) {
            log("Resource error " + resource.url + ": " + e.message);
          }
        }
        log("After resources: paths=" + state.paths.length + " sources=" + state.sources.length);
      } catch (e) {
        log("getResources failed: " + e.message);
      }

      // 5. Scan HAR entries
      setStatus("Scanning network history...", "scanning");
      log("Step 5: Getting HAR");
      try {
        const har = await getHAR();
        const entryCount = har && har.entries ? har.entries.length : 0;
        log("HAR entries: " + entryCount);

        if (har && har.entries) {
          for (const entry of har.entries) {
            const url = entry.request ? entry.request.url : "";
            if (state.scannedUrls.has(url)) continue;

            // Detect CSPT via network: fetch to API route with encoded traversal in URL path
            // This is the observable evidence that route handler await params will decode %2F
            if (url.includes("/api/") && /%2[fF]/.test(url)) {
              try {
                const urlObj = new URL(url);
                const apiPath = urlObj.pathname;
                const hasDots = apiPath.includes("..");
                const hasEncodedSlash = /%2[fF]/.test(apiPath);
                if (hasEncodedSlash) {
                  const key = `await-params-network|${apiPath}`;
                  if (!state.paramSources.some(e => `${e.type}|${e.source}` === key)) {
                    state.paramSources.push({
                      type: "await params (route handler — network evidence)",
                      risk: hasDots ? "critical" : "high",
                      desc: hasDots
                        ? "Fetch to API route with %2F + traversal dots in path — route handler await params DECODES %2F to /, enabling path traversal"
                        : "Fetch to API route with encoded %2F in path — route handler await params will decode to /",
                      source: url,
                      framework: state.framework ? state.framework.framework : "nextjs",
                      matchText: apiPath.substring(0, 120),
                      lineContext: `Network: ${entry.request.method || "GET"} ${apiPath}`,
                      lineNumber: 0,
                      columnNumber: 0,
                    });
                  }
                }
              } catch { /* invalid URL, skip */ }
            }

            const mimeType = entry.response && entry.response.content
              ? entry.response.content.mimeType : "";
            const ct = getContentTypeFromMime(mimeType);
            if (ct === "other") continue;

            try {
              const content = await getHAREntryContent(entry);
              if (content) {
                analyzeContent(content, ct, url);
              }
            } catch (e) {
              log("HAR error " + url + ": " + e.message);
            }
          }
        }
        log("After HAR: paths=" + state.paths.length + " sources=" + state.sources.length);
      } catch (e) {
        log("getHAR failed: " + e.message);
      }

      // 6. Fallback: fetch scripts via eval if nothing found
      if (state.paths.length === 0 && state.sources.length === 0 && !state.framework) {
        setStatus("Trying fallback script scan...", "scanning");
        log("Step 6: Fallback fetch");
        try {
          const scriptUrls = await evalInPage(
            "JSON.stringify(Array.from(document.querySelectorAll('script[src]')).map(s => s.src))"
          );
          if (scriptUrls) {
            const urls = JSON.parse(scriptUrls);
            log("Fallback scripts: " + urls.length);
            for (const url of urls) {
              if (state.scannedUrls.has(url)) continue;
              try {
                const resp = await fetch(url);
                if (resp.ok) {
                  const content = await resp.text();
                  if (content) analyzeContent(content, "js", url);
                }
              } catch (e) {
                log("Fetch failed " + url + ": " + e.message);
              }
            }
          }
        } catch (e) {
          log("Fallback failed: " + e.message);
        }
        log("After fallback: paths=" + state.paths.length + " sources=" + state.sources.length);
      }

      state.isScanning = false;
      const total = state.paths.length + state.sources.length + state.paramSources.length + state.apiCalls.length;
      const statusMsg = total > 0
        ? `Found ${state.paramSources.length} param sources, ${state.apiCalls.length} API calls, ${state.sources.length} chains`
        : (state.framework ? "Framework detected, no paths/sources found" : "Scan complete — no framework detected");
      setStatus(statusMsg, "done");
      log("Scan complete: " + statusMsg);
      render();

    } catch (e) {
      state.isScanning = false;
      setStatus("Error: " + e.message, "error");
      log("SCAN ERROR: " + e.message + "\n" + e.stack);
      render();
    }
  }

  function reset() {
    state.framework = null;
    state.allFrameworks = [];
    state.paths = [];
    state.sources = [];
    state.paramSources = [];
    state.apiCalls = [];
    state.scannedUrls = new Set();
    state.selectedEncodingFramework = null;
    // Don't reset live sources or monitoring state
  }

  // =========================================================================
  // Runtime Monitor
  // =========================================================================
  async function startMonitor() {
    if (state.isMonitoring) {
      stopMonitor();
      return;
    }

    log("Starting runtime monitor");
    const result = await evalInPage(DoctorScan.RUNTIME_HOOK);
    log("Hook result: " + result);

    state.isMonitoring = true;
    document.getElementById("btn-monitor").textContent = "Stop Monitor";
    document.getElementById("btn-monitor").classList.add("btn-monitor-active");
    document.getElementById("btn-monitor-live").textContent = "Stop Monitor";
    document.getElementById("btn-monitor-live").classList.add("btn-monitor-active");
    document.getElementById("live-sources").style.display = "block";
    document.getElementById("live-empty").style.display = "none";

    state.monitorInterval = setInterval(async () => {
      const raw = await evalInPage(DoctorScan.RUNTIME_POLL);
      if (raw) {
        try {
          const newSources = JSON.parse(raw);
          if (newSources.length > 0) {
            for (const s of newSources) {
              state.liveSources.push(s);
            }
            renderLiveSources();
            log("Live detections: +" + newSources.length + " (total: " + state.liveSources.length + ")");
          }
        } catch {}
      }
    }, 2000);
  }

  function stopMonitor() {
    log("Stopping runtime monitor");
    state.isMonitoring = false;
    if (state.monitorInterval) {
      clearInterval(state.monitorInterval);
      state.monitorInterval = null;
    }
    document.getElementById("btn-monitor").textContent = "Monitor";
    document.getElementById("btn-monitor").classList.remove("btn-monitor-active");
    document.getElementById("btn-monitor-live").textContent = "Start Monitor";
    document.getElementById("btn-monitor-live").classList.remove("btn-monitor-active");
  }

  // =========================================================================
  // UI Setup
  // =========================================================================
  function setStatus(text, className) {
    const el = document.getElementById("status");
    el.textContent = text;
    el.className = "status " + (className || "");
  }

  function setupTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
      });
    });

    // Sub-tabs within CSPT Sources
    document.querySelectorAll(".sub-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".sub-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".subtab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById("subtab-" + tab.dataset.subtab).classList.add("active");
      });
    });
  }

  function setupButtons() {
    document.getElementById("btn-scan").addEventListener("click", () => {
      log("Scan button clicked");
      reset();
      scan().catch(e => {
        setStatus("Error: " + e.message, "error");
        log("Scan error: " + e.message);
      });
    });

    document.getElementById("btn-reload").addEventListener("click", () => {
      log("Reload & Scan clicked");
      reset();
      try {
        chrome.devtools.inspectedWindow.reload();
      } catch (e) {
        log("Reload failed: " + e.message);
      }
      setTimeout(() => {
        scan().catch(e => {
          setStatus("Error: " + e.message, "error");
          log("Reload scan error: " + e.message);
        });
      }, 2000);
    });

    document.getElementById("btn-monitor").addEventListener("click", () => {
      startMonitor();
    });

    document.getElementById("btn-monitor-live").addEventListener("click", () => {
      startMonitor();
    });
  }

  function setupFilters() {
    document.getElementById("route-filter").addEventListener("change", renderRoutes);
    document.getElementById("dynamic-only").addEventListener("change", renderRoutes);
    document.getElementById("route-search").addEventListener("input", renderRoutes);
    document.getElementById("source-risk-filter").addEventListener("change", renderSources);
    document.getElementById("source-search").addEventListener("input", renderSources);
    document.getElementById("param-risk-filter").addEventListener("change", renderParamSources);
    document.getElementById("param-search").addEventListener("input", renderParamSources);
    document.getElementById("api-risk-filter").addEventListener("change", renderApiCalls);
    document.getElementById("api-search").addEventListener("input", renderApiCalls);
  }

  // =========================================================================
  // Rendering
  // =========================================================================
  function render() {
    renderFramework();
    renderRoutes();
    renderParamSources();
    renderApiCalls();
    renderSources();
    renderEncoding();

    document.getElementById("routes-count").textContent = state.paths.length;
    const totalSourcesCount = state.paramSources.length + state.apiCalls.length + state.sources.length;
    document.getElementById("sources-count").textContent = totalSourcesCount;
    document.getElementById("param-sources-count").textContent = state.paramSources.length;
    document.getElementById("api-calls-count").textContent = state.apiCalls.length;
    document.getElementById("chains-count").textContent = state.sources.length;
  }

  function renderFramework() {
    const container = document.getElementById("framework-result");

    if (!state.framework) {
      container.innerHTML = '<div class="empty-state">No framework detected yet</div>';
      return;
    }

    const fw = state.framework;
    const encodingData = DoctorScan.ENCODING_DATA[fw.framework] || DoctorScan.ENCODING_DATA.unknown;
    const riskClass = encodingData.riskLevel === "high" ? "high" : encodingData.riskLevel === "medium" ? "medium" : "low";
    const confClass = fw.confidence >= 70 ? "confidence-high" : fw.confidence >= 40 ? "confidence-medium" : "confidence-low";

    let html = `
      <div class="framework-card">
        <div class="framework-name">${encodingData.name}</div>
        <div style="font-size:11px;color:var(--text-dim)">
          Confidence: ${fw.confidence}% &nbsp;&bull;&nbsp;
          Decode: <code style="color:var(--accent)">${encodingData.decodeFunction}</code>
        </div>
        <div class="confidence-bar">
          <div class="confidence-fill ${confClass}" style="width:${fw.confidence}%"></div>
        </div>
        <div class="signals-list">
          ${fw.signals.map(s => `<span class="signal-tag">${escHtml(s)}</span>`).join("")}
        </div>
        <div class="risk-summary risk-${riskClass}-bg" style="margin-top:12px">
          <h3 style="color:var(--${riskClass})">CSPT Risk: ${encodingData.riskLevel.toUpperCase()}</h3>
          <p>${escHtml(encodingData.csptChain)}</p>
        </div>
      </div>`;

    if (state.allFrameworks.length > 1) {
      html += '<div style="font-size:11px;color:var(--text-dim);margin:8px 0">Also detected:</div>';
      for (let i = 1; i < state.allFrameworks.length; i++) {
        const f = state.allFrameworks[i];
        const ed = DoctorScan.ENCODING_DATA[f.framework] || DoctorScan.ENCODING_DATA.unknown;
        html += `<div style="font-size:11px;color:var(--text-dim);padding:2px 0">
          ${ed.name} (${f.confidence}%) — ${f.signals.slice(0, 3).join(", ")}
        </div>`;
      }
    }

    container.innerHTML = html;
  }

  function renderRoutes() {
    const typeFilter = document.getElementById("route-filter").value;
    const dynamicOnly = document.getElementById("dynamic-only").checked;
    const search = document.getElementById("route-search").value.toLowerCase();

    let filtered = state.paths;
    if (typeFilter !== "all") filtered = filtered.filter(p => p.type === typeFilter);
    if (dynamicOnly) filtered = filtered.filter(p => p.isDynamic);
    if (search) filtered = filtered.filter(p => p.path.toLowerCase().includes(search) || p.source.toLowerCase().includes(search));

    const tbody = document.getElementById("routes-tbody");
    const emptyEl = document.getElementById("routes-empty");
    const tableContainer = document.getElementById("routes-table-container");

    if (filtered.length === 0) {
      tableContainer.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    tableContainer.style.display = "block";
    emptyEl.style.display = "none";

    filtered.sort((a, b) => {
      if (a.isDynamic !== b.isDynamic) return b.isDynamic - a.isDynamic;
      return a.path.localeCompare(b.path);
    });

    tbody.innerHTML = filtered.map(p => {
      const sourceShort = p.source.length > 60
        ? "..." + p.source.slice(-57)
        : p.source;
      return `<tr>
        <td class="path-cell" title="${escHtml(p.path)}">${escHtml(p.path)}</td>
        <td><span class="type-badge type-${p.type}">${p.type}</span></td>
        <td class="${p.isDynamic ? 'dynamic-yes' : 'dynamic-no'}">${p.isDynamic ? 'YES' : 'no'}</td>
        <td title="${escHtml(p.source)}">${escHtml(sourceShort)}</td>
      </tr>`;
    }).join("");
  }

  function renderParamSources() {
    const riskFilter = document.getElementById("param-risk-filter").value;
    const search = document.getElementById("param-search").value.toLowerCase();

    let filtered = state.paramSources;
    if (riskFilter !== "all") filtered = filtered.filter(s => s.risk === riskFilter);
    if (search) filtered = filtered.filter(s =>
      s.type.toLowerCase().includes(search) ||
      s.desc.toLowerCase().includes(search) ||
      s.lineContext.toLowerCase().includes(search)
    );

    const container = document.getElementById("param-sources-list");
    const emptyEl = document.getElementById("param-sources-empty");

    if (filtered.length === 0) {
      container.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    container.style.display = "block";
    emptyEl.style.display = "none";

    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => (riskOrder[a.risk] || 3) - (riskOrder[b.risk] || 3));

    container.innerHTML = filtered.map((s) => {
      const sourceShort = s.source.length > 80 ? "..." + s.source.slice(-77) : s.source;
      const canOpen = s.source && s.source !== "page" && s.lineNumber;
      const clickClass = canOpen ? "chain-clickable" : "";
      const clickAttr = canOpen
        ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${s.lineNumber}" data-bp-col="${s.columnNumber || 0}"`
        : "";
      const riskBadgeClass = s.risk === "critical" ? "risk-critical" : `risk-${s.risk}`;

      return `<div class="source-card ${s.risk}-border">
        <div class="source-header">
          <span class="source-type">${escHtml(s.type)}</span>
          <span class="risk-badge ${riskBadgeClass}">${s.risk}</span>
        </div>
        <div class="param-source-body ${clickClass}" ${clickAttr}>
          <div class="param-desc">${escHtml(s.desc)}</div>
          ${canOpen ? `<div class="param-location">${escHtml(sourceShort)}:${s.lineNumber}:${s.columnNumber || 0}</div>` : ''}
        </div>
        <div class="source-context">${escHtml(s.lineContext)}</div>
      </div>`;
    }).join("");

    // Navigate to source on click (no breakpoint)
    setupNavigateClicks(container);
  }

  function renderApiCalls() {
    const riskFilter = document.getElementById("api-risk-filter").value;
    const search = document.getElementById("api-search").value.toLowerCase();

    let filtered = state.apiCalls;
    if (riskFilter !== "all") filtered = filtered.filter(s => s.risk === riskFilter);
    if (search) filtered = filtered.filter(s =>
      s.type.toLowerCase().includes(search) ||
      s.desc.toLowerCase().includes(search) ||
      s.lineContext.toLowerCase().includes(search) ||
      (s.urlPattern && s.urlPattern.toLowerCase().includes(search)) ||
      (s.dynamicVar && s.dynamicVar.toLowerCase().includes(search))
    );

    const container = document.getElementById("api-calls-list");
    const emptyEl = document.getElementById("api-calls-empty");

    if (filtered.length === 0) {
      container.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    container.style.display = "block";
    emptyEl.style.display = "none";

    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => (riskOrder[a.risk] || 3) - (riskOrder[b.risk] || 3));

    container.innerHTML = filtered.map((s) => {
      const sourceShort = s.source.length > 80 ? "..." + s.source.slice(-77) : s.source;
      const canOpen = s.source && s.source !== "page" && s.lineNumber;
      const clickClass = canOpen ? "chain-clickable" : "";
      const clickAttr = canOpen
        ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${s.lineNumber}" data-bp-col="${s.columnNumber || 0}"`
        : "";
      const riskBadgeClass = s.risk === "critical" ? "risk-critical" : `risk-${s.risk}`;

      // Response processing tags
      let responseHtml = "";
      if (s.responseProcessing && s.responseProcessing.length > 0) {
        const tags = s.responseProcessing.map(r => {
          const canOpenResp = s.source && s.source !== "page" && r.lineNumber;
          const respClickClass = canOpenResp ? "response-tag-clickable" : "";
          const respClickAttr = canOpenResp
            ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${r.lineNumber}" data-bp-col="0"`
            : "";
          return `<span class="response-tag response-tag-${r.risk} ${respClickClass}" ${respClickAttr} title="${escHtml(r.desc)}">${escHtml(r.type)}${r.lineNumber ? ' :' + r.lineNumber : ''}</span>`;
        }).join("");
        responseHtml = `<div class="api-response-tags"><span class="chain-label chain-label-response">RESPONSE</span> <span class="response-tags">${tags}</span></div>`;
      }

      return `<div class="source-card ${s.risk}-border">
        <div class="source-header">
          <span class="source-type">${escHtml(s.type)}</span>
          <span class="risk-badge ${riskBadgeClass}">${s.risk}</span>
        </div>
        <div class="api-call-body ${clickClass}" ${clickAttr}>
          <div class="api-desc">${escHtml(s.desc)}</div>
          ${s.dynamicVar ? `<div class="api-var">Dynamic: <code>${escHtml(s.dynamicVar)}</code>${s.urlPattern ? ` in <code>${escHtml(s.urlPattern)}...</code>` : ''}</div>` : ''}
          ${canOpen ? `<div class="param-location">${escHtml(sourceShort)}:${s.lineNumber}:${s.columnNumber || 0}</div>` : ''}
        </div>
        ${responseHtml}
        <div class="source-context">${escHtml(s.lineContext)}</div>
      </div>`;
    }).join("");

    // Navigate to source on click (no breakpoint)
    setupNavigateClicks(container);
  }

  // Navigate-only: just open the file at the line, no breakpoint
  function setupNavigateClicks(container) {
    container.querySelectorAll(".chain-clickable").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const url = el.dataset.bpUrl;
        const line = parseInt(el.dataset.bpLine, 10);
        const col = parseInt(el.dataset.bpCol, 10) || 0;
        if (!url || !line) return;

        log("Navigate: " + url + ":" + line + ":" + col);
        setStatus("Opening " + url.split("/").pop() + ":" + line, "done");
        chrome.devtools.panels.openResource(url, line - 1, col, () => {});
      });
    });
  }

  // Breakpoint + navigate: sets a debugger breakpoint AND opens the file
  function setupBreakpointClicks(container) {
    container.querySelectorAll(".chain-clickable, .response-tag-clickable").forEach(el => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const url = el.dataset.bpUrl;
        const line = parseInt(el.dataset.bpLine, 10);
        const col = parseInt(el.dataset.bpCol, 10) || 0;
        if (!url || !line) return;

        log("Click: setting breakpoint at " + url + ":" + line + ":" + col);
        setStatus("Setting breakpoint at line " + line + "...", "scanning");

        try {
          chrome.runtime.sendMessage({
            action: "setBreakpoint",
            tabId: chrome.devtools.inspectedWindow.tabId,
            url,
            lineNumber: line,
            columnNumber: col,
          }, (result) => {
            if (chrome.runtime.lastError) {
              log("sendMessage error: " + chrome.runtime.lastError.message);
              setStatus("BP error: " + chrome.runtime.lastError.message, "error");
              return;
            }
            log("BP result: " + JSON.stringify(result));
            if (result && result.success) {
              if (result.action === "set") {
                el.classList.add("chain-bp-active");
                setStatus("Breakpoint set at " + line + ":" + col, "done");
              } else if (result.action === "removed") {
                el.classList.remove("chain-bp-active");
                setStatus("Breakpoint removed", "done");
              }
            } else {
              setStatus("BP failed: " + (result?.error || "no response from service worker"), "error");
            }
          });
        } catch (err) {
          log("sendMessage threw: " + err.message);
          setStatus("BP error: " + err.message, "error");
        }

        chrome.devtools.panels.openResource(url, line - 1, col, () => {});
      });
    });
  }

  function renderSources() {
    const riskFilter = document.getElementById("source-risk-filter").value;
    const search = document.getElementById("source-search").value.toLowerCase();

    let filtered = state.sources;
    if (riskFilter !== "all") filtered = filtered.filter(s => s.risk === riskFilter);
    if (search) filtered = filtered.filter(s =>
      s.type.toLowerCase().includes(search) ||
      s.sourceDesc.toLowerCase().includes(search) ||
      s.sinkDesc.toLowerCase().includes(search) ||
      s.lineContext.toLowerCase().includes(search)
    );

    const container = document.getElementById("sources-list");
    const emptyEl = document.getElementById("sources-empty");

    if (filtered.length === 0) {
      container.style.display = "none";
      emptyEl.style.display = "block";
      return;
    }

    container.style.display = "block";
    emptyEl.style.display = "none";

    // Sort: critical > high > medium
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => (riskOrder[a.risk] || 3) - (riskOrder[b.risk] || 3));

    container.innerHTML = filtered.map((s, idx) => {
      const sourceShort = s.source.length > 80 ? "..." + s.source.slice(-77) : s.source;
      const canOpenSource = s.source && s.source !== "page" && s.sourceLineNumber;
      const canOpenSink = s.source && s.source !== "page" && s.sinkLineNumber;
      const riskBadgeClass = s.risk === "critical" ? "risk-critical" : `risk-${s.risk}`;

      // Source line — clickable to set breakpoint at param accessor
      const sourceLine = s.sourceLineNumber ? `:${s.sourceLineNumber}:${s.sourceColumnNumber || 0}` : "";
      const sourceClickClass = canOpenSource ? "chain-clickable" : "";
      const sourceClickAttr = canOpenSource
        ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${s.sourceLineNumber}" data-bp-col="${s.sourceColumnNumber || 0}"`
        : "";

      // Sink line — clickable to set breakpoint at fetch call
      const sinkLine = s.sinkLineNumber ? `:${s.sinkLineNumber}:${s.sinkColumnNumber || 0}` : "";
      const sinkClickClass = canOpenSink ? "chain-clickable" : "";
      const sinkClickAttr = canOpenSink
        ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${s.sinkLineNumber}" data-bp-col="${s.sinkColumnNumber || 0}"`
        : "";

      // Response processing tags — each clickable
      let responseHtml = "";
      if (s.responseProcessing && s.responseProcessing.length > 0) {
        const tags = s.responseProcessing.map(r => {
          const canOpenResp = s.source && s.source !== "page" && r.lineNumber;
          const respClickClass = canOpenResp ? "response-tag-clickable" : "";
          const respClickAttr = canOpenResp
            ? `data-bp-url="${escHtml(s.source)}" data-bp-line="${r.lineNumber}" data-bp-col="0"`
            : "";
          return `<span class="response-tag response-tag-${r.risk} ${respClickClass}" ${respClickAttr} title="${escHtml(r.desc)}">${escHtml(r.type)}${r.lineNumber ? ' :' + r.lineNumber : ''}</span>`;
        }).join("");
        responseHtml = `<div class="chain-step">
          <span class="chain-label chain-label-response">RESPONSE</span>
          <span class="chain-text"><span class="response-tags">${tags}</span></span>
        </div>`;
      }

      return `<div class="source-card ${s.risk}-border" data-source-idx="${idx}">
        <div class="source-header">
          <span class="source-type">${escHtml(s.type)}</span>
          <span class="risk-badge ${riskBadgeClass}">${s.risk}</span>
        </div>
        <div class="source-chain">
          <div class="chain-step ${sourceClickClass}" ${sourceClickAttr}>
            <span class="chain-label chain-label-source">SOURCE</span>
            <span class="chain-text">${escHtml(s.sourceDesc)}${canOpenSource ? ` <span class="chain-line">${escHtml(sourceShort)}${sourceLine}</span>` : ''}</span>
          </div>
          <div class="chain-step ${sinkClickClass}" ${sinkClickAttr}>
            <span class="chain-label chain-label-sink">SINK</span>
            <span class="chain-text">${escHtml(s.sinkDesc)}${canOpenSink ? ` <span class="chain-line">${escHtml(sourceShort)}${sinkLine}</span>` : ''}</span>
          </div>
          ${responseHtml}
        </div>
        <div class="source-context">${escHtml(s.lineContext)}</div>
      </div>`;
    }).join("");

    // Breakpoint click handlers
    setupBreakpointClicks(container);
  }

  function renderLiveSources() {
    const container = document.getElementById("live-list");
    const countEl = document.getElementById("live-count");
    countEl.textContent = state.liveSources.length;

    if (state.liveSources.length === 0) {
      container.innerHTML = '<div style="color:var(--text-dim);font-size:11px;padding:8px 0">Waiting for fetch/XHR calls...</div>';
      return;
    }

    // Show most recent first, limit to 50
    const recent = state.liveSources.slice(-50).reverse();
    container.innerHTML = recent.map(s => {
      return `<div class="live-card">
        <div style="font-size:10px;color:var(--text-dim);margin-bottom:3px">${s.type.toUpperCase()}</div>
        <div class="live-url">${escHtml(s.url)}</div>
        <div class="live-segment">Matched segment: <strong>${escHtml(s.segment)}</strong></div>
        ${s.stack ? `<div class="live-stack">${escHtml(s.stack)}</div>` : ''}
      </div>`;
    }).join("");
  }

  function renderEncoding() {
    const container = document.getElementById("encoding-content");
    const fw = state.selectedEncodingFramework || (state.framework ? state.framework.framework : null);

    let html = "";

    html += '<div style="margin-bottom:12px"><strong style="font-size:11px;color:var(--text-dim)">Select framework:</strong></div>';
    html += '<div class="all-frameworks">';
    const frameworks = Object.keys(DoctorScan.ENCODING_DATA).filter(k => k !== "unknown");
    for (const fwKey of frameworks) {
      const ed = DoctorScan.ENCODING_DATA[fwKey];
      const isActive = fw === fwKey;
      const riskClass = ed.riskLevel === "high" ? "high" : ed.riskLevel === "medium" ? "medium" : "low";
      html += `<div class="mini-framework ${isActive ? 'active' : ''}" data-fw="${fwKey}">
        <div class="mini-framework-name">${ed.name}</div>
        <div class="mini-framework-risk" style="color:var(--${riskClass})">CSPT Risk: ${ed.riskLevel.toUpperCase()}</div>
      </div>`;
    }
    html += '</div>';

    if (fw && DoctorScan.ENCODING_DATA[fw]) {
      const ed = DoctorScan.ENCODING_DATA[fw];
      const riskClass = ed.riskLevel === "high" ? "high" : ed.riskLevel === "medium" ? "medium" : "low";

      html += `<div class="encoding-section">
        <h2>Decoding Pipeline — ${ed.name}</h2>
        <div class="encoding-body">
          ${ed.decodePipeline.map((step, i) =>
            `<div class="pipeline-step">
              <span class="pipeline-num">${i + 1}</span>
              <span>${escHtml(step)}</span>
            </div>`
          ).join("")}
        </div>
      </div>`;

      html += `<div class="encoding-section">
        <h2>Parameter Behavior</h2>
        <div class="encoding-body">
          <table class="param-table">
            ${Object.entries(ed.paramBehavior).map(([k, v]) =>
              `<tr><td>${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`
            ).join("")}
          </table>
        </div>
      </div>`;

      html += `<div class="encoding-section">
        <h2>Test Payloads</h2>
        <div class="encoding-body">
          <table class="payload-table">
            <tr><th style="text-align:left">Input</th><th style="text-align:left">Result</th><th>Works?</th></tr>
            ${ed.payloads.map(p => `<tr>
              <td><code>${escHtml(p.input)}</code></td>
              <td>${escHtml(p.result)}</td>
              <td class="${p.works ? 'payload-works' : p.works === false ? 'payload-blocked' : ''}">${p.works === true ? 'YES' : p.works === false ? 'NO' : '?'}${p.note ? ` <span class="payload-note">(${escHtml(p.note)})</span>` : ''}</td>
            </tr>`).join("")}
          </table>
        </div>
      </div>`;

      html += `<div class="encoding-section">
        <h2>CSPT Attack Chain</h2>
        <div class="encoding-body">
          <div class="cspt-chain">${escHtml(ed.csptChain)}</div>
        </div>
      </div>`;

      if (ed.cves && ed.cves.length > 0) {
        html += `<div class="encoding-section">
          <h2>Known CVEs</h2>
          <div class="encoding-body">
            ${ed.cves.map(c => `<div class="cve-item">${escHtml(c)}</div>`).join("")}
          </div>
        </div>`;
      }

      html += `<div class="encoding-section">
        <h2>Defenses</h2>
        <div class="encoding-body">
          ${ed.defenses.map(d => `<div class="defense-item">${escHtml(d)}</div>`).join("")}
        </div>
      </div>`;
    }

    html += `<div class="encoding-section" style="margin-top:16px">
      <h2>Framework Comparison Matrix</h2>
      <div class="encoding-body" style="overflow-x:auto">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Framework</th>
              <th>Decode Function</th>
              <th>Params Decoded?</th>
              <th>Catch-All</th>
              <th>Search Decoded?</th>
              <th>CSPT Risk</th>
            </tr>
          </thead>
          <tbody>
            ${DoctorScan.ENCODING_MATRIX.map(row => {
              const isActive = fw && row.framework.toLowerCase().includes(fw.replace("-", " ").toLowerCase().split(" ")[0]);
              const riskClass = row.csptRisk.includes("HIGH") ? "high" : row.csptRisk.includes("MEDIUM") ? "medium" : "low";
              return `<tr class="${isActive ? 'matrix-highlight' : ''}">
                <td style="font-weight:600;color:var(--text-bright)">${row.framework}</td>
                <td><code>${escHtml(row.decode)}</code></td>
                <td style="color:var(--${row.paramDecoded ? 'high' : 'low'})">${row.paramDecoded ? 'YES' : 'NO'}</td>
                <td>${escHtml(row.catchAllType)}</td>
                <td style="color:var(--high)">YES</td>
                <td><span class="risk-badge risk-${riskClass}">${row.csptRisk}</span></td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>`;

    container.innerHTML = html;

    container.querySelectorAll(".mini-framework").forEach(el => {
      el.addEventListener("click", () => {
        state.selectedEncodingFramework = el.dataset.fw;
        renderEncoding();
      });
    });
  }

  function escHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // =========================================================================
  // Init
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    setupButtons();
    setupFilters();

    // Listen for new requests
    try {
      chrome.devtools.network.onRequestFinished.addListener((request) => {
        if (state.isScanning) return;
        const url = request.request ? request.request.url : "";
        if (state.scannedUrls.has(url)) return;

        const mimeType = request.response && request.response.content
          ? request.response.content.mimeType : "";
        const ct = getContentTypeFromMime(mimeType);
        if (ct === "other") return;

        request.getContent((content) => {
          if (content) {
            analyzeContent(content, ct, url);
            render();
          }
        });
      });
    } catch {}

    // Listen for page navigation
    try {
      chrome.devtools.network.onNavigated.addListener(() => {
        reset();
        render();
        setTimeout(() => scan(), 1500);
      });
    } catch {}

    // Auto-scan on panel open
    log("Panel loaded, starting auto-scan");
    log("DoctorScan namespace: " + (typeof DoctorScan !== 'undefined'));
    log("analyzeSources: " + (typeof DoctorScan !== 'undefined' && typeof DoctorScan.analyzeSources === 'function'));
    scan().catch(e => {
      setStatus("Error: " + e.message, "error");
      log("Auto-scan error: " + e.message + "\n" + e.stack);
    });
  });
})();
