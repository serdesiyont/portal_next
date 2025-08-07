import EditorPanel from "./_components/EditorPanel";
import OutputPanel from "./_components/OutputPanel";

export default function ExerciseMainContent() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto relative">
        <div className="h-full w-full flex flex-col relative">
          <div className="pt-2 px-6 pb-6 flex-1 flex flex-col">
            <EditorPanel />
          </div>
        </div>
      </div>
      <aside className="w-[500px] h-full flex-shrink-0 overflow-hidden border-l bg-background rounded-xl shadow-lg p-6 flex flex-col justify-between">
        <OutputPanel />
      </aside>
    </div>
  );
}
