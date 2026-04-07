import type { DefineAPI, SDK } from "caido:plugin";
import type {
  HostData,
  ClientPath,
  CSPTSink,
  DetectedFramework,
  Framework,
} from "./types";
import { detectFramework, getContentType } from "./framework-detector";
import { extractPaths } from "./path-extractor";
import { analyzeSinks } from "./cspt-analyzer";

// =========================================================================
// In-memory storage: per-host analysis results
// =========================================================================
const hostDataMap = new Map<string, HostData>();

// Max body size to analyze (5MB - skip huge responses)
const MAX_BODY_SIZE = 5 * 1024 * 1024;

// =========================================================================
// Helper: get or create host data
// =========================================================================
function getHostData(host: string): HostData {
  let data = hostDataMap.get(host);
  if (!data) {
    data = {
      host,
      framework: { framework: "unknown", confidence: 0, signals: [] },
      paths: [],
      sinks: [],
      analyzedUrls: [],
    };
    hostDataMap.set(host, data);
  }
  return data;
}

// =========================================================================
// Helper: add paths with dedup
// =========================================================================
function addPaths(hostData: HostData, newPaths: ClientPath[]): number {
  const existingKeys = new Set(hostData.paths.map((p) => `${p.path}|${p.type}`));
  let added = 0;
  for (const p of newPaths) {
    const key = `${p.path}|${p.type}`;
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      hostData.paths.push(p);
      added++;
    }
  }
  return added;
}

// =========================================================================
// Helper: add sinks with dedup
// =========================================================================
function addSinks(hostData: HostData, newSinks: CSPTSink[]): number {
  const existingKeys = new Set(
    hostData.sinks.map((s) => `${s.type}|${s.lineContext.substring(0, 60)}`),
  );
  let added = 0;
  for (const s of newSinks) {
    const key = `${s.type}|${s.lineContext.substring(0, 60)}`;
    if (!existingKeys.has(key)) {
      existingKeys.add(key);
      hostData.sinks.push(s);
      added++;
    }
  }
  return added;
}

// =========================================================================
// API functions exposed to frontend
// =========================================================================

function getAllHosts(_sdk: SDK): string[] {
  return Array.from(hostDataMap.keys()).sort();
}

function getHostAnalysis(_sdk: SDK, host: string): HostData | null {
  return hostDataMap.get(host) || null;
}

function getAllData(_sdk: SDK): HostData[] {
  return Array.from(hostDataMap.values());
}

function getStats(_sdk: SDK): {
  hosts: number;
  totalPaths: number;
  totalSinks: number;
  dynamicPaths: number;
  highRiskSinks: number;
  frameworks: Record<string, number>;
} {
  let totalPaths = 0;
  let totalSinks = 0;
  let dynamicPaths = 0;
  let highRiskSinks = 0;
  const frameworks: Record<string, number> = {};

  for (const data of hostDataMap.values()) {
    totalPaths += data.paths.length;
    totalSinks += data.sinks.length;
    dynamicPaths += data.paths.filter((p) => p.isDynamic).length;
    highRiskSinks += data.sinks.filter((s) => s.risk === "high").length;
    const fw = data.framework.framework;
    if (fw !== "unknown") {
      frameworks[fw] = (frameworks[fw] || 0) + 1;
    }
  }

  return {
    hosts: hostDataMap.size,
    totalPaths,
    totalSinks,
    dynamicPaths,
    highRiskSinks,
    frameworks,
  };
}

function clearData(_sdk: SDK): { success: boolean } {
  hostDataMap.clear();
  return { success: true };
}

function clearHost(_sdk: SDK, host: string): { success: boolean } {
  hostDataMap.delete(host);
  return { success: true };
}

// =========================================================================
// API type definition
// =========================================================================
export type API = DefineAPI<{
  getAllHosts: typeof getAllHosts;
  getHostAnalysis: typeof getHostAnalysis;
  getAllData: typeof getAllData;
  getStats: typeof getStats;
  clearData: typeof clearData;
  clearHost: typeof clearHost;
}>;

export type Events = {
  onNewFindings: {
    host: string;
    newPaths: number;
    newSinks: number;
    framework: string;
  };
};

