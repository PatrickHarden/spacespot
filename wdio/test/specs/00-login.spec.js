/* eslint-disable no-undef */
describe('Login as Tenant', () => {
  it('should do signin', () => {
    browser.url('http://localhost:3000/')
    $('#cookieDialogOK').click()
    $('[data-testid="signin"]').click()
    $('#logonIdentifier').waitForExist({ timeout: 5000 })
    $('#logonIdentifier').click()
    browser.keys('Manuel.taran@yahoo.com')
    $('#password').click()
    browser.keys('CBREManu10')
    $('#next').click()
    $('[data-testid="profile"]').click()
    browser.pause(1000)
    $('[data-testid="logout"]').click()
    $('[data-testid="signin"]').waitForExist({ timeout: 5000 })
    // browser.pause(5000)
  })
})
