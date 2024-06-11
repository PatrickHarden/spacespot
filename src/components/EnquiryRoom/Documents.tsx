import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import Plus from 'components/icons/Plus'
import { processDate } from 'services/onboarding/utils'
import { FileItem } from 'services/global/types'
import { getFileType } from 'services/global/util'
import { DocumentDTO } from 'services/enquiry/types'
import selectors from 'services/enquiry/selectors'
import actions from 'services/enquiry/actions'
import FileUpload from './FileUpload'
import FilledButton from 'components/common/FilledButton'
import Heading2 from 'components/common/Heading2'
import pdf from 'assets/icons/pdf.svg'
import doc from 'assets/icons/doc.svg'
import generic from 'assets/icons/file.svg'
import trash from 'assets/icons/trash.svg'

const Container = styled.div``
const Header = styled.div`
  padding: 15px 15px 17px 15px;
`

export const DFileUpload = styled(FileUpload)`
  display: inline-block;
  float: right;
`

const Button = styled(FilledButton)`
  color: white;
  min-width: 90px;
`
const Title = styled(Heading2)`
  display: inline-block;
  margin: 0;
`

const TextAdd = styled.span`
  padding-left: 5px;
`
const PlusWithMargin = styled(Plus)`
  margin: -2px;
`
export const TrashImg = styled.img`
  padding: 4px;
  margin-left: 6px;
  cursor: pointer;
`

const PdfImg = styled.img`
  padding-right: 10px;
`
const TextEmpty = styled.div`
  padding: 20px;
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
`
const TableDocuments = styled.div`
  padding: 0;
`
const TableHeader = styled.div`
  width: 100%;
  opacity: 0.98;
  background-color: #f4f4f4;
  display: flex;
  padding: 10px 7px;
  padding-left: 12px;
  box-sizing: border-box;
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
`
const TableRow = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 10px 7px;
  padding-left: 12px;
  color: #6d6c6c;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  border-bottom: 2px solid #f4f4f4;
`
export const Attachment = styled.div`
  display: flex;
  width: 283px;
  flex: 0 0 auto;
  cursor: pointer;
  padding-right: 10px;
`
const AttatchmentText = styled.div`
  padding-top: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const Detail = styled.div`
  width: 40%;
  display: flex;
`
const DetailText = styled.div`
  color: #6d6c6c;
  width: 80%;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  padding-top: 8px;
`
export const ViewAllButton = styled.button`
  border: none;
  color: #6cb9d5;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  margin: 5px 0;
  float: right;
`

const Documents = () => {
  const dispatch = useDispatch()
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const data: Array<DocumentDTO & { isMine: boolean }> = useSelector(
    selectors.getDocs,
  )
  const [maxItems, setMaxItems] = useState(3)
  const items = data && data.slice(0, maxItems)
  const isEmpty = !data || data.length === 0
  const more = items && items.length < data.length
  const addDoc = (file: File, reader: FileReader) => (): void => {
    const item: FileItem = {
      key: 0,
      uri: reader.result as string,
      name: file.name,
      type: file.type,
    }
    dispatch(actions.putDoc(item))
  }
  const getDoc = (doc: DocumentDTO) => () => {
    dispatch(actions.getDoc(doc))
  }
  const delDoc = (id: number) => () => {
    dispatch(actions.deleteDoc(id))
  }
  const showAll = () => {
    setMaxItems(data.length)
  }
  const shorten = (name: string) => {
    return name.length < 24 ? name : name.substring(0, 21) + '...'
  }

  const getFileTypeImg = (fileName: string) => {
    const type = getFileType(fileName)
    let icon = generic
    if (type === 'application/msword') icon = doc
    if (type === 'application/pdf') icon = pdf
    return icon
  }

  return (
    <Container>
      <Header>
        <Title>{t('ENQUIRY_DOCUMENTS_TITLE')}</Title>
        <DFileUpload
          accept="application/pdf,.doc,.docx,.png,.jpg,.gif,.bmp,.txt,.xlsx,.pptx,.mp4,.mov"
          addFile={addDoc}>
          <Button>
            <PlusWithMargin color="white" size="1.1em" />
            <TextAdd>{t('ENQUIRY_DOCUMENTS_ADD')}</TextAdd>
          </Button>
        </DFileUpload>
      </Header>
      {isEmpty ? (
        <TextEmpty>{t('ENQUIRY_DOCUMENTS_EMPTY')}</TextEmpty>
      ) : (
        <TableDocuments>
          <TableHeader>
            <Attachment>{t('ENQUIRY_DOCUMENTS_ATTACHMENT')}</Attachment>
            <Detail>{t('ENQUIRY_DOCUMENTS_DETAIL')}</Detail>
          </TableHeader>
          {items.map((dt: DocumentDTO & { isMine: boolean }) => (
            <TableRow key={dt.fileId}>
              <Attachment onClick={getDoc(dt)}>
                <PdfImg
                  src={getFileTypeImg(dt.fileName)}
                  height="32px"
                  alt="pdf"
                />
                <AttatchmentText>{shorten(dt.fileName)}</AttatchmentText>
              </Attachment>
              <Detail>
                <DetailText>{processDate(dt.uploadAt)}</DetailText>
                {dt.isMine ? (
                  <TrashImg
                    data-testid="delete-document"
                    src={trash}
                    height="25px"
                    alt="trash"
                    onClick={delDoc(dt.fileId)}
                  />
                ) : null}
              </Detail>
            </TableRow>
          ))}
          {more && (
            <ViewAllButton onClick={showAll}>
              {t('VIEW_ALL')} ({data.length})
            </ViewAllButton>
          )}
        </TableDocuments>
      )}
    </Container>
  )
}
export default Documents
