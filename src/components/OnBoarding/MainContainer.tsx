import styled from 'styled-components'

export const Container = styled.div`
  @media (min-width: 1064px) {
    margin: 0 auto;
    padding: 0 20px;
    width: 1024px;
  }
  @media (min-width: 768px) and (max-width: 1063px) {
    margin: 0;
    padding: 0 20px;
  }
  @media (max-width: 767px) {
    margin: 0;
    padding: 0 10px;
  }
`

export default Container
