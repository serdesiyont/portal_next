"use client";

import * as React from "react";
import api from "@/lib/axios";
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

interface LessonDto {
  id: number;
  title: string;
  address: string;
}

export default function LessonsTableView() {
  const [loading, setLoading] = React.useState(true);
  const [lessons, setLessons] = React.useState<LessonDto[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const { data } = await api.get<LessonDto[]>("/lessons");
        if (!cancelled) setLessons(data || []);
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
              <TableHead className="w-24">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="">Posted By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lessons.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.id}</TableCell>
                <TableCell className="font-medium">{l.title}</TableCell>
                <TableCell className="truncate max-w-[420px]">
                  {l.address}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <a href={l.address} target="_blank" rel="noreferrer">
                      Open
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && lessons.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No lessons
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
