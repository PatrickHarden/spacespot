import React from 'react'

const Generic = ({ fields, rendering, ...props }: any) => {
  console.log('Generic:', props)
  console.log('Rendering:', rendering)
  return (
    <div>
      <h2>{rendering.componentName}</h2>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {fields &&
            Object.keys(fields).map(i => (
              <tr key={i}>
                <td>{i}</td>
                <td>
                  {fields[i] && fields[i].value && fields[i].value.toString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default Generic
