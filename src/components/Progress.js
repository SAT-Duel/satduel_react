import React from 'react';

function Progress({ status }) {
    return (
        <div className="progress">
            <p>Status: {status}</p>
        </div>
    );
}

export default Progress;