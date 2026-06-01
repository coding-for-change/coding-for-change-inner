import React from 'react';
import ImprintContent from '../showcase/ImprintContent';

const ImprintPage: React.FC = () => {
    return (
        <div className="site-page-content" style={styles.container}>
            <ImprintContent />
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        flexDirection: 'column',
    },
};

export default ImprintPage;
