import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  MessengerIcon,
  TaskIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <CalenderIcon />,
    name: "Calendar",
    path: "/calendar",
  },
  {
    icon: <MessengerIcon />,
    name: "Messenger",
    path: "/messenger",
  },
  {
    icon: <GroupIcon />,
    name: "Leads",
    path: "/leads",
  },
  {
    icon: <TaskIcon />,
    name: "Support Tickets",
    path: "/tickets",
  },
  {
    icon: <UserCircleIcon />,
    name: "User Profile",
    path: "/profile",
  },
];

const othersItems: NavItem[] = [];

function BrandLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="120"
      height="50"
      viewBox="0 0 120 50"
      aria-label="Logo"
    >
      <circle cx="20" cy="22" r="20" fill="#020203" />
      <path
        stroke="#fff"
        d="m15.75 17.182-.354.847a5.12 5.12 0 0 0 .052 4.068 5.5 5.5 0 0 1-.236 5.092l-.065.113m5.122-10.12-.353.847a5.12 5.12 0 0 0 .052 4.068 5.5 5.5 0 0 1-.236 5.092l-.066.113m5.122-10.12-.352.847a5.12 5.12 0 0 0 .051 4.068 5.5 5.5 0 0 1-.236 5.092l-.065.113"
      />
      <path
        className="fill-[#020203] dark:fill-white"
        d="M78.302 22.996a6.27 6.27 0 0 0-1.345-2.923 5 5 0 0 0-.695-.696c-.835-.696-1.808-1.207-2.875-1.439a6.8 6.8 0 0 0-2.364 0c-1.067.186-2.04.696-2.875 1.392-.232.186-.464.464-.695.696a6.27 6.27 0 0 0-1.345 2.924 8 8 0 0 0-.093 1.02v.372c.093 1.299.557 2.552 1.391 3.526 1.16 1.439 2.921 2.227 4.73 2.227 1.808 0 3.57-.788 4.728-2.227q.209-.21.418-.557v-.046c.046-.047.046-.093.092-.14h.093v-.092c.046-.093.046-.186.046-.279a.864.864 0 0 0-.788-.881c-.324-.047-.649.093-.88.418a4.32 4.32 0 0 1-3.71 2.087c-2.179 0-4.033-1.67-4.312-3.804h9.598a.88.88 0 0 0 .88-.882v-.696M76.4 22.81h-8.438c.417-1.53 1.715-2.737 3.291-3.108a4 4 0 0 1 1.809 0c1.669.37 2.92 1.577 3.338 3.108M114 23.695v-.186c0-.185-.046-.417-.046-.603a6.27 6.27 0 0 0-1.345-2.923 5 5 0 0 0-.695-.696c-.835-.696-1.808-1.206-2.875-1.438a6.7 6.7 0 0 0-2.364 0c-1.067.185-2.04.695-2.875 1.392-.232.185-.463.464-.695.696a6.27 6.27 0 0 0-1.345 2.923 8 8 0 0 0-.093 1.02v.372c.093 1.299.557 2.552 1.391 3.526 1.159 1.439 2.921 2.228 4.729 2.228s3.57-.79 4.729-2.228q.21-.209.418-.557v-.046c.046-.046.046-.093.092-.14h.093c.047-.092.047-.185.047-.278a.864.864 0 0 0-.789-.881c-.324-.047-.649.093-.881.417a4.32 4.32 0 0 1-3.709 2.088c-2.179 0-4.033-1.67-4.311-3.804h9.597c.556 0 .927-.372.927-.882m-10.293-.882c.418-1.53 1.716-2.737 3.292-3.108a4 4 0 0 1 1.808 0 4.32 4.32 0 0 1 3.292 3.108zM83.356 28.425h-.232c-.092 0-.185 0-.231-.047-.464-.093-.881-.325-1.16-.742-.324-.464-.324-1.02-.324-1.531v-6.357h1.854a.88.88 0 1 0 0-1.763H81.41V14.69a.88.88 0 1 0-1.762 0V26.8a3.59 3.59 0 0 0 1.438 2.738c.417.279.88.51 1.39.604.093 0 .325.046.603.046.325 0 .742-.046.974-.325.139-.14.231-.371.185-.742a1.06 1.06 0 0 0-.88-.696M102.318 18.823a.88.88 0 0 0-.881-.882h-.185c-.835.186-1.577.696-2.087 1.346v-.464a.88.88 0 1 0-1.761 0v10.44a.88.88 0 1 0 1.761 0v-7.1c.325-1.206 1.299-2.134 2.458-2.458.324-.093.695-.325.695-.882M63.605 17.941a.88.88 0 0 0-.881.882v10.44c0 .51.417.882.88.882.465 0 .882-.372.882-.835V18.777c0-.464-.418-.836-.881-.836M60.405 13.809c-.51 0-.88.37-.88.881v5.012l-.325-.325c-.835-.696-1.808-1.207-2.875-1.439a6.8 6.8 0 0 0-2.364 0c-1.066.186-2.04.696-2.874 1.392-.232.186-.464.464-.696.696-.88 1.067-1.344 2.32-1.39 3.712v.372c.046 1.392.51 2.69 1.39 3.758 1.16 1.438 2.92 2.227 4.729 2.227 1.855 0 3.57-.835 4.73-2.227.834-1.02 1.297-2.227 1.39-3.573V14.69c.046-.51-.37-.881-.835-.881m-9.643 9.976c0-.279.046-.51.093-.743.37-1.67 1.669-2.97 3.291-3.34a4.6 4.6 0 0 1 1.948 0c1.669.37 2.967 1.67 3.291 3.34.047.232.093.464.093.743v.556c-.185 2.274-2.086 4.037-4.358 4.037s-4.173-1.763-4.358-4.036v-.558M95.038 17.941c-.51 0-.88.418-.88 1.068v4.361c.046 1.16.092 2.413-.51 3.387-.743 1.3-2.365 1.95-3.895 1.624-2.829-.603-2.736-3.758-2.643-6.264 0-.464.046-.881.046-1.252V20.4c.047-.79.093-1.856-.556-2.274-.37-.232-.834-.186-1.066.186-.371.51-.371 1.206-.371 1.81v2.366c-.047 1.438-.047 2.97.51 4.408a5.1 5.1 0 0 0 3.894 3.201c.371.047.696.093 1.02.093a5.34 5.34 0 0 0 3.848-1.67 5.08 5.08 0 0 0 1.391-3.48v-6.264c.14-.418-.324-.836-.788-.836M63.605 13.809a.88.88 0 0 0-.881.881v1.16c0 .51.417.882.88.882.465 0 .882-.371.882-.835v-1.253c0-.464-.418-.835-.881-.835"
      />
    </svg>
  );
}

function BrandMark() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 44"
      aria-label="Logo"
    >
      <circle cx="20" cy="22" r="20" fill="#020203" />
      <path
        stroke="#fff"
        d="m15.75 17.182-.354.847a5.12 5.12 0 0 0 .052 4.068 5.5 5.5 0 0 1-.236 5.092l-.065.113m5.122-10.12-.353.847a5.12 5.12 0 0 0 .052 4.068 5.5 5.5 0 0 1-.236 5.092l-.066.113m5.122-10.12-.352.847a5.12 5.12 0 0 0 .051 4.068 5.5 5.5 0 0 1-.236 5.092l-.065.113"
      />
    </svg>
  );
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => location.pathname === path;
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      to={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" aria-label="Home">
          {isExpanded || isHovered || isMobileOpen ? (
            <BrandLogo />
          ) : (
            <BrandMark />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
