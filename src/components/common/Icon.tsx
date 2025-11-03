import type { IconName } from "@utils/icons";
import { icons } from "@utils/icons";
import type React from "react";

export type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "", strokeWidth = 2, ...rest }) => {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        verticalAlign: "middle",
      }}
      viewBox={icon.viewBox ?? "0 0 24 24"}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {icon.nodes.map((node, i) => {
        const key = `${name}-node-${i}`;
        switch (node.type) {
          case "path":
            return <path key={key} {...(node.props as React.SVGProps<SVGPathElement>)} />;
          case "line":
            return <line key={key} {...(node.props as React.SVGProps<SVGLineElement>)} />;
          case "circle":
            return <circle key={key} {...(node.props as React.SVGProps<SVGCircleElement>)} />;
          case "rect":
            return <rect key={key} {...(node.props as React.SVGProps<SVGRectElement>)} />;
          case "polyline":
            return <polyline key={key} {...(node.props as React.SVGProps<SVGPolylineElement>)} />;
          default:
            return null;
        }
      })}
    </svg>
  );
};

export default Icon;
