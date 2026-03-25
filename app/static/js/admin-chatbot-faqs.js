document.addEventListener('DOMContentLoaded', () => {
  configurarFiltrosFaqChatbot()
  cargarFaqsChatbot()
})

async function cargarFaqsChatbot() {
  try {
    const params = new URLSearchParams()

    const search = (document.getElementById('faqSearch')?.value || '').trim()
    const intent = (document.getElementById('faqIntent')?.value || '').trim()
    const page = (document.getElementById('faqPage')?.value || '').trim()
    const dateFrom = (document.getElementById('faqDateFrom')?.value || '').trim()
    const dateTo = (document.getElementById('faqDateTo')?.value || '').trim()

    if (search) params.set('search', search)
    if (intent) params.set('intent', intent)
    if (page) params.set('page', page)
    if (dateFrom) params.set('date_from', dateFrom)
    if (dateTo) params.set('date_to', dateTo)

    const query = params.toString()
    const response = await fetch(`/api/admin/dashboard/chatbot-faqs${query ? `?${query}` : ''}`)
    const data = await response.json()

    if (!data.success) {
      throw new Error(data.error || 'Error cargando FAQs del chatbot')
    }

    actualizarOpcionesFiltrosFaq(data.filter_options || {})

    const tbody = document.getElementById('chatbot-faq-body')
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
      .join('')
  } catch (error) {
    console.error('Error cargando FAQs chatbot:', error)
    const tbody = document.getElementById('chatbot-faq-body')
    if (!tbody) return
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data">No se pudo cargar FAQs del chatbot</td>
      </tr>
    `
  }
}

function configurarFiltrosFaqChatbot() {
  const applyBtn = document.getElementById('faqApplyFilters')
  const clearBtn = document.getElementById('faqClearFilters')
  const searchInput = document.getElementById('faqSearch')

  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      cargarFaqsChatbot()
    })
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      const ids = ['faqSearch', 'faqIntent', 'faqPage', 'faqDateFrom', 'faqDateTo']
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el) el.value = ''
      })
      cargarFaqsChatbot()
    })
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        cargarFaqsChatbot()
      }
    })
  }
}

function actualizarOpcionesFiltrosFaq(options) {
  const intentSelect = document.getElementById('faqIntent')
  const pageSelect = document.getElementById('faqPage')

  if (intentSelect) {
    const selectedIntent = intentSelect.value
    const intents = Array.isArray(options.intents) ? options.intents : []
    intentSelect.innerHTML = `<option value="">Todas las intenciones</option>${intents
      .map((intent) => `<option value="${escapeHtml(intent)}">${escapeHtml(intent)}</option>`)
      .join('')}`
    intentSelect.value = selectedIntent
  }

  if (pageSelect) {
    const selectedPage = pageSelect.value
    const pages = Array.isArray(options.pages) ? options.pages : []
    pageSelect.innerHTML = `<option value="">Todas las páginas</option>${pages
      .map((page) => `<option value="${escapeHtml(page)}">${escapeHtml(page)}</option>`)
      .join('')}`
    pageSelect.value = selectedPage
  }
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
