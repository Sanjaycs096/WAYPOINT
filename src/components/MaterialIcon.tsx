import React from 'react';

interface MaterialIconProps {
  name: string;
  className?: string;
  size?: number | string;
  ariaLabel?: string;
}

/**
 * Google Material Symbols Outlined helper component.
 * Exclusively uses Google Material Symbols as specified in design requirements.
 */
export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  size,
  ariaLabel,
}) => {
  const inlineStyle: React.CSSProperties = size
    ? { fontSize: typeof size === 'number' ? `${size}px` : size }
    : {};

  if (ariaLabel) {
    return (
      <span
        className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`}
        style={inlineStyle}
        role="img"
        aria-label={ariaLabel}
      >
        {name}
      </span>
    );
  }

  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center ${className}`}
      style={inlineStyle}
      aria-hidden="true"
    >
      {name}
    </span>
  );
};
