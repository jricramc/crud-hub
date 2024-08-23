import React, { useRef, useState, useEffect } from "react";

import styles from "./index.module.scss"

const CountdownTimer = ({
    prefix = "", suffix = "",
    style = {},
    duration = 0, updateInterval = 1000,
    width = 80, height = 60
}) => {
    const _1hr_in_milliseconds = 60 * 60 * 1000;
  const [remainingTime, setRemainingTime] = useState(duration);

  const currentTime = useRef({ up: duration, down: duration });
  const prevTime = useRef({ up: null, down: null });
  const isNewTimeFirstTick = useRef({ up: true, down: false });
  const [, setOneLastRerender] = useState(0);

  if (currentTime.current.down - updateInterval >= remainingTime) {
    isNewTimeFirstTick.current.down = true;
    // @ts-ignore
    prevTime.current.down = currentTime.current.down;
    currentTime.current.down = remainingTime;
  } else {
    isNewTimeFirstTick.current.down = false;
  }

  // force one last re-render when the time is over to tirgger the last animation
  if (remainingTime === 0) {
    setTimeout(() => {
      setOneLastRerender((val) => val + 1);
    }, 20);
  }

  const isTimeUp = isNewTimeFirstTick.current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainingTime > 0) {

        const updatedRemainTime = remainingTime - updateInterval;

        if (currentTime.current.up - updateInterval >= updatedRemainTime) {
            isNewTimeFirstTick.current.up = true;
            // @ts-ignore
            prevTime.current.up = currentTime.current.up;
            currentTime.current.up = updatedRemainTime;
          } else {
            isNewTimeFirstTick.current.up = false;
          }

        setRemainingTime(updatedRemainTime);
      }
    }, updateInterval);

    return () => {
      // this runs as the clean up function for the useEffect
      clearInterval(timer);
    };
  }, [remainingTime]);

  return (
    <div
        className={styles['time-wrapper']}
        style={{ width, height }}
    >
        <div
            key={`${currentTime.current.up}-up`}
            className={`${styles['time']} ${isTimeUp.up ? styles['up'] : ''}`}
            style={{...(style || {})}}
        >
            {`${prefix}${((currentTime.current.up - updateInterval) / _1hr_in_milliseconds).toFixed(2)}${suffix}`}
        </div>
        {prevTime.current.up !== null && (
            <div
                key={`${prevTime.current.up}-up`}
                className={`${styles['time']} ${!isTimeUp.up ? styles['down'] : ''}`}
                style={{ visibility: !isTimeUp.down ? 'visible' : 'hidden', ...(style || {})}}
            >
                {`${prefix}${(((prevTime.current.up || 0) - updateInterval) / _1hr_in_milliseconds).toFixed(2)}${suffix}`}
            </div>
        )}

        <div
            key={`${currentTime.current.down}-down`}
            className={`${styles['time']} ${isTimeUp.down ? styles['up'] : ''}`}
            style={{ visibility: (!isTimeUp.down && remainingTime === duration) ? 'visible' : 'hidden', ...(style || {})}}
        >
            {`${prefix}${(currentTime.current.down / _1hr_in_milliseconds).toFixed(2)}${suffix}`}
        </div>
        {prevTime.current.down !== null && (
            <div
                key={`${prevTime.current.down}-down`}
                className={`${styles['time']} ${!isTimeUp.down ? styles['down'] : ''}`}
                style={{...(style || {})}}
            >
                {`${prefix}${((prevTime.current.down || 0) / _1hr_in_milliseconds).toFixed(2)}${suffix}`}
            </div>
        )}
    </div>
  );
}

export default CountdownTimer;