import MoreVertIcon from '@mui/icons-material/MoreVert'
import IndeterminateCheckBoxOutlinedIcon from '@mui/icons-material/IndeterminateCheckBoxOutlined'
import * as React from 'react'
import { playerCardIcon } from '../types'

export function Glossary (): JSX.Element {
  return (<>
    <ul>
      <li> <MoreVertIcon />: End of a pile in the Player deck </li>
      <li>
        <IndeterminateCheckBoxOutlinedIcon />: Not entered yet
      </li>
      <li>{playerCardIcon('Epidemic')}: Epidemic</li>
      <li>{playerCardIcon('Black')}: Black city player card</li>
      <li>{playerCardIcon('Yellow')}: Yellow city player card</li>
      <li>{playerCardIcon('Blue')}: Blue city player card</li>
      <li>{playerCardIcon('Red')}: Red city player card</li>
      <li>{playerCardIcon('Funded')}: Funded event</li>
    </ul></>)
}
