<script setup lang="ts">
import { useSDK } from "@/plugins/sdk";
import { ref, onMounted, computed } from "vue";
import Button from "primevue/button";

const sdk = useSDK();

// State
const hosts = ref<string[]>([]);
const selectedHost = ref<string>("all");
const allData = ref<any[]>([]);
const activeTab = ref<"paths" | "sinks">("paths");
const isLoading = ref(false);

// Computed: filtered data
const currentHostData = computed(() => {
  if (selectedHost.value === "all") return allData.value;
  return allData.value.filter((d) => d.host === selectedHost.value);
});

const allPaths = computed(() => {
  const paths: any[] = [];
  for (const hd of currentHostData.value) {
    for (const p of hd.paths || []) {
      paths.push({ ...p, host: hd.host });
    }
  }
  // Sort: dynamic paths first, then alphabetical
  return paths.sort((a, b) => {
    if (a.isDynamic !== b.isDynamic) return a.isDynamic ? -1 : 1;
    return a.path.localeCompare(b.path);
  });
});

const allSinks = computed(() => {
  const sinks: any[] = [];
  for (const hd of currentHostData.value) {
    for (const s of hd.sinks || []) {
      sinks.push({ ...s, host: hd.host });
    }
  }
  // Sort: high risk first
  const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return sinks.sort(
    (a, b) => (riskOrder[a.risk] || 3) - (riskOrder[b.risk] || 3),
  );
});

const stats = computed(() => {
  let totalPaths = 0;
  let totalSinks = 0;
  let dynamicPaths = 0;
  let highRiskSinks = 0;
  for (const hd of allData.value) {
    totalPaths += (hd.paths || []).length;
    totalSinks += (hd.sinks || []).length;
    dynamicPaths += (hd.paths || []).filter((p: any) => p.isDynamic).length;
    highRiskSinks += (hd.sinks || []).filter((s: any) => s.risk === "high").length;
  }
  return { totalPaths, totalSinks, dynamicPaths, highRiskSinks };
});

// Fetch data from backend
async function refresh() {
  isLoading.value = true;
  try {
    const data = await sdk.backend.getAllData();
    allData.value = data || [];
    const hostList = await sdk.backend.getAllHosts();
    hosts.value = hostList || [];
  } catch (e) {
    console.error("Failed to refresh:", e);
  } finally {
    isLoading.value = false;
  }
}

async function clearAll() {
  await sdk.backend.clearData();
  await refresh();
}

// Listen for backend events
onMounted(() => {
  refresh();

  // Auto-refresh when new findings come in
  sdk.backend.onEvent("onNewFindings", () => {
    refresh();
  });
});

