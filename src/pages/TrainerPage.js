// TrainerPage.js

import React from 'react';
import { Layout, Divider } from 'antd';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

// Importing components
import WeeklyQuest from '../components/TrainerPageBoxes/QuestsSection';
import HeaderSection from '../components/TrainerPageBoxes/HeaderSection';
import UserStatisticsCard from '../components/TrainerPageBoxes/UserStatistics';
import PracticeBox from '../components/TrainerPageBoxes/PracticeSection';
import ModulesBoxComponent from '../components/TrainerPageBoxes/ModulesBox';
import ProfileSectionComponent from '../components/TrainerPageBoxes/ProfileSection';
import OverviewBox from '../components/TrainerPageBoxes/OverviewBox';
import PetsSection from '../components/TrainerPageBoxes/PetsSection';

const { Content } = Layout;

// Styled Components
const StyledContent = styled(Content)`
  padding: 30px 20px;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
`;

const LeftPanel = styled.div`
  flex: 1;
  padding-right: 20px;
`;

const RightSidebar = styled.div`
  width: 350px;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const RightPanelSubSection = styled.div`
  margin-bottom: 20px;
`;

const TrainerPage = () => {
  const { user } = useAuth(); // Access user data from AuthContext
  const username = user?.username || 'User';

  return (
    <Layout>
      <StyledContent>
        <LeftPanel>
          {/* Header Section */}
          <HeaderSection username={username} />

          {/* User Statistics Box */}
          <UserStatisticsCard />

          {/* Practice Box */}
          <PracticeBox />

          {/* Modules Box */}
          <ModulesBoxComponent />
        </LeftPanel>

        {/* Right Sidebar */}
        <RightSidebar>
          <RightPanelSubSection>
            {/* Profile Section */}
            <ProfileSectionComponent username={username} />
          </RightPanelSubSection>

          <Divider />

          {/* Overview Box */}
          <RightPanelSubSection>
            <OverviewBox />
          </RightPanelSubSection>

          <Divider />

          {/* Quests Section */}
          <WeeklyQuest />

          <Divider />

          {/* Pets Section */}
          <PetsSection />
        </RightSidebar>
      </StyledContent>
    </Layout>
  );
};

export default TrainerPage;
