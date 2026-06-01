import './App.css';
import Desktop from './components/os/Desktop';
import { SiteConfigProvider } from './api';
import ExperienceModal from './components/general/ExperienceModal';
import MobileLayout from './components/mobile/MobileLayout';
import useIsMobile from './hooks/useIsMobile';
import { LanguageProvider } from './contexts/LanguageContext';

function App() {
    const isMobile = useIsMobile();

    return (
        <LanguageProvider>
            <SiteConfigProvider>
                <div className="App">
                    {isMobile ? (
                        <MobileLayout />
                    ) : (
                        <>
                            <Desktop />
                            <ExperienceModal />
                        </>
                    )}
                </div>
            </SiteConfigProvider>
        </LanguageProvider>
    );
}

export default App;
