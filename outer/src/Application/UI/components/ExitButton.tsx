import React, { useState } from 'react';

interface ExitButtonProps {}

/**
 * Leaves the 3D "enhanced experience" and returns to the fast site.
 *
 * Sits in the InfoOverlay's control cluster (next to the mute and
 * free-cam toggles), so it is reachable whenever the camera is pulled
 * back from the monitor. When the visitor is zoomed into the monitor
 * instead, the desktop OS's own ExperienceToggle provides the way out.
 */
const ExitButton: React.FC<ExitButtonProps> = ({}) => {
    const [isHovering, setIsHovering] = useState(false);

    const onExit = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/';
    };

    return (
        <div
            style={Object.assign(
                {},
                styles.container,
                isHovering && styles.containerHover
            )}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseDown={onExit}
            className="icon-control-container"
            id="prevent-click"
        >
            <p style={isHovering ? styles.textHover : styles.text}>
                {'‹  EXIT 3D MODE'}
            </p>
        </div>
    );
};

const styles: StyleSheetCSS = {
    container: {
        background: 'black',
        padding: 4,
        paddingLeft: 12,
        paddingRight: 12,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        cursor: 'pointer',
    },
    containerHover: {
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
