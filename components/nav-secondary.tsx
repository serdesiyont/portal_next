"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: { title: string; url: string; icon: Icon }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const [hash, setHash] = React.useState<string>(
    typeof window !== "undefined" ? window.location.hash : ""
  );

  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url === "#" || url.startsWith("#")) {
      e.preventDefault();
      const nextHash = url === "#" ? "" : url;
      if (nextHash) window.location.hash = nextHash;
      else
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname + window.location.search
        );
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isHash = item.url === "#" || item.url.startsWith("#");
            const isActive = isHash
              ? item.url === "#"
                ? hash === ""
                : hash === item.url
              : pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={
                    isActive
                      ? "shadow-[0_0_0_1px_var(--border)] shadow-primary/30 bg-accent/60"
                      : ""
                  }
                >
                  <a href={item.url} onClick={(e) => handleClick(e, item.url)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
