"use client";

import type * as React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

export const SubMenuLink = ({
  item,
  onClose,
  isOpaque,
}: {
  item: MenuItem;
  onClose?: () => void;
  isOpaque?: boolean;
}) => {
  const textClass = isOpaque ? "text-violet-200" : "text-white drop-shadow-sm";
  return (
    <a
      className={`flex select-none flex-row gap-4 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-violet-800/30 hover:text-violet-200 focus:bg-violet-800/30 focus:text-violet-200 md:px-4 ${textClass}`}
      href={item.url}
      onClick={() => onClose?.()}
    >
      {item.icon && <div className="text-violet-200">{item.icon}</div>}
      <div>
        <div className="font-semibold text-sm" data-nav-text>
          {item.title}
        </div>
        {item.description && <p className="text-neutral-300 text-sm leading-snug">{item.description}</p>}
      </div>
    </a>
  );
};

export const renderMenuItem = (item: MenuItem, activeSection?: string, isOpaque = true) => {
  const textClass = isOpaque ? "text-violet-200" : "text-white drop-shadow-sm";
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger
          className={`group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-colors ${textClass} hover:bg-violet-800/30 hover:text-violet-200 focus:bg-violet-800/30 focus:text-violet-200`}
        >
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className="bg-black text-violet-200">
          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {item.items.map((subItem) => (
              <li key={subItem.title}>
                <NavigationMenuLink asChild>
                  <SubMenuLink item={subItem} isOpaque={isOpaque} />
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className={
          "group inline-flex h-10 w-max items-center justify-center rounded-full px-4 font-medium text-sm transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50" +
          // Default: lighter white, hover: subtle violet overlay; selected: pill with semi-opaque violet background and violet text
          `${textClass} hover:bg-violet-800/30 hover:text-violet-200 focus:bg-violet-800/30 focus:text-violet-200` +
          (activeSection && item.url.startsWith("#") && activeSection === item.url.replace("#", "")
            ? "rounded-full bg-violet-800 px-4 font-semibold text-white"
            : "")
        }
        aria-current={
          activeSection && item.url.startsWith("#") && activeSection === item.url.replace("#", "") ? "page" : undefined
        }
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

export const renderMobileMenuItem = (
  item: MenuItem,
  onClose?: () => void,
  activeSection?: string,
  isOpaque = true,
  isIndexPage = false,
) => {
  const textClass = isOpaque ? "text-violet-200" : "text-white drop-shadow-sm";
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className="border-b-0">
        <AccordionTrigger className="py-0 font-semibold text-md text-violet-200 hover:no-underline">
          {item.title}
        </AccordionTrigger>
        <AccordionContent className="mt-2">
          {item.items.map((subItem) => (
            <SubMenuLink key={subItem.title} item={subItem} onClose={onClose} isOpaque={isOpaque} />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }
  const isActive = activeSection && item.url.startsWith("#") && activeSection === item.url.replace("#", "");
  return (
    <div key={item.title} className="flex items-center gap-3 py-2">
      {isIndexPage && (
        <span
          className={`h-2 w-2 rounded-full ${isActive ? "bg-violet-400" : "bg-transparent"} border border-gray-700`}
          aria-hidden="true"
        />
      )}
      <a
        href={item.url}
        className={`block flex-1 pr-2 text-md ${isActive ? "font-semibold text-white" : textClass}`}
        onClick={() => onClose?.()}
        aria-current={isActive ? "page" : undefined}
      >
        {item.title}
      </a>
    </div>
  );
};
