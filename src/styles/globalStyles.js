import {createGlobalStyle} from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: ${props => props.theme.colors.text.dark};
        background-color: ${props => props.theme.colors.background.light};
    }

    h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
    }

    a {
        text-decoration: none;
        color: ${props => props.theme.colors.primary};
    }
`;

export default GlobalStyles;