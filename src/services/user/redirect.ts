// redirect

export const pushPage = (uri: string) => {
  if (uri !== '/') {
    localStorage.setItem('redirect-uri', uri)
  }
}

export const popPage = () => {
  const uri = localStorage.getItem('redirect-uri')
  if (uri) {
    localStorage.removeItem('redirect-uri')
  }
  return uri
}
