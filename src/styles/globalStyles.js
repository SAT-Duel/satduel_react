import {createGlobalStyle} from 'styled-components';

const GlobalStyles = createGlobalStyle`
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: ${props => props.theme.colors.text.dark};
        background-color: ${props => props.theme.colors.background.light};
    }

    h1, h2, h3, h4, h5, h6 {
        margin-top: 0;
    }

    /* Keep links underline-free globally; colors are set per-component so
       Tailwind utility classes (which live in a cascade layer) aren't
       overridden by this unlayered rule. */
    a {
        text-decoration: none;
    }
`;

export default GlobalStyles;
