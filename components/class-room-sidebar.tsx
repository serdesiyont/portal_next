import Link from "next/link";

export function ClassRoomSidebar() {
  return (
    <div className="p-6">
      {/* Overview Section */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Overview</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Introduction
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-primary font-medium block py-1 px-2 bg-primary/10 rounded-md"
            >
              Getting Started
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Architecture
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Data Model
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Roadmap
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Contributing
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Telemetry
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Migration
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              Troubleshooting
            </Link>
          </li>
          <li>
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              About
            </Link>
          </li>
        </ul>
      </div>
      {/* ...other sections from sidebarContent... */}
    </div>
  );
}
