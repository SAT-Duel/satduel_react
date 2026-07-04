import React from 'react';
import { Tabs } from 'antd';
import Pets from '../Inventory_pets';
import Storage from '../Inventory_storage';

const { TabPane } = Tabs;

function Inventory() {
    return (
        <Tabs defaultActiveKey="1" type="card" animated={true}>
            <TabPane tab="Pets" key="1">
                <Pets />
            </TabPane>
            <TabPane tab="Storage" key="2">
                <Storage />
            </TabPane>
        </Tabs>
    );
}

export default Inventory;