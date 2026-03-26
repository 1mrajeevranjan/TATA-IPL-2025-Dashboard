/* ============================================
   CHARTS (ApexCharts)
   ============================================ */

/**
 * Common theme configuration for ApexCharts to sync with CSS Custom Properties
 */
function getChartThemeConfig() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  
  const getVar = (name, fallback) => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  };

  return {
    mode: isLight ? 'light' : 'dark',
    fontFamily: getVar('--font-data', 'Inter, sans-serif'),
    textColor: getVar('--on-surface-variant', isLight ? '#475569' : '#94a3b8'),
    primaryColor: getVar('--primary', '#4edea3'),
    gridColor: getVar('--outline', 'rgba(255,255,255,0.1)'),
    background: 'transparent',
    tooltipBg: getVar('--surface-container-high', isLight ? '#ffffff' : '#1e293b')
  };
}

class ChartManager {
  constructor() {
    this.instances = {};
  }

  /**
   * Over-by-over Worm Chart (Line Chart)
   */
  createWormChart(selector, data) {
    const t = getChartThemeConfig();
    const options = {
      series: [
        { name: 'MUMBAI', data: data.team1 },
        { name: 'CHENNAI', data: data.team2 }
      ],
      chart: {
        type: 'line',
        height: 380,
        background: t.background,
        toolbar: { show: false },
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      colors: [t.primaryColor, '#7bd0ff'],
      stroke: { curve: 'smooth', width: 3 },
      grid: {
        borderColor: t.gridColor,
        strokeDashArray: 4,
        padding: { left: 8, right: 12 },
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } }
      },
      markers: { 
        size: 0, 
        hover: { size: 6 },
        discrete: [
          ...(data.wickets1 || []).map(idx => ({
            seriesIndex: 0,
            dataPointIndex: idx,
            fillColor: '#fff',
            strokeColor: t.primaryColor,
            size: 5,
            shape: "circle"
          })),
          ...(data.wickets2 || []).map(idx => ({
            seriesIndex: 1,
            dataPointIndex: idx,
            fillColor: '#fff',
            strokeColor: '#7bd0ff',
            size: 5,
            shape: "circle"
          }))
        ]
      },
      xaxis: {
        categories: data.labels,
        title: { text: 'Overs', style: { color: t.textColor, fontFamily: t.fontFamily, fontSize: '12px', fontWeight: 600 } },
        labels: {
          style: { colors: t.textColor, fontFamily: t.fontFamily, fontSize: '11px' },
          rotate: 0
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tickAmount: 20
      },
      yaxis: {
        title: { text: 'Runs', style: { color: t.textColor, fontFamily: t.fontFamily, fontSize: '12px', fontWeight: 600 } },
        labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: t.textColor },
        fontFamily: t.fontFamily,
        fontWeight: 600
      },
      theme: { mode: t.mode },
      tooltip: {
        theme: t.mode,
        x: { formatter: (val) => 'Over ' + val }
      }
    };

    const el = document.querySelector(selector);
    if (!el) return;
    
    if (this.instances[selector]) this.instances[selector].destroy();
    
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }

  /**
   * Win Probability (Radial Bar)
   */
  createWinProbabilityGauge(selector, percentage) {
    const t = getChartThemeConfig();
    const options = {
      series: [percentage],
      chart: {
        type: 'radialBar',
        height: 250,
        background: t.background,
        sparkline: { enabled: true }
      },
      plotOptions: {
        radialBar: {
          startAngle: -90,
          endAngle: 90,
          track: {
            background: t.gridColor,
            strokeWidth: '100%',
            dropShadow: { enabled: false }
          },
          hollow: { size: '60%' },
          dataLabels: {
            name: { show: false },
            value: {
              offsetY: 0,
              fontSize: '28px',
              fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-display'),
              fontWeight: 700,
              color: t.primaryColor,
              formatter: function (val) {
                return val + "%";
              }
            }
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          gradientToColors: ['#009365'], // Matches primary gradient
          stops: [0, 100]
        }
      },
      stroke: { lineCap: 'round' },
      colors: [t.primaryColor]
    };

    const el = document.querySelector(selector);
    if (!el) return;
    
    if (this.instances[selector]) this.instances[selector].destroy();
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }

  /**
   * Performance Bar Chart
   */
  createBarChart(selector, data, color) {
    const t = getChartThemeConfig();
    const options = {
      series: [{ name: 'Value', data: data.values }],
      chart: { type: 'bar', height: 280, background: t.background, toolbar: { show: false } },
      colors: [color || t.primaryColor],
      plotOptions: { bar: { borderRadius: 4, columnWidth: '50%' } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: data.labels,
        labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } } },
      grid: { borderColor: t.gridColor, strokeDashArray: 4 },
      theme: { mode: t.mode }
    };

    const el = document.querySelector(selector);
    if (!el) return;
    if (this.instances[selector]) this.instances[selector].destroy();
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }

  /**
   * Area Chart (Run Rate / Form)
   */
  createAreaChart(selector, data, color) {
    const t = getChartThemeConfig();
    const options = {
      series: [{ name: 'Runs', data: data.runs || data.values }],
      chart: { type: 'area', height: 280, background: t.background, toolbar: { show: false }, sparkline: { enabled: false } },
      colors: [color || t.primaryColor],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.45,
          opacityTo: 0.05,
          stops: [20, 100]
        }
      },
      xaxis: {
        categories: data.labels,
        labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: { labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } } },
      grid: { borderColor: t.gridColor, strokeDashArray: 4 },
      theme: { mode: t.mode }
    };

    const el = document.querySelector(selector);
    if (!el) return;
    if (this.instances[selector]) this.instances[selector].destroy();
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }

  /**
   * Horizontal Bar Chart (Stat Comparison)
   */
  createHorizontalBarChart(selector, data) {
    const t = getChartThemeConfig();
    const options = {
      series: [{ data: data.values }],
      chart: { type: 'bar', height: 250, background: t.background, toolbar: { show: false } },
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '60%' } },
      colors: [t.primaryColor],
      dataLabels: { enabled: true, style: { fontSize: '11px', fontWeight: 700 } },
      xaxis: {
        categories: data.labels,
        labels: { show: false }
      },
      yaxis: {
        labels: { style: { colors: t.textColor, fontFamily: t.fontFamily, fontWeight: 600 } }
      },
      grid: { show: false },
      theme: { mode: t.mode }
    };

    const el = document.querySelector(selector);
    if (!el) return;
    if (this.instances[selector]) this.instances[selector].destroy();
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }

  /**
   * Tactical Radar Chart
   */
  createRadarChart(selector, data) {
    const t = getChartThemeConfig();
    const options = {
      series: data.series, // Array of {name, data}
      chart: { type: 'radar', height: 350, background: t.background, toolbar: { show: false } },
      colors: [t.primaryColor, '#7bd0ff'],
      stroke: { width: 2 },
      fill: { opacity: 0.2 },
      markers: { size: 4 },
      xaxis: {
        categories: data.labels,
        labels: { style: { colors: t.textColor, fontFamily: t.fontFamily } }
      },
      yaxis: { show: false },
      legend: { show: true, position: 'bottom', labels: { colors: t.textColor } },
      theme: { mode: t.mode }
    };

    const el = document.querySelector(selector);
    if (!el) return;
    if (this.instances[selector]) this.instances[selector].destroy();
    const chart = new ApexCharts(el, options);
    chart.render();
    this.instances[selector] = chart;
  }
}

// Global instance
window.charts = new ChartManager();
