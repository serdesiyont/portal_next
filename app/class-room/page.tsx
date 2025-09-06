"use client";

import {
  Search,
  Github,
  Twitter,
  Youtube,
  Users,
  Moon,
  Sun,
  KeyRound,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useState } from "react";
import ClassRoomLesson from "@/components/class-room/class-room-lesson";
import ClassRoomExercise from "@/components/class-room/class-room-exercise";
import Reference from "@/components/class-room/class-room-refernce";
import cookies from "js-cookie";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { addApiKey, changePassword } from "@/lib/user";

export default function ChromaDocsClone() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const [sidebarSection, setSidebarSection] = useState<
    "lesson" | "exercise" | "reference"
  >("lesson");

  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState("");
  const initial = (name?.trim()?.[0] || "?").toUpperCase();

  // HAS_API_KEY state (to refresh chat widgets without full reload)
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);

  // Sheets state
  const [apiSheetOpen, setApiSheetOpen] = useState(false);
  const [pwdSheetOpen, setPwdSheetOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  // Error and success messages
  const [apiKeyError, setApiKeyError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [apiKeySuccess, setApiKeySuccess] = useState("");

  // Persist sidebarSection in localStorage
  useEffect(() => {
    setMounted(true);
    // Load profile data from cookies
    const n = cookies.get("NAME") || "";
    const e = cookies.get("EMAIL") || "";
    const d = cookies.get("DIVISION") || "";
    setName(n);
    setEmail(e);
    setDivision(d);
    // Load sidebar section from localStorage
    const savedSection = localStorage.getItem("sidebarSection");
    if (
      savedSection === "lesson" ||
      savedSection === "exercise" ||
      savedSection === "reference"
    ) {
      setSidebarSection(savedSection);
    }
    // Load HAS_API_KEY
    const v = cookies.get("HAS_API_KEY");
    const enabled = v === "true" || v === "1" || v?.toLowerCase?.() === "yes";
    setHasApiKey(!!enabled);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("sidebarSection", sidebarSection);
    }
  }, [sidebarSection, mounted]);

  if (!mounted) {
    return null;
  }

  // Add API Key handler
  async function handleSaveApiKey() {
    setApiKeyError("");
    setApiKeySuccess("");
    if (!apiKey.trim()) {
      setApiKeyError("API Key is required");
      return;
    }
    const result = await addApiKey(apiKey);
    if (result.success) {
      setApiKeySuccess("API Key saved!");
      setApiSheetOpen(false);
      // Update cookie and local state so chat widgets unlock without full refresh
      cookies.set("HAS_API_KEY", "true");
      setHasApiKey(true);
    } else {
      setApiKeyError(result.error || "Failed to save API Key");
    }
  }

  // Change password handler
  async function handleChangePassword() {
    setPwdError("");
    setPwdSuccess("");
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("All fields are required");
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("New passwords do not match");
      return;
    }
    const result = await changePassword(currentPwd, newPwd);
    if (result.success) {
      setPwdSuccess("Password updated!");
      setPwdSheetOpen(false);
    } else {
      setPwdError(result.error || "Failed to change password");
    }
  }

  return (
    <div
      className={`h-screen bg-background text-foreground flex flex-col${
        theme === "dark" ? " dark" : ""
      }`}
    >
      {/* Header - Fixed */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded"></div>
              <Link href="/">
                <span className="font-semibold text-lg">Home</span>
              </Link>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search"
                className="pl-10 pr-16 w-64 bg-muted/50 border-input"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">
                  ⌘
                </kbd>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted border rounded font-mono">
                  K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right side stats */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>795 online</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Github className="w-4 h-4" />
              <span>21k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Twitter className="w-4 h-4" />
              <span>22.1k</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Youtube className="w-4 h-4" />
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="w-9 h-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Secondary Navigation Bar */}
      <nav className="border-t border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-6">
            <button
              type="button"
              className={`flex items-center gap-2 font-medium transition-colors ${
                sidebarSection === "lesson"
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSidebarSection("lesson")}
            >
              <span>📄</span> Lesson
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 font-medium transition-colors ${
                sidebarSection === "exercise"
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSidebarSection("exercise")}
            >
              <span>💪</span> Exercises
            </button>
            <button
              type="button"
              className={`flex items-center gap-2 font-medium transition-colors ${
                sidebarSection === "reference"
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setSidebarSection("reference")}
            >
              <span>📚</span> Reference
            </button>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                id="profile-btn"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Open profile menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              {/* <DropdownMenuLabel>Profile</DropdownMenuLabel> */}
              <div className="px-2 py-1.5 text-sm space-y-0.5">
                <div className="font-medium leading-none">
                  {name || "Unknown User"}
                </div>
                <div className="text-muted-foreground leading-none break-all">
                  {email || "-"}
                </div>
                {/* <div className="text-muted-foreground leading-none">
                  Division: {division || "-"}
                </div> */}
              </div>
              <DropdownMenuSeparator />
              {/* Actions area with side-by-side buttons and icons */}
              <div className="px-2 py-2 grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="justify-center gap-2"
                  onClick={() => setApiSheetOpen(true)}
                >
                  <KeyRound className="w-4 h-4" />
                  API Key
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="justify-center gap-2"
                  onClick={() => setPwdSheetOpen(true)}
                >
                  <Lock className="w-4 h-4" />
                  Password
                </Button>
              </div>
              <div className="px-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full justify-center gap-2"
                  onClick={() => {
                    import("@/lib/login").then(({ logout }) => {
                      logout();
                      window.location.reload();
                    });
                  }}
                >
                  Logout
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Add API Key Modal */}
      {apiSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setApiSheetOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Add API Key</h2>
              <p className="text-sm text-muted-foreground">
                Add or update your API key associated with this account.
              </p>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                {apiKeyError && (
                  <div className="text-red-500 text-xs mt-1">{apiKeyError}</div>
                )}
                {apiKeySuccess && (
                  <div className="text-green-600 text-xs mt-1">
                    {apiKeySuccess}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-2">
              <Button
                className="w-full"
                onClick={handleSaveApiKey}
                disabled={!apiKey.trim()}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {pwdSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
            <button
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
              onClick={() => setPwdSheetOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="mb-2">
              <h2 className="text-lg font-semibold">Change Password</h2>
              <p className="text-sm text-muted-foreground">
                Update your account password.
              </p>
            </div>
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPwd">Current password</Label>
                <Input
                  id="currentPwd"
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPwd">New password</Label>
                <Input
                  id="newPwd"
                  type="password"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPwd">Confirm new password</Label>
                <Input
                  id="confirmPwd"
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                />
                {newPwd && confirmPwd && newPwd !== confirmPwd && (
                  <div className="text-red-500 text-xs mt-1">
                    Passwords do not match
                  </div>
                )}
              </div>
              {pwdError && (
                <div className="text-red-500 text-xs mt-1">{pwdError}</div>
              )}
              {pwdSuccess && (
                <div className="text-green-600 text-xs mt-1">{pwdSuccess}</div>
              )}
            </div>
            <div className="pt-2">
              <Button
                className="w-full"
                onClick={handleChangePassword}
                disabled={
                  !currentPwd || !newPwd || !confirmPwd || newPwd !== confirmPwd
                }
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Content based on sidebar selection */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {sidebarSection === "lesson" && (
              <ClassRoomLesson hasApiKeyProp={hasApiKey ?? undefined} />
            )}
            {sidebarSection === "exercise" && <ClassRoomExercise />}
            {sidebarSection === "reference" && (
              <Reference hasApiKeyProp={hasApiKey ?? undefined} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
