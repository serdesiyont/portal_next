"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { XIcon } from "lucide-react";

export type UploadLessonData = {
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  file: File | null;
};

export default function LessonUploadSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UploadLessonData) => Promise<void> | void;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const [data, setData] = React.useState<UploadLessonData>({
    title: "",
    date: "",
    time: "",
    file: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setData((d) => ({ ...d, file: files && files[0] ? files[0] : null }));
    } else {
      setData((d) => ({ ...d, [name]: value } as UploadLessonData));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title || !data.date || !data.time || !data.file) return;
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      onOpenChange(false);
      // reset
      setData({ title: "", date: "", time: "", file: null });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/40 backdrop-blur-sm sm:backdrop-blur-md" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background shadow-lg focus:outline-hidden max-h-[90vh] overflow-hidden">
          <Dialog.Title className="sr-only">Upload lesson</Dialog.Title>
          <button
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[85vh]">
            <Card className="max-w-2xl mx-auto shadow-none border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Upload lesson</CardTitle>
                <CardDescription>
                  Provide the lesson title, schedule it, and upload a Markdown
                  (.md) file.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter lesson title"
                      value={data.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Schedule date</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={data.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Schedule time</Label>
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={data.time}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file">Markdown file</Label>
                    <Input
                      id="file"
                      name="file"
                      type="file"
                      accept=".md,text/markdown"
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Only .md (Markdown) files are supported.
                    </p>
                    {data.file && (
                      <p className="text-xs text-foreground/80">
                        Selected: {data.file.name}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={submitting}
                  >
                    {submitting ? "Uploading…" : "Upload"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