// =========================================================================
// Plugin initialization
// =========================================================================
export function init(sdk: SDK<API, Events>) {
  sdk.console.log("[CSPT Analyzer] Plugin initialized");

  // Register API functions
  sdk.api.register("getAllHosts", getAllHosts);
  sdk.api.register("getHostAnalysis", getHostAnalysis);
  sdk.api.register("getAllData", getAllData);
  sdk.api.register("getStats", getStats);
  sdk.api.register("clearData", clearData);
  sdk.api.register("clearHost", clearHost);

  // -----------------------------------------------------------------------
  // Passive analysis: intercept every response
  // -----------------------------------------------------------------------
  sdk.events.onInterceptResponse(async (sdk, request, response) => {
    try {
      const host = request.getHost();
      const url = request.getUrl();
      const path = request.getPath();
      const statusCode = response.getCode();
      const responseHeaders = response.getHeaders();

      // Normalize header keys to lowercase
      const headers: Record<string, string[]> = {};
      for (const [key, values] of Object.entries(responseHeaders)) {
        headers[key.toLowerCase()] = values;
      }

      // Determine content type
      const contentType = getContentType(headers);

      // Skip non-HTML/JS responses
      if (contentType === "other") return;

      // Skip error responses for framework detection (but still analyze 200s and 3xx)
      if (statusCode >= 400 && contentType === "html") return;

      // Get response body
      const body = response.getBody();
      if (!body) return;
      if (body.length > MAX_BODY_SIZE) return;

      const bodyText = body.toText();
      if (!bodyText || bodyText.length < 10) return;

      const hostData = getHostData(host);

      // Check if we already analyzed this exact URL
      if (hostData.analyzedUrls.includes(url)) return;
      hostData.analyzedUrls.push(url);

      // Cap analyzed URLs to prevent unbounded memory growth
      if (hostData.analyzedUrls.length > 2000) {
        hostData.analyzedUrls = hostData.analyzedUrls.slice(-1000);
      }

      let frameworkUpdated = false;

      // ----- Framework Detection (primarily from HTML) -----
      if (contentType === "html" || hostData.framework.framework === "unknown") {
        const detected = detectFramework(bodyText, headers, url);
        if (detected && detected.confidence > hostData.framework.confidence) {
          hostData.framework = detected;
          frameworkUpdated = true;
          sdk.console.log(
            `[CSPT Analyzer] ${host}: Detected ${detected.framework} (confidence: ${detected.confidence}, signals: ${detected.signals.join(", ")})`,
          );
        }
      }

      // Also detect from JS bundles (framework imports survive bundling)
      if (contentType === "js" && hostData.framework.framework === "unknown") {
        const detected = detectFramework(bodyText, headers, url);
        if (detected && detected.confidence > hostData.framework.confidence) {
          hostData.framework = detected;
          frameworkUpdated = true;
          sdk.console.log(
            `[CSPT Analyzer] ${host}: Detected ${detected.framework} from JS (confidence: ${detected.confidence})`,
          );
        }
      }

      const framework = hostData.framework.framework;

      // ----- Path Extraction -----
      const newPaths = extractPaths(bodyText, framework, url, contentType);
      const pathsAdded = addPaths(hostData, newPaths);

      // ----- CSPT Sink Detection -----
      const newSinks = analyzeSinks(bodyText, framework, url);
      const sinksAdded = addSinks(hostData, newSinks);

      // ----- Notify frontend if anything new found -----
      if (pathsAdded > 0 || sinksAdded > 0 || frameworkUpdated) {
        sdk.api.send("onNewFindings", {
          host,
          newPaths: pathsAdded,
          newSinks: sinksAdded,
          framework,
        });

        if (pathsAdded > 0) {
          sdk.console.log(
            `[CSPT Analyzer] ${host}: +${pathsAdded} paths (total: ${hostData.paths.length})`,
          );
        }
        if (sinksAdded > 0) {
          sdk.console.log(
            `[CSPT Analyzer] ${host}: +${sinksAdded} sinks (total: ${hostData.sinks.length})`,
          );
        }
      }

      // ----- Create findings for high-risk CSPT sinks -----
      for (const sink of newSinks) {
        if (sink.risk === "high") {
          const dedupeKey = `cspt-${host}-${sink.type}-${sink.source}` as any;
          try {
            const exists = await sdk.findings.exists(dedupeKey);
            if (!exists) {
              await sdk.findings.create({
                title: `[CSPT] ${sink.type} on ${host}`,
                description: [
                  `Framework: ${framework}`,
                  `Sink Type: ${sink.type}`,
                  `Risk: ${sink.risk}`,
                  `Source: ${sink.source}`,
                  `Description: ${sink.description}`,
                  `Context: ${sink.lineContext}`,
                ].join("\n"),
                reporter: "CSPT Analyzer",
                dedupeKey,
                request,
              });
            }
          } catch {
            // Finding creation may fail if request can't be saved, that's OK
          }
        }
      }
    } catch (err) {
      sdk.console.error(`[CSPT Analyzer] Error processing response: ${err}`);
    }
  });
}
