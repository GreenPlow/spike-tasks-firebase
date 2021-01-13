/* eslint-disable */

import React, { useState, useEffect, useRef } from 'react';

function Time() {
    let [time, setTime] = useState(new Date().toLocaleTimeString());

    useInterval(() => {
      setTime(new Date().toLocaleTimeString());  
    }, 1000);

    return (
      <div>{time}</div>
    )
  }

  export default Time

  function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
          // Need to cleanup memory leak when done
        return () => clearInterval(id);
      }
    }, [delay]);
  }