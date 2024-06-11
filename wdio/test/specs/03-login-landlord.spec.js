/* eslint-disable no-undef */
describe('Login as Landlord', () => {
  it('should do signin', () => {
    browser.url('http://localhost:3000/')
    $('#cookieDialogOK').click()
    $('[data-testid="signin"]').click()
    $('#logonIdentifier').waitForExist({ timeout: 5000 })
    $('#logonIdentifier').click()
    browser.keys('Manuel.tar@yahoo.com')
    $('#password').click()
    browser.keys('CBREMan10')
    $('#next').click()
    $('[data-testid="profile"]').waitForExist({ timeout: 5000 })
  })
  it('should go to dashboard', () => {
    $('[data-testid="dashboard"]').click()
  })
})
