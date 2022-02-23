import React from 'react';

type PlateProps = {
    size: number
}

const Plate = (props: PlateProps) => {
    return <svg style={{
            overflow: 'visible',
            width: props.size,
            height: props.size
        }} viewBox="0 0 100 100" width="100" height="100">
        <circle cx='50' cy='50' r='50' stroke='#ec294c' stroke-width='5' fill='none'/>
        <circle cx='50' cy='50' r='32' stroke='#da294c' fill='none' stroke-width='32'/>
        <circle cx='50' cy='50' r='12' stroke='#f33254' stroke-width='10' fill='none'/>
        <circle cx='50' cy='50' r='8' stroke='#ec294c' stroke-width='3' fill='none'/>
        {/* <text y='27' x='50' fill='white' font-size='12' text-anchor='middle' font-weight='700'>ONISTRONG</text> */}
        <text fill='white' x='18' y='50' font-size='18' font-weight='700' text-anchor='middle'>25</text>
        <text fill='white' font-size='10' x='18' y='61' text-anchor='middle'>KG</text>
        <g transform='rotate(180)' transform-origin='50% 50%'>
            <text fill='white' x='18' y='50' font-size='18' font-weight='700' text-anchor='middle'>25</text>
            <text fill='white' fontSize='10' x='18' y='61' text-anchor='middle'>KG</text>
            {/* <text y='27' x='50' fill='white' font-size='12' text-anchor='middle' font-weight='700'>ONISTRONG</text> */}
        </g>
    </svg>;
}

export default Plate;