import './App.css';
import Desktop from './components/os/Desktop';
import { SiteConfigProvider } from './api';
import ExperienceModal from './components/general/ExperienceModal';

function App() {
    return (
        <SiteConfigProvider>
            <div className="App">
                <Desktop />
                <ExperienceModal />
            </div>
        </SiteConfigProvider>
    );
}

export default App;
