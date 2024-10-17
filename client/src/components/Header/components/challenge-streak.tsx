import { faFire } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';

import './challenge-streak.css';

const ChallengeStreak = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='streak-container'>
      <FontAwesomeIcon
        icon={faFire}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      />

      {isOpen && (
        <>
          <div className='triangle'> </div>
          <div className='streak-container-inner'>
            <strong>Complete challenges everyday to build up a streak!</strong>
            <table>
              <tr>
                <td>Current Streak</td>
                <td>12</td>
              </tr>
              <tr>
                <td>Total Completed</td>
                <td>209</td>
              </tr>
              <tr>
                <td>Longest Streak</td>
                <td>21</td>
              </tr>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

ChallengeStreak.displayName = 'ChallengeStreak';
export default ChallengeStreak;
