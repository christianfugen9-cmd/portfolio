const byId = (id) => document.getElementById(id)

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      entry.target.classList.add('is-revealed')
      revealObserver.unobserve(entry.target)
    }
  }, { rootMargin: '0px 0px -32px' })

  for (const section of document.querySelectorAll('main > .section > .site-shell')) {
    revealObserver.observe(section)
  }
}

const menu = byId('menu-toggle')
const nav = byId('site-nav')
const navLinks = [...nav.querySelectorAll('a')]
const navSections = navLinks.map((link) => byId(link.hash.slice(1)))
const header = document.querySelector('.site-header')
const page = document.documentElement
const themeToggle = byId('theme-toggle')
const themeColor = document.querySelector('meta[name="theme-color"]')
themeToggle.hidden = false
function updateThemeButton() {
  const light = page.dataset.theme === 'light'
  const label = light ? 'Switch to dark mode' : 'Switch to light mode'
  themeToggle.setAttribute('aria-label', label)
  themeToggle.title = label
  themeColor.content = light ? '#F7F9F6' : '#0B0F0E'
}
updateThemeButton()
themeToggle.addEventListener('click', () => {
  const next = page.dataset.theme === 'light' ? 'dark' : 'light'
  page.dataset.theme = next
  updateThemeButton()
  try {
    localStorage.setItem('portfolio-theme', next)
  } catch {
    // The current theme still applies when storage is unavailable.
  }
})

function setMenu(open) {
  menu.setAttribute('aria-expanded', String(open))
  nav.classList.toggle('is-open', open)
}

menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') === 'false'))
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a')
  if (!link || menu.getAttribute('aria-expanded') !== 'true') return
  setMenu(false)
  const section = byId(link.hash.slice(1))
  section.tabIndex = -1
  section.focus({ preventScroll: true })
})
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    setMenu(false)
    menu.focus()
  }
})
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) setMenu(false)
})

let navigationFrame = 0
function updateNavigation() {
  navigationFrame = 0
  const marker = header.offsetHeight + Math.min(window.innerHeight * .14, 100)
  const last = navSections.length - 1
  let active = 0
  for (const [index, section] of navSections.entries()) {
    if (section.getBoundingClientRect().top > marker) break
    active = index
  }
  if (window.scrollY > 0 && window.scrollY + window.innerHeight >= page.scrollHeight - 2) {
    active = last
  }
  for (const [index, link] of navLinks.entries()) {
    if (index === active) link.setAttribute('aria-current', 'location')
    else link.removeAttribute('aria-current')
  }
}

function scheduleNavigationUpdate() {
  if (!navigationFrame) navigationFrame = requestAnimationFrame(updateNavigation)
}

window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true })
window.addEventListener('resize', scheduleNavigationUpdate)
window.addEventListener('hashchange', scheduleNavigationUpdate)
updateNavigation()

let hashTimer
window.addEventListener('scroll', () => {
  clearTimeout(hashTimer)
  hashTimer = setTimeout(() => {
    const activeLink = nav.querySelector('[aria-current="location"]')
    const currentAnchor = byId(location.hash.slice(1))
    const activeSection = byId(activeLink.hash.slice(1))
    if (activeSection.contains(currentAnchor) || (!location.hash && activeSection === navSections[0])) return
    history.replaceState(history.state, '', activeLink.hash)
  }, 150)
}, { passive: true })

const palette = byId('cmd-palette-backdrop')
const query = byId('cmd-input')
const results = byId('cmd-results')
const commandOptions = [...navLinks]

function renderCommands() {
  const search = query.value.trim().toLowerCase()
  results.replaceChildren()
  for (const link of commandOptions) {
    if (!link.textContent.toLowerCase().includes(search)) continue
    const row = document.createElement('li')
    const option = link.cloneNode(true)
    option.removeAttribute('aria-current')
    option.removeAttribute('id')
    option.className = 'command-option'
    option.addEventListener('click', () => {
      palette.close()
      setMenu(false)
      const section = byId(option.hash.slice(1))
      section.tabIndex = -1
      section.focus({ preventScroll: true })
    })
    row.append(option)
    results.append(row)
  }
  if (!results.firstChild) {
    const empty = document.createElement('li')
    empty.textContent = 'No matching commands.'
    results.append(empty)
  }
}

function openPalette() {
  if (palette.open) return
  setMenu(false)
  query.value = ''
  renderCommands()
  palette.showModal()
  query.focus()
}

byId('cmd-palette-btn').addEventListener('click', openPalette)
query.addEventListener('input', renderCommands)
query.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') results.querySelector('.command-option')?.click()
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    results.querySelector('.command-option')?.focus()
  }
})
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    if (event.repeat) return
    if (palette.open) palette.close()
    else openPalette()
  }
})

