import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/layout';
import { ThemeProvider } from 'styled-components';
import themeScheme from './theme/schema';
import GlobalStyle from './App.style';
import { useTheme } from './hooks/useTheme';
// Pages
import { Home } from './pages/pageSrc';

const App: React.FC = () => {
    const [currentTheme, toggleTheme] = useTheme();

    const getTheme = (selected: string) => {
        return selected === 'light' ? themeScheme.light : themeScheme.dark;
    };

    return (
        <ThemeProvider theme={getTheme(currentTheme)}>
            <GlobalStyle />
            <Layout toggleTheme={toggleTheme}>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Layout>
        </ThemeProvider>
    );
};

export default App;