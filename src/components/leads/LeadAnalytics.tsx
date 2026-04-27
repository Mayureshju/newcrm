import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { Lead } from "../../types/lead";
import { SOURCE_OPTIONS, STAGE_OPTIONS } from "../../data/leadMocks";

export default function LeadAnalytics({ leads }: { leads: Lead[] }) {
  const stageCounts = STAGE_OPTIONS.map((s) => leads.filter((l) => l.stage === s).length);
  const sourceCounts = SOURCE_OPTIONS.map(
    (s) => leads.filter((l) => l.utm.source === s).length
  );

  const campaignBuckets = leads.reduce<Record<string, { total: number; converted: number }>>(
    (acc, l) => {
      const c = l.utm.campaign;
      if (!acc[c]) acc[c] = { total: 0, converted: 0 };
      acc[c].total += 1;
      if (l.disposition === "Converted") acc[c].converted += 1;
      return acc;
    },
    {}
  );
  const campaignNames = Object.keys(campaignBuckets);
  const campaignTotals = campaignNames.map((c) => campaignBuckets[c].total);
  const campaignConverted = campaignNames.map((c) => campaignBuckets[c].converted);

  const stageOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#465fff"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "55%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: STAGE_OPTIONS as string[],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      yaxis: { lines: { show: false } },
      xaxis: { lines: { show: true } },
    },
    tooltip: { y: { formatter: (v: number) => `${v} leads` } },
  };

  const sourceOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels: SOURCE_OPTIONS as string[],
    colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#6366f1", "#22c55e", "#9ca3af"],
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
      fontSize: "12px",
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Sources",
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
            },
          },
        },
      },
    },
  };

  const campaignOptions: ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    colors: ["#465fff", "#10b981"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "55%",
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontFamily: "Outfit, sans-serif",
      fontSize: "12px",
    },
    xaxis: {
      categories: campaignNames,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px" },
      },
    },
    grid: {
      yaxis: { lines: { show: false } },
      xaxis: { lines: { show: true } },
    },
    tooltip: { y: { formatter: (v: number) => `${v} leads` } },
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Pipeline by Stage
          </h3>
          <span className="text-xs text-gray-400">live</span>
        </div>
        <Chart
          options={stageOptions}
          series={[{ name: "Leads", data: stageCounts }]}
          type="bar"
          height={260}
        />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Source Mix (UTM)
          </h3>
          <span className="text-xs text-gray-400">via AppsFlyer</span>
        </div>
        <Chart options={sourceOptions} series={sourceCounts} type="donut" height={260} />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Campaign Performance
          </h3>
          <span className="text-xs text-gray-400">total · converted</span>
        </div>
        <Chart
          options={campaignOptions}
          series={[
            { name: "Leads", data: campaignTotals },
            { name: "Converted", data: campaignConverted },
          ]}
          type="bar"
          height={260}
        />
      </div>
    </div>
  );
}
