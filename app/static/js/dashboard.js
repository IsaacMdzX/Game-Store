// Dashboard Analytics - Chart.js Implementation

let salesChartInstance = null
let topProductsChartInstance = null
let salesChartState = null
let topProductsChartState = null

function getDashboardChartTheme() {
  const isLight = document.documentElement.dataset.theme === "light"
  return isLight
    ? {
        text: "#35516d",
        value: "#17314f",
        grid: "rgba(50, 91, 132, 0.13)",
        border: "#d2e0ed",
        tooltipBackground: "#ffffff",
        tooltipText: "#17314f",
      }
    : {
        text: "#a9c5e2",
        value: "#eaf3ff",
        grid: "rgba(150, 185, 225, 0.12)",
        border: "#20354d",
        tooltipBackground: "#0b1727",
        tooltipText: "#f2f7ff",
      }
}

const topProductsValuePlugin = {
  id: "topProductsValuePlugin",
  afterDatasetsDraw(chart) {
    if (chart?.canvas?.id !== "topProductsChart") return

    const dataset = chart.data?.datasets?.[0]
    const meta = chart.getDatasetMeta(0)
    if (!dataset || !meta?.data?.length) return

    const { ctx, chartArea } = chart
    ctx.save()
    ctx.font = "600 11px sans-serif"
    ctx.textBaseline = "middle"

    meta.data.forEach((bar, index) => {
      const value = Number(dataset.data[index] || 0)
      if (!value) return

      const text = value.toLocaleString()
      let x = bar.x + 8
      let align = "left"
      const theme = getDashboardChartTheme()
      let color = theme.value

      if (x > chartArea.right - 22) {
        x = bar.x - 8
        align = "right"
        color = theme.value
      }

      ctx.textAlign = align
      ctx.fillStyle = color
      ctx.fillText(text, x, bar.y)
    })

    ctx.restore()
  },
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof Chart === "undefined") {
    console.error("Chart.js no está cargado")
    return
  }

  cargarResumen()
  cargarVentas(document.getElementById("salesPeriod")?.value || "month")
  cargarTopProductos()
  cargarActividad()
  cargarPedidosRecientes()
  configurarFiltrosFaqChatbot()
  cargarFaqsChatbot()

  const chartThemeObserver = new MutationObserver(() => {
    if (salesChartState) renderSalesChart(salesChartState.labels, salesChartState.data)
    if (topProductsChartState) renderTopProductsChart(topProductsChartState.labels, topProductsChartState.data)
  })
  chartThemeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })

  const periodSelect = document.getElementById("salesPeriod")
  if (periodSelect) {
    periodSelect.addEventListener("change", (e) => {
      cargarVentas(e.target.value)
    })
  }
})

async function cargarResumen() {
  try {
    const response = await fetch("/api/admin/dashboard/summary")
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando resumen")

    setStat("daily-sales", formatCurrency(data.summary.daily_sales))
    setStat("pending-orders", data.summary.pending_orders)
    setStat("low-stock", data.summary.low_stock)
    setStat("active-customers", data.summary.active_customers)
  } catch (error) {
    console.error("Error cargando resumen:", error)
  }
}

async function cargarVentas(period) {
  try {
    const response = await fetch(`/api/admin/dashboard/sales?period=${period}`)
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando ventas")

    renderSalesChart(data.chart.labels, data.chart.data)
  } catch (error) {
    console.error("Error cargando ventas:", error)
  }
}

async function cargarTopProductos() {
  try {
    const response = await fetch("/api/admin/dashboard/top-products")
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando top productos")

    renderTopProductsChart(data.chart.labels, data.chart.data)
  } catch (error) {
    console.error("Error cargando top productos:", error)
  }
}

