"use client";

import * as React from "react";
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
import {
  fetchResources,
  createResource,
  deleteResource,
  ResourceDto,
} from "@/lib/resource-loader";
import {
  Eye,
  ExternalLink,
  MoreVertical,
  Pencil,
  Trash2,
  UploadCloud,
} from "lucide-react";
import ResourceUploadSheet from "@/components/mentor/resources/resource-upload-sheet";

export default function ResourceTableView() {
  const [loading, setLoading] = React.useState(true);
  const [resources, setResources] = React.useState<ResourceDto[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchResources();
        if (!cancelled) setResources(data);
      } catch (e) {
        if (!cancelled) setError("Failed to load resources");
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
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setUploadOpen(true)}
          >
            <UploadCloud className="mr-2 h-4 w-4" /> Upload resource
          </Button>
        </div>
        <Table>
          <TableCaption className="text-left">
            {loading
              ? "Loading resources…"
              : error
              ? error
              : `${resources.length} resource(s)`}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Posted By</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((r, idx) => (
              <TableRow key={r.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell className="truncate max-w-[260px]">
                  {r.user ? (
                    <span className="text-muted-foreground">
                      {r.user.name} • {r.user.email}
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
                      asChild
                    >
                      <a href={r.address} target="_blank" rel="noreferrer">
                        <Eye className="size-3.5" /> Preview
                      </a>
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
                            href={r.address}
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
                          disabled={deletingId === r.id}
                          onClick={async () => {
                            try {
                              setDeletingId(r.id);
                              const t = toast.loading("Deleting resource…");
                              const res = await deleteResource(r.id);
                              toast.success(
                                typeof res === "string"
                                  ? res
                                  : "Resource deleted",
                                { id: t }
                              );
                              const data = await fetchResources();
                              setResources(data);
                            } catch (e: any) {
                              toast.error(
                                e?.message || "Failed to delete resource"
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
            {!loading && resources.length === 0 && !error && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-10"
                >
                  No resources
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ResourceUploadSheet
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSubmit={async ({ title, file }) => {
          if (!file) return;
          try {
            await createResource({ title, file });
            const data = await fetchResources();
            setResources(data);
            toast.success("Resource uploaded");
            setUploadOpen(false);
          } catch (e: any) {
            toast.error(e?.message || "Failed to upload resource");
          }
        }}
      />
    </div>
  );
}
