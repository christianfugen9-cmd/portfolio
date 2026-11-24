try {
  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.documentElement.dataset.theme = 'light'
    document.querySelector('meta[name="theme-color"]').content = '#F7F9F6'
  }
} catch {}