async function cargarActividad() {
  try {
    const response = await fetch("/api/admin/dashboard/recent-activity")
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando actividad")

    const container = document.getElementById("activity-grid")
    if (!container) return

    if (!data.activity.length) {
      container.innerHTML = `<div class="no-data">No hay actividad reciente</div>`
      return
    }

    container.innerHTML = data.activity
      .map(
        (item) => `
        <div class="activity-card">
          <div class="activity-icon ${item.icon_class}">${item.icon}</div>
          <div class="activity-content">
            <div class="activity-title">${item.title}</div>
            <div class="activity-description">${item.description}</div>
            <div class="activity-time">${formatTimeAgo(item.timestamp)}</div>
          </div>
        </div>
      `
      )
      .join("")
  } catch (error) {
    console.error("Error cargando actividad:", error)
  }
}

async function cargarPedidosRecientes() {
  try {
    const response = await fetch("/api/admin/dashboard/recent-orders")
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando pedidos recientes")

    const tbody = document.getElementById("recent-orders-body")
    if (!tbody) return

    if (!data.orders.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="no-data">No hay pedidos recientes</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data.orders
      .map(
        (pedido) => `
        <tr>
          <td>${pedido.numero_pedido}</td>
          <td>${pedido.cliente}</td>
          <td>${pedido.productos}</td>
          <td>${formatCurrency(pedido.total)}</td>
          <td><span class="status-badge ${pedido.estado}">${pedido.estado_label}</span></td>
          <td>${pedido.fecha}</td>
          <td>
            <div class="action-buttons">
              <button class="btn-icon" title="Ver" onclick="window.location.href='/admin/pedidos'">👁️</button>
              <button class="btn-icon" title="Editar" onclick="window.location.href='/admin/pedidos'">✏️</button>
            </div>
          </td>
        </tr>
      `
      )
      .join("")
  } catch (error) {
    console.error("Error cargando pedidos recientes:", error)
  }
}

async function cargarFaqsChatbot() {
  try {
    const params = new URLSearchParams()

    const search = (document.getElementById("faqSearch")?.value || "").trim()
    const intent = (document.getElementById("faqIntent")?.value || "").trim()
    const page = (document.getElementById("faqPage")?.value || "").trim()
    const dateFrom = (document.getElementById("faqDateFrom")?.value || "").trim()
    const dateTo = (document.getElementById("faqDateTo")?.value || "").trim()

    if (search) params.set("search", search)
    if (intent) params.set("intent", intent)
    if (page) params.set("page", page)
    if (dateFrom) params.set("date_from", dateFrom)
    if (dateTo) params.set("date_to", dateTo)

    const query = params.toString()
    const response = await fetch(`/api/admin/dashboard/chatbot-faqs${query ? `?${query}` : ""}`)
    const data = await response.json()
    if (!data.success) throw new Error(data.error || "Error cargando FAQs del chatbot")

    actualizarOpcionesFiltrosFaq(data.filter_options || {})

    const tbody = document.getElementById("chatbot-faq-body")
    if (!tbody) return

    if (!data.faqs.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="no-data">Aún no hay preguntas frecuentes registradas</td>
        </tr>
      `
      return
    }

    tbody.innerHTML = data.faqs
      .map(
        (faq) => `
        <tr>
          <td>${escapeHtml(faq.pregunta)}</td>
          <td>${faq.frecuencia}</td>
          <td>${escapeHtml(faq.ultima_intencion)}</td>
          <td>${escapeHtml(faq.ultima_pagina)}</td>
          <td>${faq.ultima_consulta}</td>
        </tr>
      `
      )
      .join("")
  } catch (error) {
    console.error("Error cargando FAQs chatbot:", error)
    const tbody = document.getElementById("chatbot-faq-body")
    if (!tbody) return
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">No se pudo cargar FAQs del chatbot</td>
      </tr>
    `
  }
}

function configurarFiltrosFaqChatbot() {
  const applyBtn = document.getElementById("faqApplyFilters")
  const clearBtn = document.getElementById("faqClearFilters")
  const searchInput = document.getElementById("faqSearch")

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      cargarFaqsChatbot()
    })
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      const ids = ["faqSearch", "faqIntent", "faqPage", "faqDateFrom", "faqDateTo"]
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) el.value = ""
      })
      cargarFaqsChatbot()
    })
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault()
        cargarFaqsChatbot()
      }
    })
  }
}

