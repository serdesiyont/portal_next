"use client";

import Link from "next/link";
import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import * as React from "react";

export function NavMain({
  items,
}: {
  items: { title: string; url: string; icon?: Icon }[];
}) {
  const [hash, setHash] = React.useState<string>(
    typeof window !== "undefined"
      ? window.location.hash || "#dashboard"
      : "#dashboard"
  );

  React.useEffect(() => {
    const onHashChange = () => setHash(window.location.hash || "#dashboard");
    window.addEventListener("hashchange", onHashChange);
    // initialize default hash
    if (!window.location.hash) window.location.hash = "#dashboard";
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (url.startsWith("#")) {
      e.preventDefault();
      window.location.hash = url;
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>React</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = (hash || "#dashboard") === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className={
                    isActive
                      ? "shadow-[0_0_0_1px_var(--border)] shadow-primary/30 bg-accent/60"
                      : ""
                  }
                >
                  <Link
                    href={item.url}
                    onClick={(e) => handleClick(e, item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
