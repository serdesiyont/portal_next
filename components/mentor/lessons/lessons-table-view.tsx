"use client";

import * as React from "react";
import {
  fetchLessons,
  LessonDto,
  createLesson,
  deleteLesson as deleteLessonApi,
} from "@/lib/lesson-loader";
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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LessonPreviewSheet from "@/components/mentor/lessons/lesson-preview-sheet";
import LessonUploadSheet from "@/components/mentor/lessons/lesson-upload-sheet";
import LessonBuilderDialog from "@/components/mentor/lessons/lesson-builder-dialog";
import {
  MoreVertical,
  ExternalLink,
  Pencil,
  Trash2,
  Eye,
  UploadCloud,
  Hammer,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  isToday,
  isTomorrow,
  isYesterday,
} from "date-fns";

export default function LessonsTableView() {
  const [loading, setLoading] = React.useState(true);
  const [lessons, setLessons] = React.useState<LessonDto[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  // Preview state managed here; content loading handled inside LessonPreviewSheet
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewLesson, setPreviewLesson] = React.useState<LessonDto | null>(
    null
  );
  const [selectedLessonId, setSelectedLessonId] = React.useState<number | null>(
    null
  );
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [builderOpen, setBuilderOpen] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLessons();
        if (!cancelled) setLessons(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load lessons");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openPreview = (lesson: LessonDto) => {
    setPreviewLesson(lesson);
    setSelectedLessonId(lesson.id);
    setPreviewOpen(true);
  };

  return (
    <div className="flex-1 min-h-0 p-4 lg:p-6 overflow-auto">
      <div className="max-w-full">
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button variant="outline" onClick={() => setBuilderOpen(true)}>
            <Hammer className="mr-2 h-4 w-4" /> Build lesson
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setUploadOpen(true)}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload lesson
          </Button>
        </div>
        <Table>
          <TableCaption className="text-left">
            {loading
              ? "Loading lessons…"
              : error
              ? error
              : `${lessons.length} lesson(s)`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Schedule</TableHead>
              {/* <TableHead>Address</TableHead> */}
              <TableHead>Posted By</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((l, idx) => (
              <TableRow key={l.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell className="truncate max-w-[260px]">
                  {l.schedule ? (
                    <span className="text-muted-foreground" title={l.schedule}>
                      {(() => {
                        const d = new Date(l.schedule!);
                        if (isToday(d)) return `Today, ${format(d, "p")}`;
                        if (isTomorrow(d)) return `Tomorrow, ${format(d, "p")}`;
                        if (isYesterday(d))
                          return `Yesterday, ${format(d, "p")}`;
                        const rel = formatDistanceToNow(d, { addSuffix: true });
                        return `${format(d, "PPp")} • ${rel}`;
                      })()}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                {/* <TableCell className="truncate max-w-[420px]">{l.address}</TableCell> */}
                <TableCell className="truncate max-w-[260px]">
                  {l.user ? (
                    <span className="text-muted-foreground">
                      {l.user.name} • {l.user.email}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => openPreview(l)}
                    >
                      <Eye className="size-3.5" /> Preview
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="px-2">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <a
                            href={l.address}
                            target="_blank"
                            rel="noreferrer"
                            className="gap-2"
                          >
                            <ExternalLink className="size-4" /> Open
                          </a>
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 text-red-600 focus:text-red-600"
                          disabled={deletingId === l.id}
                          onClick={async () => {
                            try {
                              setDeletingId(l.id);
                              const t = toast.loading("Deleting lesson…");
                              const res = await deleteLessonApi(l.id);
                              toast.success(
                                typeof res === "string"
                                  ? res
                                  : "Lesson deleted",
                                { id: t }
                              );
                              const data = await fetchLessons();
                              setLessons(data);
                            } catch (e: any) {
                              toast.error(
                                e?.message || "Failed to delete lesson"
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
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!loading && lessons.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-10"
                >
                  No lessons
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Preview Sheet */}
      <LessonPreviewSheet
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={previewLesson?.title}
        address={previewLesson?.address}
      />

      {/* Upload Sheet */}
      <LessonUploadSheet
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSubmit={async ({ title, date, time, file }) => {
          if (!file) return;
          const schedule = new Date(`${date}T${time}:00.000Z`).toISOString();
          await createLesson({ title, file, schedule });
          // refresh list
          const data = await fetchLessons();
          setLessons(data);
        }}
      />

      {/* Build Lesson Dialog */}
      <LessonBuilderDialog open={builderOpen} onOpenChange={setBuilderOpen} />
    </div>
  );
}
