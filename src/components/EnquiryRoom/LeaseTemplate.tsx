import React from 'react'
import styled from 'styled-components'
import { useIntl } from 'react-intl'
import { useSelector, useDispatch } from 'react-redux'

import userSelectors from 'services/user/selectors'
import actions from 'services/enquiry/actions'
import selectors from 'services/enquiry/selectors'

import FileUpload from 'components/EnquiryRoom/FileUpload'
import upload from 'assets/icons/upload.svg'
import { FileItem } from 'services/global/types'
import { DOC_TYPE_TEMPLATE } from 'services/enquiry'

const TemplateBlock = styled.div`
  margin-bottom: 20px;
`

const UploadButton = styled.button`
  display: flex;
  border: none;
  cursor: pointer;
  background: white;
  color: #404042;
  font-size: 14px;
  font-weight: 550;
  line-height: 18px;
  img {
    margin-right: 8px;
  }
`

const DownloadButton = styled.button`
  border: none;
  padding: 0;
  cursor: pointer;
  background: white;
  color: #6cb9d5;
  font-weight: 500;
  font-size: 15px;
`
const ProvisionUploadFormat = styled.span`
  font-weight: normal;
  margin-left: 10px;
`
const LeaseTemplate = (props: {
  className?: string
  disabled: boolean
  flex: boolean
}) => {
  const { className, disabled, flex } = props
  const { formatMessage } = useIntl()
  const t = (s: string) => formatMessage({ id: s })
  const dispatch = useDispatch()
  const isLandlord = useSelector(userSelectors.isLandlord)
  const showUpload = isLandlord && !disabled
  const leaseTemplate = useSelector(selectors.getLeaseTemplate)
  const fileName = leaseTemplate
    ? leaseTemplate.fileName
    : flex
    ? ''
    : t('SPECIAL_PROV_TEMPLATE_STANDARD')

  const addDoc = (file: File, reader: FileReader) => (): void => {
    const item: FileItem = {
      key: 0,
      uri: reader.result as string,
      name: file.name,
      type: file.type,
    }
    dispatch(actions.putDocType(item, DOC_TYPE_TEMPLATE))
  }

  const getDoc = () => {
    if (leaseTemplate) {
      dispatch(actions.getDoc(leaseTemplate))
    } else {
      dispatch(actions.getStdTemplate())
    }
  }

  return (
    <TemplateBlock className={className}>
      <p>
        <span>{`${t('SPECIAL_PROV_TEMPLATE_MSG')}: `}</span>
        { fileName &&  
          <DownloadButton data-testid="download" onClick={getDoc}>
            {fileName}
          </DownloadButton>
        }
        { !fileName && 
          <span>{`${t('SPECIAL_PROV_TEMPLATE_MSG_NO_FILE')}`}</span>
        }
      </p>
      {showUpload && (
        <FileUpload accept="application/pdf" addFile={addDoc}>
          <UploadButton data-testid="upload">
            <img src={upload} alt="upload" />
            {flex
              ? t('SPECIAL_PROV_TEMPLATE_UPLOAD_FLEX')
              : t('SPECIAL_PROV_TEMPLATE_UPLOAD')}{' '}
            <ProvisionUploadFormat>
              {t('SPECIAL_PROVISION_UPLOAD_FORMAT')}
            </ProvisionUploadFormat>
          </UploadButton>
        </FileUpload>
      )}
    </TemplateBlock>
  )
}

export default LeaseTemplate
