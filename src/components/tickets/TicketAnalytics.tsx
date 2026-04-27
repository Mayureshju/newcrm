import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import type { Ticket } from "../../types/ticket";
import { STATUS_OPTIONS, TYPE_OPTIONS, PRIORITY_OPTIONS } from "../../data/ticketMocks";

export default function TicketAnalytics({ tickets }: { tickets: Ticket[] }) {
  const statusCounts = STATUS_OPTIONS.map(
    (s) => tickets.filter((t) => t.status === s).length
  );
  const typeCounts = TYPE_OPTIONS.map(
    (ty) => tickets.filter((t) => t.type === ty).length
  );
  const priorityCounts = PRIORITY_OPTIONS.map(
    (p) => tickets.filter((t) => t.priority === p).length
  );

  const statusOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Outfit, sans-serif",
      toolbar: { show: false },
    },
    labels: STATUS_OPTIONS as string[],
    colors: ["#3b82f6", "#f59e0b", "#8b5cf6", "#10b981", "#9ca3af"],
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
              label: "Total",
              fontFamily: "Outfit, sans-serif",
              fontSize: "13px",
            },
          },
        },
      },
    },
  };

  const typeOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      height: 220,
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
      categories: TYPE_OPTIONS as string[],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    grid: {
      yaxis: { lines: { show: false } },
      xaxis: { lines: { show: true } },
    },
    tooltip: { y: { formatter: (v: number) => `${v} tickets` } },
  };

  const priorityOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Outfit, sans-serif",
      height: 220,
      toolbar: { show: false },
    },
    colors: ["#9ca3af", "#f59e0b", "#fb923c", "#ef4444"],
    plotOptions: {
      bar: {
        distributed: true,
        borderRadius: 6,
        borderRadiusApplication: "end",
        columnWidth: "45%",
      },
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    xaxis: {
      categories: PRIORITY_OPTIONS as string[],
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    tooltip: { y: { formatter: (v: number) => `${v} tickets` } },
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Tickets by Status
          </h3>
          <span className="text-xs text-gray-400">last 30 days</span>
        </div>
        <Chart
          options={statusOptions}
          series={statusCounts}
          type="donut"
          height={260}
        />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Tickets by Type
          </h3>
          <span className="text-xs text-gray-400">all time</span>
        </div>
        <Chart
          options={typeOptions}
          series={[{ name: "Tickets", data: typeCounts }]}
          type="bar"
          height={260}
        />
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
            Tickets by Priority
          </h3>
          <span className="text-xs text-gray-400">all time</span>
        </div>
        <Chart
          options={priorityOptions}
          series={[{ name: "Tickets", data: priorityCounts }]}
          type="bar"
          height={260}
        />
      </div>
    </div>
  );
}
