
import React, { useState, useEffect } from 'react';

function Time() {
    let [time, setTime] = useState(new Date());

    useEffect(() => {
      let id = setInterval(() => {
        setTime(new Date())
      }, 1000);
      return function cleanup() {
        clearInterval(id)
      }
    })

    return (
      <div>{time.toLocaleTimeString('default', {month: 'long', day: '2-digit'})}</div>
    )
  }

  export default Time
