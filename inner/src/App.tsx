import './App.css';
import Desktop from './components/os/Desktop';
import { SiteConfigProvider } from './api';

function App() {
    return (
        <SiteConfigProvider>
            <div className="App">
                <Desktop />
            </div>
        </SiteConfigProvider>
    );
}

export default App;
