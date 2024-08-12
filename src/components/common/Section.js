import styled from 'styled-components';

const Section = styled.section`
  padding: 60px 0;
  background-color: ${props => props.background || props.theme.colors.background.light};
`;

export default Section;