import EditorPanel from "./editor/_components/EditorPanel";
import OutputPanel from "./editor/_components/OutputPanel";
import Header from "./editor/_components/Header";
export default function EmptyExercise() {
  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="prose prose-gray dark:prose-invert max-w-none">
          <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EditorPanel />
          <OutputPanel />
        </div>
      </div>
    </div>
  );
}
