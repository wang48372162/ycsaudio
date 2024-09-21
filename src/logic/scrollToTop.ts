export function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  } else {
    onMounted(() => {
      window.scrollTo(0, 0)
    })
  }
}
