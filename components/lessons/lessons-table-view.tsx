"use client";

import * as React from "react";
import { fetchLessons, LessonDto } from "@/lib/lesson-loader";
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
import LessonPreviewSheet from "@/components/lessons/lesson-preview-sheet";
import { MoreVertical, ExternalLink, Pencil, Trash2, Eye } from "lucide-react";

export default function LessonsTableView() {
  const [loading, setLoading] = React.useState(true);
  const [lessons, setLessons] = React.useState<LessonDto[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  // Preview state managed here; content loading handled inside LessonPreviewSheet
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewLesson, setPreviewLesson] = React.useState<LessonDto | null>(
    null
  );

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
    setPreviewOpen(true);
  };

  return (
    <div className="flex-1 min-h-0 p-4 lg:p-6 overflow-auto">
      <div className="max-w-full">
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
              {/* <TableHead>Address</TableHead> */}
              <TableHead>Posted By</TableHead>
              <TableHead className="w-56 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.id}</TableCell>
                <TableCell className="font-medium">{l.title}</TableCell>
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
                        <DropdownMenuItem className="gap-2">
                          <Pencil className="size-4" /> Update
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-red-600 focus:text-red-600">
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
    </div>
  );
}
