export default function ReferenceSidebar() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Reference</h3>
        <ul className="space-y-1 text-sm">
          <li>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground block py-1 px-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              API Docs
            </a>
          </li>
          {/* ...other reference links... */}
        </ul>
      </div>
    </div>
  );
}
