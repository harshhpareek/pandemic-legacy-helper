import Typography from '@mui/material/Typography'
import * as React from 'react'

interface TLastUpdatedTextProps {
  lastUpdatedByUser: string
  lastUpdatedTimestamp: number
}

export default function LastUpdatedText (props: TLastUpdatedTextProps): JSX.Element {
  return (
  <Typography sx={{ fontStyle: 'italic', m: 1 }} variant="caption" >
    Last updated by: {props.lastUpdatedByUser} at {props.lastUpdatedTimestamp > 0 ? (new Date(props.lastUpdatedTimestamp)).toLocaleString() : ''}
  </Typography>)
}
