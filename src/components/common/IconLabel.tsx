import type { IconName } from "@utils/icons";
import type React from "react";
import type { HTMLAttributes } from "react";
import Icon from "./Icon";

export type IconLabelProps = HTMLAttributes<HTMLElement> & {
  name: IconName;
  size?: number;
  iconClass?: string;
  as?: React.ElementType;
  position?: "start" | "end";
  strokeWidth?: number;
};

export const IconLabel: React.FC<IconLabelProps> = ({
  name,
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

  return (
    <Tag className={["inline-flex items-center gap-2", className].filter(Boolean).join(" ")} {...rest}>
      {position === "start" ? (
        <>
          <Icon
            name={name}
            size={size}
            className={[iconClass, "shrink-0"].filter(Boolean).join(" ")}
            strokeWidth={strokeWidth}
          />
          {children}
        </>
      ) : (
        <>
          {children}
          <Icon
            name={name}
            size={size}
            className={[iconClass, "shrink-0"].filter(Boolean).join(" ")}
            strokeWidth={strokeWidth}
          />
        </>
      )}
    </Tag>
  );
};

export default IconLabel;