function actualizarOpcionesFiltrosFaq(options) {
  const intentSelect = document.getElementById("faqIntent")
  const pageSelect = document.getElementById("faqPage")

  if (intentSelect) {
    const selectedIntent = intentSelect.value
    const intents = Array.isArray(options.intents) ? options.intents : []
    intentSelect.innerHTML = `<option value="">Todas las intenciones</option>${intents
      .map((intent) => `<option value="${escapeHtml(intent)}">${escapeHtml(intent)}</option>`)
      .join("")}`
    intentSelect.value = selectedIntent
  }

  if (pageSelect) {
    const selectedPage = pageSelect.value
    const pages = Array.isArray(options.pages) ? options.pages : []
    pageSelect.innerHTML = `<option value="">Todas las páginas</option>${pages
      .map((page) => `<option value="${escapeHtml(page)}">${escapeHtml(page)}</option>`)
      .join("")}`
    pageSelect.value = selectedPage
  }
}

function renderSalesChart(labels, data) {
  const ctx = document.getElementById("salesChart")
  if (!ctx) return

  salesChartState = { labels: [...labels], data: [...data] }

  if (salesChartInstance) salesChartInstance.destroy()

  const prepared = prepareSalesPieData(labels, data)
  const emptyState = document.getElementById("salesChartEmpty")
  const legend = document.getElementById("salesLegend")

  if (!prepared.data.some((value) => Number(value) > 0)) {
    ctx.hidden = true
    if (legend) legend.replaceChildren()
    if (emptyState) emptyState.hidden = false
    salesChartInstance = null
    return
  }

  ctx.hidden = false
  if (emptyState) emptyState.hidden = true

  const pieColors = generateChartColors(prepared.data.length)
  const theme = getDashboardChartTheme()

  salesChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: prepared.labels,
      datasets: [
        {
          label: "Ventas",
          data: prepared.data,
          backgroundColor: pieColors,
          borderColor: theme.border,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: theme.tooltipBackground,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          borderColor: theme.border,
          borderWidth: 1,
          callbacks: {
            label: (context) => {
              const label = context.label || ""
              const value = Number(context.parsed || 0)
              return `${label}: ${formatCurrency(value)}`
            },
          },
        },
      },
    },
  })

  renderCustomLegend("salesLegend", prepared.labels, prepared.data, pieColors, (value) => formatCurrency(value))
}

