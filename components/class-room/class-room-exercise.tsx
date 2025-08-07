import ExerciseSidebar from "./exercise/exercise-sidebar";
import ExerciseMainContent from "./exercise/exercise-main-content";

export default function ClassRoomExercise() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar for exercises */}
      <aside className="w-64 border-r bg-muted/30 flex-shrink-0 overflow-y-auto">
        <ExerciseSidebar />
      </aside>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <ExerciseMainContent />
      </div>
    </div>
  );
}
