 
import ThemeSelector from "./ThemeSelector";
import RunButton from "./RunButton";

function Header() {
  return (
    <div className="relative z-10">
      <div
        className="flex items-center lg:justify-between justify-center 
        bg-[#0a0a0f]/80 backdrop-blur-xl p-6 mb-4 rounded-lg"
      >
        <div className="flex items-center gap-4">
          <ThemeSelector />
          <RunButton />
        </div>
      </div>
    </div>
  );
}
export default Header;
