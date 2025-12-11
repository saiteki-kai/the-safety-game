import React from "react";
import type { HTMLAttributes } from "react";
import type { IconName } from "@/lib/icons";
import Icon from "./Icon";

export type IconLabelProps = HTMLAttributes<HTMLElement> & {
  // String name for the internal Icon mapping (backwards compatible)
  name?: IconName;
  // React node or component (e.g., lucide-react icons) to render directly
  icon?: React.ReactNode | React.ElementType;
  size?: number;
  iconClass?: string;
  as?: React.ElementType;
  position?: "start" | "end";
  strokeWidth?: number;
};

export const IconLabel: React.FC<IconLabelProps> = ({
  name,
  icon,
  size = 20,
  iconClass = "",
  className = "",
  as = "span",
  position = "start",
  strokeWidth = 2,
  children,
  ...rest
}) => {
  const Tag = as as React.ElementType;

  const renderIcon = () => {
    // If an icon React element or component is provided, render it.
    if (icon) {
      // If it's a valid React element (e.g., <LayoutDashboard />), clone with classes
      if (React.isValidElement(icon)) {
        const iconElement = icon as React.ReactElement<any>;
        return React.cloneElement(iconElement, {
          className: [iconClass, "shrink-0", (iconElement.props?.className ?? "")].filter(Boolean).join(" "),
          size: iconElement.props?.size ?? size,
          strokeWidth: iconElement.props?.strokeWidth ?? strokeWidth,
        });
      }

      if (typeof icon === "function" || typeof icon === "object") {
        const IconComp = icon as React.ElementType;
        return <IconComp size={size} className={[iconClass, "shrink-0"].filter(Boolean).join(" ")} strokeWidth={strokeWidth} />;
      }
    }

    // Fallback to named Icon mapping
    if (name) {
      return (
        <Icon
          name={name}
          size={size}
          className={[iconClass, "shrink-0"].filter(Boolean).join(" ")}
          strokeWidth={strokeWidth}
        />
      );
    }

    return null;
  };

  return (
    <Tag className={["inline-flex items-center gap-2", className].filter(Boolean).join(" ")} {...rest}>
      {position === "start" ? (
        <>
          {renderIcon()}
          {children}
        </>
      ) : (
        <>
          {children}
          {renderIcon()}
        </>
      )}
    </Tag>
  );
};

export default IconLabel;
