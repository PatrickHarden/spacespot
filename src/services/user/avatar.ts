const hashCode = (s: string) => {
  if (!s) return 0
  let hash = 0
  for (let i = 0; i < s.length; i++) {
    const chr = s.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}

const initials = ['GK', 'IH', 'EM', 'MT', 'PT', 'PN', 'EJ']

export const getUserInitials = (id: string, name: string) => {
  if (name) {
    const names = name.split(' ')
    let initials = names[0].charAt(0).toUpperCase()
    if (names.length > 1) {
      initials = initials + names[1].charAt(0).toUpperCase()
    }
    return initials
  }
  const ix = Math.abs(hashCode(id) % 7)
  return initials[ix]
}
