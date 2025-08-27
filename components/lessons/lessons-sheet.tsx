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
import api from "@/lib/axios";

interface LessonDto {
  id: number;
  title: string;
  address: string;
}

export function LessonsSheet({
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
  const [lessons, setLessons] = React.useState<LessonDto[]>([]);

  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const { data } = await api.get<LessonDto[]>("/lessons");
        if (!cancelled) setLessons(data || []);
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
          <SheetTitle>Lessons</SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Loading lessons…
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No lessons found
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {lessons.map((l) => (
                <Button
                  key={l.id}
                  variant="outline"
                  className="justify-start"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {l.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
