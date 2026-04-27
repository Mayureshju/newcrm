import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

const FULL_BLEED_PREFIXES = ["/messenger", "/tickets/", "/leads/"];

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const location = useLocation();
  const fullBleed = FULL_BLEED_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`min-w-0 flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        {fullBleed ? (
          <div className="lg:hidden">
            <AppHeader />
          </div>
        ) : (
          <AppHeader />
        )}
        <div
          className={
            fullBleed
              ? "w-full"
              : "p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6"
          }
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
