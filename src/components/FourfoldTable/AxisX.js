import React from 'react'

const AxisX = ({
  axisWidth = 600,
  axisLabel1 = '11111',
  axisLabel1a = '1aaaaaaa',
  axisLabel1b = '1bbbbbbbb',
  originalWidth
}) => {
  const cellStyle = { fontSize: 14, color: 'grey', fontWeight: 500, height: 30, whiteSpace: 'nowrap' }
  return (
    <>
      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, background: 'rgb(224 222 222)' }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'left' }}>
              <div style={{ width: originalWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{axisLabel1a}</div>
            </td>
            <td style={{ ...cellStyle, textAlign: 'right' }}>
              <div style={{ width: originalWidth / 2, overflow: 'hidden', textOverflow: 'ellipsis' }}>{axisLabel1b}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table cellPadding='0' cellSpacing='0' align='center' style={{ width: axisWidth, margin: 0, background: 'rgb(224 222 222)' }}>
        <tbody>
          <tr>
            <td style={{ ...cellStyle, textAlign: 'center' }}>
              <div style={{ width: originalWidth, overflow: 'hidden', textOverflow: 'ellipsis' }}>{axisLabel1}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
export default AxisX