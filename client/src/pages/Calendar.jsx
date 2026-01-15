import { SideBar } from "../components/Sidebar";
import { TopNav } from "../components/TopNav";

export default function Calendar() {
  return (
    <div className="flex min-h-screen bg-background">
      <SideBar />
      <div className="min-w-0 flex-1">
        <TopNav />
      </div>
    </div>
  );
}
