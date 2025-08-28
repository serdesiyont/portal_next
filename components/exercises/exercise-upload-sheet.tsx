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
import { Textarea } from "@/components/ui/textarea";
import { XIcon, CheckCircle2, Plus, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type CreateExerciseForm = {
  title: string;
  description: string;
  language: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  boilerplate: string; // plain code text
  testCases: string[]; // dynamic tests values; test1 = index 0
};

export default function ExerciseUploadSheet({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: CreateExerciseForm) => Promise<boolean | void> | boolean | void;
}) {
  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string>("");
  const [data, setData] = React.useState<CreateExerciseForm>({
    title: "",
    description: "",
    language: "",
    date: "",
    time: "",
    boilerplate: "# Write your boilerplate here\n",
    testCases: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setData((d) => ({ ...d, [name]: value } as CreateExerciseForm));
  };

  const updateTestCase = (index: number, value: string) => {
    setData((d) => {
      const arr = [...d.testCases];
      arr[index] = value;
      return { ...d, testCases: arr };
    });
  };

  const addTestCase = () => {
    setData((d) => ({ ...d, testCases: [...d.testCases, ""] }));
  };

  const removeTestCase = (index: number) => {
    setData((d) => {
      if (d.testCases.length <= 1) {
        // keep at least one row; just clear it
        const arr = [""];
        return { ...d, testCases: arr };
      }
      const arr = d.testCases.slice(0, index).concat(d.testCases.slice(index + 1));
      return { ...d, testCases: arr };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.title || !data.description || !data.language || !data.boilerplate) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      let ok: boolean | void = true;
      if (onSubmit) ok = await onSubmit(data);
      if (ok === false) {
        setErrorMsg("Failed to create exercise. Please check your inputs and try again.");
        return;
      }
      setSuccess(true);
      await new Promise((r) => setTimeout(r, 900));
      onOpenChange(false);
      setData({
        title: "",
        description: "",
        language: "",
        date: "",
        time: "",
        boilerplate: "# Write your boilerplate here\n",
        testCases: [""],
      });
      setSuccess(false);
    } catch (err) {
      setErrorMsg("Failed to create exercise. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-background/40 backdrop-blur-sm sm:backdrop-blur-md" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-background shadow-lg focus:outline-hidden max-h-[90vh] overflow-hidden">
          <Dialog.Title className="sr-only">Create exercise</Dialog.Title>
          <button
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[85vh]">
            <Card className="max-w-3xl mx-auto shadow-none border-0 bg-transparent">
              <CardHeader>
                <CardTitle>Create exercise</CardTitle>
                <CardDescription>
                  Provide title, description, language, schedule it, and add
                  boilerplate & test cases.
                </CardDescription>
                {errorMsg && (
                  <div className="text-destructive text-sm mt-2">{errorMsg}</div>
                )}
                {success && (
                  <div className="flex items-center gap-2 text-emerald-600 mt-2 animate-in fade-in-0 zoom-in-90">
                    <CheckCircle2 className="size-5" />
                    <span>Exercise created</span>
                  </div>
                )}
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter exercise title"
                      value={data.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Enter exercise description"
                      value={data.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select
                        value={data.language}
                        onValueChange={(val) =>
                          setData((d) => ({ ...d, language: val }))
                        }
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="JS">JavaScript</SelectItem>
                          <SelectItem value="TS">TypeScript</SelectItem>
                          <SelectItem value="PYTHON">Python</SelectItem>
                          <SelectItem value="PHP">PHP</SelectItem>
                          <SelectItem value="DART">Dart</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Schedule date</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          value={data.date}
                          onChange={handleChange}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="boilerplate">Boilerplate code</Label>
                    <Textarea
                      id="boilerplate"
                      name="boilerplate"
                      className="font-mono min-h-0"
                      rows={6}
                      value={data.boilerplate}
                      onChange={handleChange}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste or write your starter code.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Test Cases</Label>
                    <div className="space-y-2">
                      {data.testCases.map((tc, i) => (
                        <div key={i} className="grid grid-cols-[80px_1fr_auto_auto] items-center gap-2">
                          <span className="text-sm text-muted-foreground">{`test${i + 1}`}</span>
                          <Textarea
                            value={tc}
                            onChange={(e) => updateTestCase(i, e.target.value)}
                            placeholder="Enter test code (supports multiple lines)"
                            className="font-mono min-h-0"
                            rows={3}
                            required={i === 0}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTestCase(i)}
                            aria-label="Remove test"
                            disabled={data.testCases.length === 1}
                          >
                            <Minus className="size-4" />
                          </Button>
                          {i === data.testCases.length - 1 && (
                            <Button type="button" variant="outline" size="sm" onClick={addTestCase} aria-label="Add test">
                              <Plus className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Add multiple tests as needed. Newlines will be encoded automatically.</p>
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
                    {submitting ? "Creating…" : "Create"}
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
