import React from 'react'

import OnBoardingLayout from 'components/OnBoardingLayout'
import styled from 'styled-components'

import messagesNo from 'translations/no.json'
import messagesEn from 'translations/en.json'

const Tab = styled.table`
  margin: 20px;
  th {
    text-align: left;
  }
`
const Row = styled.div`
  displat: flex;
`

const Download = styled.button`
  margin: 20px;
`

const ED = styled.td`
  background: red;
`

const Tooling = () => {
  const msgs: any = messagesEn
  const msgsNo: any = messagesNo
  const downloadFile = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob)
    const el = document.createElement('a')
    el.setAttribute('href', objectUrl)
    el.setAttribute('download', fileName)
    el.style.display = 'none'
    document.body.appendChild(el)
    el.click()
    document.body.removeChild(el)
  }
  const download = () => {
    const data = ['Key,English,Norwegian\n']
    Object.keys(msgs).forEach(i => {
      const trans = msgsNo[i] || 'UNTRANSLATED'
      data.push(`${i},"${msgs[i]}","${trans}"\n`)
    })
    const blob = new Blob(data, { type: 'text/csv' })
    downloadFile(blob, 'SSTranslations.csv')
  }
  const downloadChanges = () => {
    const data = ['Key,English,Norwegian\n']
    Object.keys(msgs).forEach(i => {
      const trans = msgsNo[i] || 'UNTRANSLATED'
      if (trans.includes('UNTRANSLATED')) {
        data.push(`${i},"${msgs[i]}","${trans}"\n`)
      }
    })
    const blob = new Blob(data, { type: 'text/csv' })
    downloadFile(blob, 'SSChanges.csv')
  }
  return (
    <OnBoardingLayout>
      <div>
        <Row>
          <Download onClick={download}>Download CSV</Download>
          <Download onClick={downloadChanges}>Download changes</Download>
        </Row>
        <Tab>
          <thead>
            <tr>
              <th>Key</th>
              <th>English</th>
              <th>Norwegian</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(msgs).map(i => {
              return (
                <tr key={i}>
                  <td>{i}</td>
                  <td>{msgs[i]}</td>
                  {msgsNo[i] ? <td>{msgsNo[i]}</td> : <ED></ED>}
                </tr>
              )
            })}
          </tbody>
        </Tab>
      </div>
    </OnBoardingLayout>
  )
}
export default Tooling
