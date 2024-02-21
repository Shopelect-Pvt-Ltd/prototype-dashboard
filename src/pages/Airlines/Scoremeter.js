import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ScoreMeterRenderer = ({ value }) => {
    // Assuming the score is a percentage between 0 and 100
    const score = parseInt(value);

    return (
        <div style={{ width: '100px' }}>
            <CircularProgressbar
                value={score}
                text={`${score}%`}
                strokeWidth={8}
                styles={buildStyles({
                    textSize: '16px',
                    textColor: '#3e98c7',
                    pathColor: `rgba(62, 152, 199, ${score / 100})`,
                    trailColor: '#d6d6d6',
                })}
            />
        </div>
    );
};

export default ScoreMeterRenderer;
