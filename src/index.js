import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './component/GlobalStyle';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <React.StrictMode>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyle>
                    <App />
                </GlobalStyle>
            </ThemeProvider>
        </React.StrictMode>
    </Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
