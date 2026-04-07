export type Framework =
  | "react-router"
  | "nextjs"
  | "remix"
  | "vue-router"
  | "nuxt"
  | "angular"
  | "sveltekit"
  | "ember"
  | "solidstart"
  | "astro"
  | "unknown";

export type DetectedFramework = {
  framework: Framework;
  confidence: number;
  signals: string[];
};

export type ClientPath = {
  path: string;
  type: "route" | "api" | "fetch" | "navigation";
  source: string;
  framework: Framework;
  isDynamic: boolean;
};

export type CSPTSink = {
  pattern: string;
  type: string;
  risk: "high" | "medium" | "low";
  description: string;
  source: string;
  framework: Framework;
  lineContext: string;
};

export type HostData = {
  host: string;
  framework: DetectedFramework;
  paths: ClientPath[];
  sinks: CSPTSink[];
  analyzedUrls: string[];
};

export type AnalysisResult = {
  framework: DetectedFramework | null;
  paths: ClientPath[];
  sinks: CSPTSink[];
};
