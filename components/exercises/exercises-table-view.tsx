"use client";

import * as React from "react";
import { fetchMentorExercises, ExerciseAllDto, deleteExercise, createExercise } from "@/lib/exercise-loader";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, UploadCloud } from "lucide-react";
import ExerciseUploadSheet, { CreateExerciseForm } from "@/components/exercises/exercise-upload-sheet";
import { formatDistanceToNow } from "date-fns";

function formatCodePreserveWhitespace(input: unknown): string {
  if (typeof input !== "string") return JSON.stringify(input, null, 2);
  // Replace literal \n and /n with newline but keep spaces exactly
  return input.replace(/\\n|\/n/g, "\n");
}

function stringifyMapPreserving(input: Record<string, unknown> | undefined): string {
  if (!input) return "";
  const parts: string[] = [];
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === "string") {
      parts.push(`${k}:\n${formatCodePreserveWhitespace(v)}`);
    } else {
      parts.push(`${k}: ${JSON.stringify(v, null, 2)}`);
    }
  }
  return parts.join("\n\n");
}

function formatHumanSchedule(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const addDays = (date: Date, days: number) => {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  };

  const today = now;
  const tomorrow = addDays(now, 1);
  const yesterday = addDays(now, -1);

  const timePart = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  const datePart = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const rel = formatDistanceToNow(d, { addSuffix: true });

  if (isSameDay(d, today)) return `Today, ${timePart} • ${rel}`;
  if (isSameDay(d, tomorrow)) return `Tomorrow, ${timePart} • ${rel}`;
  if (isSameDay(d, yesterday)) return `Yesterday, ${timePart} • ${rel}`;
  return `${datePart} • ${timePart} • ${rel}`;
}

function capitalizeFirstLowerRest(s?: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export default function ExercisesTableView() {
  const [loading, setLoading] = React.useState(true);
  const [exercises, setExercises] = React.useState<ExerciseAllDto[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  const [uploadOpen, setUploadOpen] = React.useState(false);

  const load = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchMentorExercises();
      setExercises(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load exercises");
      toast.error("Failed to load exercises");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMentorExercises();
        if (!cancelled) setExercises(data);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load exercises");
        toast.error("Failed to load exercises");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex-1 min-h-0 p-4 lg:p-6 overflow-auto">
      <div className="max-w-full">
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setUploadOpen(true)}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload exercise
          </Button>
        </div>
        <Table>
          <TableCaption className="text-left">
            {loading
              ? "Loading exercises…"
              : error
              ? error
              : `${exercises.length} exercise(s)`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">#</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="max-w-[280px]">Description</TableHead>
              <TableHead className="w-28">Language</TableHead>
              <TableHead className="w-48">Schedule</TableHead>
              <TableHead className="w-[160px]">Posted By</TableHead>
              <TableHead className="w-[180px]">Boilerplate</TableHead>
              <TableHead className="w-[180px]">Test Cases</TableHead>
              <TableHead className="w-16 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((ex, idx) => (
              <TableRow key={ex.id ?? idx}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">{ex.title}</TableCell>
                <TableCell className="truncate max-w-[320px]">
                  <span
                    className="text-muted-foreground"
                    title={ex.description}
                  >
                    {ex.description}
                  </span>
                </TableCell>
                <TableCell className=" text-muted-foreground">
                  {capitalizeFirstLowerRest(ex.language)}
                </TableCell>
                <TableCell>
                  {ex.schedule ? (
                    <span
                      className="text-muted-foreground"
                      title={new Date(ex.schedule).toLocaleString()}
                    >
                      {formatHumanSchedule(ex.schedule)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="truncate max-w-[200px]">
                  {ex.user ? (
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-muted-foreground cursor-help">{ex.user.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>{ex.user.email}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help  text-muted-foreground underline-offset-4">
                          Hover
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[520px] p-0">
                        <ScrollArea className="h-[300px] w-[520px] p-3 text-sm">
                          <pre className="whitespace-pre-wrap break-words">
                            {stringifyMapPreserving(
                              ex.boilerplate as Record<string, unknown>
                            )}
                          </pre>
                        </ScrollArea>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help  text-muted-foreground underline-offset-4">
                          Hover
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[520px] p-0">
                        <ScrollArea className="h-[300px] w-[520px] p-3 text-sm">
                          <pre className="whitespace-pre-wrap break-words">
                            {stringifyMapPreserving(
                              ex.testCases as Record<string, unknown>
                            )}
                          </pre>
                        </ScrollArea>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="px-2">
                        <MoreVertical className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        className="gap-2"
                        onClick={() => toast.info("Update not implemented yet")}
                      >
                        <Pencil className="size-4" /> Update
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="gap-2 text-red-600 focus:text-red-600"
                        disabled={deletingId === ex.id}
                        onClick={async () => {
                          try {
                            if (typeof ex.id !== "number") return;
                            setDeletingId(ex.id);
                            const t = toast.loading("Deleting exercise…");
                            const res = await deleteExercise(ex.id);
                            toast.success(res, { id: t });
                            await load();
                          } catch (e: any) {
                            toast.error(
                              e?.message || "Failed to delete exercise"
                            );
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                      >
                        <Trash2 className="size-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {!loading && exercises.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground py-10"
                >
                  No exercises
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ExerciseUploadSheet
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSubmit={async (form: CreateExerciseForm) => {
          try {
            const schedule = form.date && form.time ? new Date(`${form.date}T${form.time}:00.000Z`).toISOString() : undefined;
            const boilerplate = { code: (form.boilerplate ?? "").replaceAll("\n", "/n") } as Record<string, unknown>;
            const testCases: Record<string, unknown> = {};
            (form.testCases || []).forEach((val, idx) => {
              const key = `test${idx + 1}`;
              testCases[key] = (val ?? "").replaceAll("\n", "/n");
            });

            await createExercise({
              title: form.title,
              description: form.description,
              language: form.language,
              boilerplate,
              testCases,
              schedule,
            });
            toast.success("Exercise created");
            await load();
            return true;
          } catch (e: any) {
            toast.error(e?.message || "Failed to create exercise");
            return false;
          }
        }}
      />
    </div>
  );
}
