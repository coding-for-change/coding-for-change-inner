import React from 'react';
import getIconByName, { IconName } from '../../assets/icons';

export interface IconProps {
    style?: React.CSSProperties;
    icon: IconName;
    size?: number;
}

const Icon: React.FC<IconProps> = ({ icon, style, size }) => {
    const iconStyle = Object.assign(
        {},
        styles.icon,
        style,
        size && { width: size, height: size }
    );
    // Next.js returns a StaticImageData object for `import x from '*.png'`
    // (CRA returned a URL string), so read `.src` off it for the <img> tag.
    const iconData = getIconByName(icon) as unknown as { src?: string } | string;
    const iconSrc = typeof iconData === 'string' ? iconData : iconData?.src;
    return <img style={iconStyle} alt={''} src={iconSrc} />;
};

const styles: StyleSheetCSS = {
    icon: {
        imageRendering: 'pixelated',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        msUserSelect: 'none',
        pointerEvents: 'none',
    },
};

export default Icon;
