// doctorscan — background service worker
// Handles chrome.debugger API calls for setting breakpoints.
// The devtools panel can't call chrome.debugger directly,
// so it routes through here via chrome.runtime.sendMessage().

const sessions = new Map(); // tabId -> { breakpoints: Map<key, breakpointId> }

console.log("[doctorscan bg] service worker loaded");

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[doctorscan bg] message received:", msg.action, "tabId:", msg.tabId);
  if (msg.action === "setBreakpoint") {
    handleSetBreakpoint(msg).then((result) => {
      console.log("[doctorscan bg] setBreakpoint result:", JSON.stringify(result));
      sendResponse(result);
    }).catch((err) => {
      console.log("[doctorscan bg] setBreakpoint error:", err.message);
      sendResponse({ error: err.message });
    });
    return true;
  }
  if (msg.action === "removeBreakpoint") {
    handleRemoveBreakpoint(msg).then(sendResponse);
    return true;
  }
  if (msg.action === "removeAllBreakpoints") {
    handleRemoveAll(msg.tabId).then(sendResponse);
    return true;
  }
});

async function ensureAttached(tabId) {
  if (sessions.has(tabId)) return true;

  return new Promise((resolve) => {
    chrome.debugger.attach({ tabId }, "1.3", () => {
      if (chrome.runtime.lastError) {
        console.log("[doctorscan] attach failed:", chrome.runtime.lastError.message);
        resolve(false);
        return;
      }
      chrome.debugger.sendCommand({ tabId }, "Debugger.enable", {}, () => {
        if (chrome.runtime.lastError) {
          console.log("[doctorscan] Debugger.enable failed:", chrome.runtime.lastError.message);
          resolve(false);
          return;
        }
        sessions.set(tabId, { breakpoints: new Map() });
        console.log("[doctorscan] debugger attached to tab", tabId);
        resolve(true);
      });
    });
  });
}

async function handleSetBreakpoint({ tabId, url, lineNumber, columnNumber }) {
  const attached = await ensureAttached(tabId);
  if (!attached) return { error: "Failed to attach debugger — dismiss any dialogs and retry" };

  const key = `${url}:${lineNumber}:${columnNumber || 0}`;
  const session = sessions.get(tabId);

  // Toggle: if already set, remove it
  if (session.breakpoints.has(key)) {
    const bpId = session.breakpoints.get(key);
    return new Promise((resolve) => {
      chrome.debugger.sendCommand({ tabId }, "Debugger.removeBreakpoint", {
        breakpointId: bpId,
      }, () => {
        session.breakpoints.delete(key);
        console.log("[doctorscan] breakpoint removed:", key);
        resolve({ success: true, action: "removed", key });
      });
    });
  }

  // Set new breakpoint
  const params = {
    lineNumber: lineNumber - 1, // CDP is 0-based
    url: url,
  };
  if (columnNumber != null && columnNumber > 0) {
    params.columnNumber = columnNumber;
  }

  return new Promise((resolve) => {
    chrome.debugger.sendCommand({ tabId }, "Debugger.setBreakpointByUrl", params, (result) => {
      if (chrome.runtime.lastError) {
        console.log("[doctorscan] setBreakpoint failed:", chrome.runtime.lastError.message);
        resolve({ error: chrome.runtime.lastError.message });
        return;
      }
      if (result && result.breakpointId) {
        session.breakpoints.set(key, result.breakpointId);
        console.log("[doctorscan] breakpoint set:", key, "->", result.breakpointId);
      }
      resolve({
        success: true,
        action: "set",
        key,
        breakpointId: result?.breakpointId,
        locations: result?.locations,
      });
    });
  });
}

async function handleRemoveBreakpoint({ tabId, url, lineNumber, columnNumber }) {
  const session = sessions.get(tabId);
  if (!session) return { error: "No debugger session" };

  const key = `${url}:${lineNumber}:${columnNumber || 0}`;
  const bpId = session.breakpoints.get(key);
  if (!bpId) return { error: "No breakpoint at " + key };

  return new Promise((resolve) => {
    chrome.debugger.sendCommand({ tabId }, "Debugger.removeBreakpoint", {
      breakpointId: bpId,
    }, () => {
      session.breakpoints.delete(key);
      resolve({ success: true });
    });
  });
}

async function handleRemoveAll(tabId) {
  const session = sessions.get(tabId);
  if (!session) return { success: true };

  const promises = [];
  for (const [key, bpId] of session.breakpoints) {
    promises.push(new Promise((resolve) => {
      chrome.debugger.sendCommand({ tabId }, "Debugger.removeBreakpoint", {
        breakpointId: bpId,
      }, () => resolve());
    }));
  }
  await Promise.all(promises);
  session.breakpoints.clear();
  return { success: true };
}

// Clean up on tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  if (sessions.has(tabId)) {
    try { chrome.debugger.detach({ tabId }); } catch {}
    sessions.delete(tabId);
  }
});

// Clean up when debugger detaches
chrome.debugger.onDetach.addListener((source) => {
  sessions.delete(source.tabId);
});
