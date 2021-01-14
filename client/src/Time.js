
import React, { useState, useEffect } from 'react';

function Time() {
    let [time, setTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
      let id = setInterval(() => {
        setTime(new Date().toLocaleTimeString())
      }, 1000);
      return function cleanup() {
        clearInterval(id)
      }
    })

    return (
      <div>{time}</div>
    )
  }

  export default Time
