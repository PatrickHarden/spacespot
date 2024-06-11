import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import styled from 'styled-components'

import Dropdown, { Option } from 'components/common/Dropdown'

import actions from 'services/user/actions'
import device from 'services/global/device'

import uk from 'assets/icons/uk.svg'
import norway from 'assets/icons/norway.svg'
import finland from 'assets/icons/finland.svg'
import germany from 'assets/icons/germany.svg'
import spain from 'assets/icons/spain.svg'
import { getLang, getLocaleFromLangCode } from 'intl'

const Container = styled.div`
  margin: 0px;
`

const SDropdown = styled(Dropdown)`
  .MuiInputBase-root.MuiInput-root {
    background-color: transparent;
    color: white;
    min-width: 150px;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      border: solid #fff !important;
      border-width: 0 2px 2px 0 !important;
      display: inline-block;
      padding: 4px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      left: inherit;
      bottom: 12px;
      right: 10px;
    }

    @media ${device.mobile} {
      width: inherit;
      min-width: 40px;

      &:after {
        right: -1px;
        padding: 3px;
      }
    }
  }
  .MuiSelect-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInput-input {
    border: none;
    padding: 4px 6px
  }
  .MuiSelect-select:focus {
    outline: none;
    border: none;
  }
  .MuiSvgIcon-root.MuiSelect-icon {
    display: none;
  }
  .MuiSelect-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInput-input:not([aria-expanded="true"])>div img+div{
   max-width: 90px;
   text-overflow: ellipsis;
   white-space: nowrap;
   overflow: hidden;
   line-height: 22px;
  }

  .MuiSelect-select.MuiSelect-selectMenu.MuiInputBase-input.MuiInput-input>div img+div{
    @media ${device.mobile} {
      display: none;
    }
  }
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  img {
    width: 20px;
  }
`

const Text = styled.div`
  margin-left: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const LangPicker = () => {
  const dispatch = useDispatch()
  const lang = getLang()
  const [locale, setLocale] = useState<string>(getLocaleFromLangCode(lang))

  useEffect(() => {
    // check the local storage
    if (localStorage.getItem('locale') !== locale) {
      dispatch(actions.changeLocale(locale))
    }
  }, [dispatch, locale])

  const changeLocale = (e: React.ChangeEvent<{ value: unknown }>) => {
    const loc = e.target.value as string
    if (loc && loc !== locale) {
      setLocale(loc)
    }
  }
  return (
    <Container>
      <SDropdown
        id="lang-dd"
        label={''}
        onChange={changeLocale}
        class={'lang-picker'}
        value={locale}>
        <Option value="en" key="en">
          <Row>
            <img src={uk} alt="uk" />
            <Text>English (UK)</Text>
          </Row>
        </Option>
        {window.location.hostname.endsWith('.com') ||
        window.location.hostname.endsWith('.no') ? (
          <Option value="nb-no" key="nb-NO">
            <Row>
              <img src={norway} alt="nb" />
              <Text>Norsk (Norge)</Text>
            </Row>
          </Option>
        ) : null}

        {window.location.hostname.endsWith('.com') ||
        window.location.hostname.endsWith('.fi') ? (
          <Option value="fi-fi" key="fi-FI">
            <Row>
              <img src={finland} alt="fi" />
              <Text>Finland (Finland)</Text>
            </Row>
          </Option>
        ) : null}

        {window.location.hostname.endsWith('.com') ||
        window.location.hostname.endsWith('.de') ? (
          <Option value="de-de" key="de-DE">
            <Row>
              <img src={germany} alt="de" width="21" height="21" />
              <Text>Germany (Germany)</Text>
            </Row>
          </Option>
        ) : null}

        {window.location.hostname.endsWith('.com') ||
        window.location.hostname.endsWith('.es') ? (
          <Option value="es-es" key="es-ES">
            <Row>
              <img src={spain} alt="es" />
              <Text>Spain (Spain)</Text>
            </Row>
          </Option>
        ) : null}
      </SDropdown>
    </Container>
  )
}

export default LangPicker