const responseData = {
  '/api/health': { state: 'healthy' },
  '/api/events': { state: 'accepted', eventId: 'demo-event-001' },
  '/api/orders': { state: 'available', orderId: 'demo-order-001' },
}
const failureResponses = {
  limited: { status: 429, error: 'Too many requests', retryAfterSeconds: 5 },
  unavailable: { status: 503, error: 'Upstream unavailable' },
}
byId('api-form').addEventListener('submit', (event) => {
  event.preventDefault()
  const endpoint = byId('api-endpoint').value
  const scenario = byId('api-scenario').value
  const response = failureResponses[scenario] ?? { status: 200, data: responseData[endpoint] }
  const latencyMs = Number((0.6 + Math.random() * 1.3).toFixed(2))
  byId('latency-val').textContent = response.status + ' / ' + latencyMs.toFixed(2) + ' ms simulated'
  byId('api-output').textContent = JSON.stringify({ endpoint, simulated: true, latencyMs, ...response }, null, 2)
})

const incomingRate = 120
const consumerRate = 70
const consumerLimit = 6
const addConsumer = byId('add-consumer')
const failConsumer = byId('fail-consumer')
const recoverConsumer = byId('recover-consumer')
const pipelineStatus = byId('pipeline-status')
const architecture = byId('architecture')
let consumers = 1
let offline = 0
let queue = 0
let pipelineTimer

function renderPipeline() {
  const active = consumers - offline
  const capacity = active * consumerRate
  byId('active-consumers').textContent = active + ' / ' + consumers
  byId('queue-depth').textContent = queue.toLocaleString('en-US')
  byId('queue-latency').textContent = capacity ? Math.round(queue / capacity * 1000).toLocaleString('en-US') + ' ms' : 'Stalled'
  architecture.classList.toggle('is-processing', active > 0)
  architecture.classList.toggle('has-backlog', queue > 0)
  addConsumer.disabled = consumers >= consumerLimit
  failConsumer.disabled = active === 0
  recoverConsumer.disabled = offline === 0
}

function runPipeline(message) {
  clearInterval(pipelineTimer)
  renderPipeline()
  let seconds = 0
  function tick() {
    queue = Math.max(0, queue + incomingRate - (consumers - offline) * consumerRate)
    renderPipeline()
    if (++seconds === 5) {
      clearInterval(pipelineTimer)
      pipelineStatus.textContent = message + ' After five simulated seconds: ' + queue + ' events queued.'
    }
  }
  if (reducedMotion.matches) {
    for (let step = 0; step < 5; step++) tick()
  } else {
    pipelineStatus.textContent = message + ' Simulating traffic.'
    pipelineTimer = setInterval(tick, 350)
  }
}

byId('run-pipeline').addEventListener('click', () => runPipeline('Traffic run.'))
addConsumer.addEventListener('click', () => {
  consumers++
  runPipeline('Consumer added.')
})
failConsumer.addEventListener('click', () => {
  offline++
  runPipeline('Consumer is offline.')
})
recoverConsumer.addEventListener('click', () => {
  offline--
  runPipeline('Consumer recovered.')
})
byId('reset-pipeline').addEventListener('click', () => {
  clearInterval(pipelineTimer)
  consumers = 1
  offline = 0
  queue = 0
  renderPipeline()
  pipelineStatus.textContent = 'Simulation reset.'
})

const loadRepositories = byId('load-repositories')
const githubProfile = byId('github-profile')
const repositoryStatus = byId('repository-status')
const repositoryList = byId('repository-list')
const githubAccount = new URL(githubProfile.href).pathname.split('/')[1]
loadRepositories.hidden = false

loadRepositories.addEventListener('click', async () => {
  loadRepositories.disabled = true
  repositoryStatus.textContent = 'Loading public repositories...'
  try {
    const url = 'https://api.github.com/users/' + encodeURIComponent(githubAccount) + '/repos?sort=pushed&per_page=30'
    const response = await fetch(url, { credentials: 'omit', signal: AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error('GitHub request failed')
    const data = await response.json()
    if (!Array.isArray(data)) throw new Error('Unexpected GitHub response')
    const repositories = data.filter((repo) => !repo.fork && !repo.archived && typeof repo.name === 'string').slice(0, 6)
    const items = repositories.map((repo) => {
      const item = document.createElement('li')
      item.className = 'panel'
      const heading = document.createElement('h3')
      const link = document.createElement('a')
      link.href = githubProfile.href.replace(/\/$/, '') + '/' + encodeURIComponent(repo.name)
      link.textContent = repo.name
      heading.append(link)
      const description = document.createElement('p')
      description.textContent = repo.description || 'No description provided.'
      const metadata = document.createElement('p')
      metadata.className = 'project-stack'
      metadata.textContent = [repo.language, repo.stargazers_count + ' stars'].filter(Boolean).join(' / ')
      item.append(heading, description, metadata)
      return item
    })
    repositoryList.replaceChildren(...items)
    repositoryStatus.textContent = items.length ? items.length + ' repositories loaded.' : 'No eligible public repositories were returned.'
  } catch {
    repositoryStatus.textContent = 'Could not load public repositories. Try again or open the GitHub profile.'
  } finally {
    loadRepositories.disabled = false
  }
})
