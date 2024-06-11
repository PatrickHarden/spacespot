import React from 'react'
import styled from 'styled-components'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import DOMPurify from 'dompurify'

const InputContainer = styled.div`
  margin: 20px 0 0 0;
  label {
    display: block;
    padding-left: 6px;
    padding-bottom: 2px;
    color: #404042;
    font-size: 16px;
    font-weight: 400;
  }
`

//  border: 1px solid ${props => (props.error ? '#db4437' : '#dddddd')};
//  border-radius: 3px;
// padding: 6px 6px;

const Quill = styled(ReactQuill)<{ error?: string; height: number }>`
  margin-top: 0;
  margin-bottom: 6px;
  resize: none;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: ${props => (props.error ? '#db4437' : '#010102')};
  letter-spacing: -0.2px;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  :focus {
    outline: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
    border: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
  }
  .ql-toolbar.ql-snow {
    border: 1px solid ${props => (props.error ? '#db4437' : '#dddddd')};
    border-radius: 3px 3px 0 0;
    font-family: 'futura-pt';
    font-size: 16px;
  }
  .ql-container.ql-snow {
    border: 1px solid ${props => (props.error ? '#db4437' : '#dddddd')};
    border-radius: 0 0 3px 3px;
    border-top: 0;
    font-family: 'futura-pt';
    font-size: 16px;
  }
  .ql-editor {
    min-height: ${props => props.height}px;
    background: white;
  }
`
const ErrorMessage = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #db4437;
`
const STextArea = styled.textarea<{ error?: string }>`
  resize: none;
  width: 100%;
  margin-top: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 21px;
  color: ${props => (props.error ? '#db4437' : '#010102')};
  letter-spacing: -0.2px;
  width: 100%;
  box-sizing: border-box;
  padding: 6px 6px;
  outline: none;
  border: ${props => (props.error ? '1px solid #db4437' : 'none')};
  overflow: auto;
  border-radius: 3px;
  :focus {
    outline: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
    border: 1px solid ${props => (props.error ? '#db4437' : '#4fbbd8')};
  }
`

const formats = ['bold', 'italic', 'list']

const modules = {
  toolbar: [
    ['bold', 'italic'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
}

const isIE = () => {
  const ua = window.navigator.userAgent
  const msie = ua.indexOf('MSIE ') > -1
  const msie11 = ua.indexOf('Trident/') > -1
  return msie || msie11
}

const RichTextArea = (props: {
  className?: string
  label?: string
  id?: string
  rows?: number
  value: any
  error?: string
  placeholder?: string
  onChange?: (content: string) => void
}) => {
  const { className, label } = props
  const ie11onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onChange) {
      const clean = DOMPurify.sanitize(e.target.value)
      props.onChange(clean)
    }
  }
  return (
    <InputContainer className={className}>
      {label && <label htmlFor={props.id}>{label}</label>}
      {isIE() ? (
        <STextArea
          id={props.id}
          value={props.value || ''}
          placeholder={props.placeholder}
          onChange={ie11onChange}
          rows={props.rows}
          error={props.error}
        />
      ) : (
        <Quill
          id={props.id}
          value={props.value || ''}
          error={props.error}
          placeholder={props.placeholder}
          onChange={props.onChange}
          height={props.rows ? 24 + props.rows * 22 : 46}
          formats={formats}
          modules={modules}
        />
      )}
      <ErrorMessage>{props.error}</ErrorMessage>
    </InputContainer>
  )
}

export default RichTextArea
