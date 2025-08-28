"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export default function ResourceUploadSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (args: { title: string; file?: File | null }) => Promise<void> | void;
}) {
  const [title, setTitle] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setFile(null);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/40 backdrop-blur-sm sm:backdrop-blur-md" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 w-[96vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background shadow-lg focus:outline-hidden max-h-[92vh] overflow-hidden">
          <Dialog.Title className="sr-only">Upload resource</Dialog.Title>
          <div className="border-b px-4 py-3">
            <h2 className="text-lg font-semibold">Upload resource</h2>
          </div>
          <div className="p-4 space-y-3 max-h-[70vh] overflow-auto">
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
                placeholder="Enter title"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">PDF file</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full rounded-md border bg-background px-3 py-2"
              />
              {file && (
                <p className="text-xs text-muted-foreground">Selected: {file.name}</p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={async () => {
                if (!title || !file || submitting) return;
                try {
                  setSubmitting(true);
                  await onSubmit({ title, file });
                } finally {
                  setSubmitting(false);
                }
              }}
              disabled={!title || !file || submitting}
            >
              {submitting ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
