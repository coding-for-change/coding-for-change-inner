import React, { useState } from 'react';

interface ExitButtonProps {}

/**
 * Leaves the 3D "enhanced experience" and returns to the fast site.
 *
 * Rendered by InterfaceUI in the top-left corner — visible as soon as the
 * scene loads, hidden only once the camera is inside the monitor (where the
 * embedded desktop OS handles the exit). Mirrors the InfoOverlay's boxes: a
 * content-sized black box around a <p>, so it picks up the same responsive
 * font-size and scales with the screen.
 */
const ExitButton: React.FC<ExitButtonProps> = ({}) => {
    const [hover, setHover] = useState(false);

    const onExit = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/';
    };

    return (
        <div
            style={Object.assign({}, styles.box, hover && styles.boxHover)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onExit}
            className="icon-control-container"
            id="prevent-click"
        >
            <p style={hover ? styles.textHover : styles.text}>
                {'‹ EXIT 3D MODE'}
            </p>
        </div>
    );
};

const styles: StyleSheetCSS = {
    box: {
        background: 'black',
        display: 'flex',
        padding: 4,
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    boxHover: {
        background: 'white',
    },
    text: {
        color: 'white',
    },
    textHover: {
        color: 'black',
    },
};

export default ExitButton;
