import React from 'react';

interface ExitButtonProps {}

/**
 * Leaves the 3D "enhanced experience" and returns to the fast site.
 *
 * Rendered by InterfaceUI in the top-left corner — visible as soon as the
 * scene loads, hidden only once the camera is inside the monitor (where the
 * embedded desktop OS handles the exit). All styling lives in the
 * .exit-3d-button class (UI/style.css): a fixed width keeps the box from
 * collapsing around the label, and a media query scales it on small
 * screens the way the rest of the HUD does.
 */
const ExitButton: React.FC<ExitButtonProps> = ({}) => {
    const onExit = (e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = '/';
    };

    return (
        <div className="exit-3d-button" id="prevent-click" onClick={onExit}>
            {'‹ EXIT 3D MODE'}
        </div>
    );
};

export default ExitButton;
