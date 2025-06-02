import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import {ThemeProvider} from "./context/ThemeContext";
import {AppWrapper} from "./components/common/PageMeta";
import {AllCommunityModule, ModuleRegistry} from 'ag-grid-community';
import {AuthProvider} from "./context/AuthContext";
import {NotificationProvider} from "./context/NotificationContext";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <AppWrapper>
            <NotificationProvider>
                <ThemeProvider>
                    <AuthProvider>
                            <App/>
                    </AuthProvider>
                </ThemeProvider>
            </NotificationProvider>
        </AppWrapper>
    </React.StrictMode>
);

reportWebVitals();
