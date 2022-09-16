import * as React from 'react'

interface TLastUpdatedTextProps {
  lastUpdatedByUser: string
  lastUpdatedTimestamp: number
}

export default function LastUpdatedText (props: TLastUpdatedTextProps): JSX.Element {
  return <p><small><i>
        Last updated by: {props.lastUpdatedByUser} at {props.lastUpdatedTimestamp > 0 ? (new Date(props.lastUpdatedTimestamp)).toLocaleString() : ''}
    </i></small></p>
}