function renderTopProductsChart(labels, data) {
  const ctx = document.getElementById("topProductsChart")
  if (!ctx) return

  topProductsChartState = { labels: [...labels], data: [...data] }

  if (topProductsChartInstance) topProductsChartInstance.destroy()

  const prepared = prepareTopProductsBarData(labels, data)
  const emptyState = document.getElementById("topProductsEmpty")
  if (!prepared.data.some((value) => Number(value) > 0)) {
    ctx.hidden = true
    if (emptyState) emptyState.hidden = false
    topProductsChartInstance = null
    return
  }

  ctx.hidden = false
  if (emptyState) emptyState.hidden = true

  const barColors = generateChartColors(prepared.data.length)
  const theme = getDashboardChartTheme()
  if (barColors.length) {
    barColors[0] = "#62b0ff"
  }

  topProductsChartInstance = new Chart(ctx, {
    plugins: [topProductsValuePlugin],
    type: "bar",
    data: {
      labels: prepared.labels,
      datasets: [
        {
          label: "Unidades Vendidas",
          data: prepared.data,
          backgroundColor: barColors,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 10,
          maxBarThickness: 12,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.25,
      indexAxis: "y",
      layout: {
        padding: {
          right: 26,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: theme.tooltipBackground,
          titleColor: theme.tooltipText,
          bodyColor: theme.tooltipText,
          borderColor: theme.border,
          borderWidth: 1,
          callbacks: {
            title: (items) => {
              const index = items?.[0]?.dataIndex ?? 0
              return prepared.fullLabels[index] || prepared.labels[index] || ""
            },
            label: (context) => {
              const value = Number(context.parsed || 0)
              return `${value.toLocaleString()} unidades`
            },
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: theme.grid,
          },
          ticks: {
            color: theme.text,
            font: {
              size: 11,
            },
          },
        },
        y: {
          grid: {
            display: false,
          },
          ticks: {
            color: theme.text,
            font: {
              size: 11,
              weight: "600",
            },
          },
        },
      },
    },
  })

  const topLegend = document.getElementById("topProductsLegend")
  if (topLegend) {
    topLegend.innerHTML = ""
    topLegend.style.display = "none"
  }
}

function prepareSalesPieData(labels, data) {
  const safeLabels = Array.isArray(labels) ? labels : []
  const safeData = Array.isArray(data) ? data.map((item) => Number(item || 0)) : []

  if (safeLabels.length <= 7) {
    return { labels: safeLabels, data: safeData }
  }

  const recentLabels = safeLabels.slice(-7)
  const recentData = safeData.slice(-7)
  const previousSum = safeData.slice(0, -7).reduce((acc, value) => acc + value, 0)

  if (previousSum > 0) {
    return {
      labels: [...recentLabels, "Anteriores"],
      data: [...recentData, previousSum],
    }
  }

  return { labels: recentLabels, data: recentData }
}

function prepareTopProductsBarData(labels, data) {
  const safeLabels = Array.isArray(labels) ? labels : []
  const safeData = Array.isArray(data) ? data.map((item) => Number(item || 0)) : []

  const orderedProducts = safeLabels
    .map((label, index) => ({
      label,
      value: safeData[index] || 0,
    }))
    .sort((a, b) => b.value - a.value)

  const topProducts = orderedProducts.slice(0, 5)
  const topLabels = topProducts.map((item) => item.label)
  const topData = topProducts.map((item) => item.value)

  return {
    labels: topLabels.map((label) => truncateLabel(label, 20)),
    fullLabels: topLabels,
    data: topData,
  }
}

function truncateLabel(value, maxLength) {
  const text = String(value || "")
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1)}…`
}

function renderCustomLegend(containerId, labels, data, colors, valueFormatter) {
  const legend = document.getElementById(containerId)
  if (!legend) return

  if (!labels.length) {
    legend.innerHTML = ""
    return
  }

  legend.innerHTML = labels
    .map((label, index) => {
      const color = colors[index] || "#62b0ff"
      const rawValue = Number(data[index] || 0)
      const valueText = valueFormatter ? valueFormatter(rawValue) : rawValue.toLocaleString()

      return `
        <div class="chart-legend-item" title="${label}">
          <span class="chart-legend-dot" style="background:${color}"></span>
          <span class="chart-legend-label">${truncateLabel(label, 24)}</span>
          <span class="chart-legend-value">${valueText}</span>
        </div>
      `
    })
    .join("")
}

function generateChartColors(count) {
  const palette = [
    "#2f7ddd",
    "#55a9ed",
    "#19a7c9",
    "#7ac7e8",
    "#1766b1",
    "#66d9e8",
    "#2d4d73",
    "#9ac8ef",
    "#3183a6",
    "#4d8ec4",
  ]

  return Array.from({ length: count }, (_, index) => palette[index % palette.length])
}

function setStat(statName, value) {
  const element = document.querySelector(`[data-stat="${statName}"]`)
  if (element) element.textContent = value
}

function formatCurrency(value) {
  const numberValue = Number(value || 0)
  return `$${numberValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatTimeAgo(timestamp) {
  if (!timestamp) return ""
  const date = new Date(timestamp)
  const diffMs = Date.now() - date.getTime()
  const diffMin = Math.round(diffMs / 60000)

  if (diffMin < 1) return "Hace unos segundos"
  if (diffMin < 60) return `Hace ${diffMin} minuto${diffMin !== 1 ? "s" : ""}`

  const diffHours = Math.round(diffMin / 60)
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`

  const diffDays = Math.round(diffHours / 24)
  return `Hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`
}
