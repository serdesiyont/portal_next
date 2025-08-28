"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchResources, ResourceDto } from "@/lib/resource-loader";

export function ResourcesSheet({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const [loading, setLoading] = React.useState(false);
  const [resources, setResources] = React.useState<ResourceDto[]>([]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchResources();
        if (!cancelled) setResources(data || []);
      } catch (e) {
        // noop
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {children ? <SheetTrigger asChild>{children}</SheetTrigger> : null}
      <SheetContent side="right" className="w-[420px] sm:w-[480px]">
        <SheetHeader>
          <SheetTitle>Resources</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading resources…
            </div>
          ) : resources.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No resources found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {resources.map((r) => (
                <Button
                  key={`${r.address}-${r.title}`}
                  variant="outline"
                  className="justify-start flex-col items-start gap-0.5"
                  onClick={() => {
                    setOpen(false);
                    if (r.address)
                      window.open(r.address, "_blank", "noreferrer");
                  }}
                  title={r.address}
                >
                  <span className="font-medium">{r.title}</span>
                  {r.user && (
                    <span className="text-xs text-muted-foreground">
                      {r.user.name} • {r.user.email}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
