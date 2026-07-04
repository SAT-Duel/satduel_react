import React from 'react';
import {ConfigProvider} from 'antd';

function Config() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    // Seed Token
                    colorPrimary: '#00b96b',

                },
            }}
        />
    );
}

export default Config;
