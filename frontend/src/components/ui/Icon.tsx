import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className, style, ...props }) => {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={style}
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