// Risk badge colors
function riskColor(risk: string): string {
  switch (risk) {
    case "high":
      return "bg-red-600 text-white";
    case "medium":
      return "bg-yellow-500 text-black";
    case "low":
      return "bg-blue-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
}

function frameworkBadge(fw: string): string {
  const colors: Record<string, string> = {
    nextjs: "bg-purple-600",
    "react-router": "bg-cyan-600",
    remix: "bg-pink-600",
    "vue-router": "bg-green-600",
    nuxt: "bg-emerald-600",
    angular: "bg-red-500",
    sveltekit: "bg-orange-500",
    ember: "bg-amber-600",
    solidstart: "bg-indigo-600",
    astro: "bg-fuchsia-600",
    unknown: "bg-gray-600",
  };
  return colors[fw] || "bg-gray-600";
}
</script>

<template>
  <div class="flex flex-col h-full w-full overflow-hidden text-sm">
    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-700 shrink-0">
      <h1 class="text-lg font-bold whitespace-nowrap">CSPT Analyzer</h1>

      <!-- Stats -->
      <div class="flex items-center gap-3 text-xs">
        <span class="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800">
          {{ hosts.length }} hosts
        </span>
        <span class="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800">
          {{ stats.totalPaths }} paths
        </span>
        <span class="px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800">
          {{ stats.dynamicPaths }} dynamic
        </span>
        <span
          class="px-2 py-0.5 rounded"
          :class="stats.highRiskSinks > 0 ? 'bg-red-600 text-white' : 'bg-surface-100 dark:bg-surface-800'"
        >
          {{ stats.highRiskSinks }} high-risk sinks
        </span>
      </div>

      <div class="flex-grow" />

      <!-- Host filter -->
      <select
        v-model="selectedHost"
        class="text-xs px-2 py-1 rounded bg-surface-100 dark:bg-surface-800 border border-surface-300 dark:border-surface-600"
      >
        <option value="all">All Hosts</option>
        <option v-for="h in hosts" :key="h" :value="h">
          {{ h }}
          <template v-if="allData.find((d) => d.host === h)?.framework?.framework !== 'unknown'">
            ({{ allData.find((d) => d.host === h)?.framework?.framework }})
          </template>
        </option>
      </select>

      <Button label="Refresh" @click="refresh" :disabled="isLoading" size="small" severity="secondary" />
      <Button label="Clear" @click="clearAll" size="small" severity="danger" />
    </div>

    <!-- Framework Detection Bar (for selected host or all) -->
    <div
      v-if="currentHostData.some((d) => d.framework?.framework !== 'unknown')"
      class="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-surface-200 dark:border-surface-700 shrink-0"
    >
      <span class="text-xs font-semibold">Detected:</span>
      <template v-for="hd in currentHostData" :key="hd.host">
        <span
          v-if="hd.framework?.framework !== 'unknown'"
          class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white"
          :class="frameworkBadge(hd.framework.framework)"
          :title="hd.framework.signals?.join(', ')"
        >
          {{ hd.host }}: {{ hd.framework.framework }} ({{ hd.framework.confidence }}%)
        </span>
      </template>
    </div>

    <!-- Tab bar -->
    <div class="flex border-b border-surface-200 dark:border-surface-700 shrink-0">
      <button
        @click="activeTab = 'paths'"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'paths'
          ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
          : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'"
      >
        Client-Side Paths ({{ allPaths.length }})
      </button>
      <button
        @click="activeTab = 'sinks'"
        class="px-4 py-2 text-sm font-medium transition-colors"
        :class="activeTab === 'sinks'
          ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
          : 'text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'"
      >
        CSPT Sinks ({{ allSinks.length }})
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto">
      <!-- Paths Table -->
      <table v-if="activeTab === 'paths'" class="w-full text-xs">
        <thead class="sticky top-0 bg-surface-50 dark:bg-surface-900">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold">Path</th>
            <th class="px-3 py-2 font-semibold w-20">Type</th>
            <th class="px-3 py-2 font-semibold w-20">Dynamic</th>
            <th class="px-3 py-2 font-semibold w-24">Framework</th>
            <th class="px-3 py-2 font-semibold">Host</th>
            <th class="px-3 py-2 font-semibold">Source</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allPaths.length === 0">
            <td colspan="6" class="px-3 py-8 text-center text-surface-400">
              No paths found yet. Browse the target to start passive analysis.
            </td>
          </tr>
          <tr
            v-for="(p, i) in allPaths"
            :key="i"
            class="border-t border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800"
            :class="p.isDynamic ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''"
          >
            <td class="px-3 py-1.5 font-mono break-all">
              {{ p.path }}
            </td>
            <td class="px-3 py-1.5">
              <span class="px-1.5 py-0.5 rounded text-[10px] bg-surface-200 dark:bg-surface-700">
                {{ p.type }}
              </span>
            </td>
            <td class="px-3 py-1.5">
              <span v-if="p.isDynamic" class="px-1.5 py-0.5 rounded text-[10px] bg-yellow-500 text-black">
                DYNAMIC
              </span>
            </td>
            <td class="px-3 py-1.5">
              <span
                class="px-1.5 py-0.5 rounded text-[10px] text-white"
                :class="frameworkBadge(p.framework)"
              >
                {{ p.framework }}
              </span>
            </td>
            <td class="px-3 py-1.5 truncate max-w-[150px]" :title="p.host">
              {{ p.host }}
            </td>
            <td class="px-3 py-1.5 truncate max-w-[200px] text-surface-400" :title="p.source">
              {{ p.source }}
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Sinks Table -->
      <table v-if="activeTab === 'sinks'" class="w-full text-xs">
        <thead class="sticky top-0 bg-surface-50 dark:bg-surface-900">
          <tr class="text-left">
            <th class="px-3 py-2 font-semibold w-16">Risk</th>
            <th class="px-3 py-2 font-semibold w-40">Type</th>
            <th class="px-3 py-2 font-semibold">Description</th>
            <th class="px-3 py-2 font-semibold">Context</th>
            <th class="px-3 py-2 font-semibold">Host</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allSinks.length === 0">
            <td colspan="5" class="px-3 py-8 text-center text-surface-400">
              No CSPT sinks found yet. Browse the target to start passive analysis.
            </td>
          </tr>
          <tr
            v-for="(s, i) in allSinks"
            :key="i"
            class="border-t border-surface-100 dark:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800"
          >
            <td class="px-3 py-1.5">
              <span
                class="px-1.5 py-0.5 rounded text-[10px] font-bold"
                :class="riskColor(s.risk)"
              >
                {{ s.risk.toUpperCase() }}
              </span>
            </td>
            <td class="px-3 py-1.5 font-mono text-[10px]">
              {{ s.type }}
            </td>
            <td class="px-3 py-1.5 max-w-[300px]" :title="s.description">
              {{ s.description }}
            </td>
            <td class="px-3 py-1.5 font-mono text-[10px] max-w-[300px] truncate" :title="s.lineContext">
              {{ s.lineContext }}
            </td>
            <td class="px-3 py-1.5 truncate max-w-[120px]" :title="s.host">
              {{ s.host }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
