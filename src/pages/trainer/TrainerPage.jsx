// TrainerPage.js
import React from 'react';
import {Layout, Divider} from 'antd';
import styled from 'styled-components';
import {useAuth} from '../../context/AuthContext';

import HeaderSection from '../../components/TrainerPageBoxes/HeaderSection';
import UserStatisticsCard from '../../components/TrainerPageBoxes/UserStatistics';
import PracticeBox from '../../components/TrainerPageBoxes/PracticeSection';
import ProfileSectionComponent from '../../components/TrainerPageBoxes/ProfileSection';
import OverviewBox from '../../components/TrainerPageBoxes/OverviewBox';
import PetsSection from '../../components/TrainerPageBoxes/PetsSection';
import withAuth from "../../hoc/withAuth";
import QuestsSection from '../../components/TrainerPageBoxes/QuestsSection';

const {Content} = Layout;

// Styled Components
const StyledContent = styled(Content)`
    padding: 24px 16px;
    max-width: 1600px;
    margin: 0 auto;
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
    
    @media (min-width: 768px) {
        grid-template-columns: 1fr 340px;
        padding: 32px 24px;
        gap: 24px;
    }

    @media (min-width: 1200px) {
        grid-template-columns: 1fr 400px;
    }
`;

const MainContent = styled.div`
    display: grid;
    gap: 20px;
    grid-template-rows: auto auto auto;

    @media (min-width: 768px) {
        gap: 24px;
    }
`;

const StatsGrid = styled.div`
    display: grid;
    gap: 16px;
    grid-template-columns: 1fr;
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    @media (min-width: 480px) {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        padding: 24px;
        gap: 24px;
    }
`;

const RightSidebar = styled.div`
    display: grid;
    gap: 20px;
    align-content: start;
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    height: fit-content;

    @media (min-width: 768px) {
        position: sticky;
        top: 24px;
        padding: 24px;
        gap: 24px;
    }
`;

const SectionCard = styled.div`
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    @media (min-width: 768px) {
        padding: 24px;
    }
`;

const TrainerPage = () => {
    const {user} = useAuth(); // Access user data from AuthContext
    const username = user?.username || 'User';

    return (
        <Layout>
            <StyledContent>
                <MainContent>
                    {/* Header Section */}
                    <HeaderSection username={username}/>
                    
                    <StatsGrid>
                        <UserStatisticsCard/>
                        <PracticeBox/>
                    </StatsGrid>

                    {/* Bottom Sections */}
                    <SectionCard>
                        <PetsSection/>
                    </SectionCard>
                </MainContent>

                {/* Right Sidebar */}
                <RightSidebar>
                    <ProfileSectionComponent username={username}/>
                    <Divider style={{margin: '16px 0'}}/>
                    <OverviewBox/>
                    <Divider style={{margin: '16px 0'}}/>
                    <QuestsSection/>
                </RightSidebar>
            </StyledContent>
        </Layout>
    );
};

export default withAuth(TrainerPage);
