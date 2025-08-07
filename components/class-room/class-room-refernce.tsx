import ReferenceSidebar from "./reference/reference-sidebar";
import ReferenceMainContent from "./reference/refence-main-content";

export default function Reference() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar for reference */}
      <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
        <ReferenceSidebar />
      </aside>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <ReferenceMainContent />
      </div>
    </div>
  );
}
