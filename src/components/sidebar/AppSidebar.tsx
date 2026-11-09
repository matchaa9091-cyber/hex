"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, HelpCircle, Menu, ChevronDown, ChevronRight, UserPlus, Star, Send, Edit3, Flame } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { PasscodeModal } from "@/components/profiles/PasscodeModal";

const kampalaAreas = [
  // Top Active Hubs (verified resident companions)
  "Kawempe", "Kasubi", "Kyanja", "Mengo", "Bukoto", "Makindye",
  "Munyonyo", "Rubaga", "Salaama Rd", "Kisaasi", "Makerere", "Kololo",
  "Ntinda", "Bwaise", "Kalerwe", "Kansanga", "Masanafu", "Najjanankumbi",
  "Namasuba", "Nankulabye", "Ndejje", "Nsambya", "Old Kampala", "Kira", "Zana",
  // Prime Suburbs
  "Banda", "Bugolobi", "Bukesa", "Bunamwaya", "Bunga", "Busega", "Buwate",
  "Buziga", "Central", "Ggaba", "Kabalagala", "Kabowa", "Kampala Town",
  "Kamwokya", "Kanyanya", "Katooke", "Kazo", "Kibuli", "Kireka", "Kirinnya",
  "Kisugu", "Kitintale", "Kiwatule", "Komamboga", "Kulambiro", "Kyaliwajjala",
  "Kyambogo", "Kyebando", "Lubaga", "Lugala", "Lugogo", "Lungujja", "Luzira",
  "Masajja", "Mawanda Road", "Mbuya", "Mpererwe", "Mulago", "Mutundwe",
  "Mutungo", "Muyenga", "Naalya", "Nabulagala", "Nabweru", "Naguru", "Najjera",
  "Nakasero", "Nakawa", "Namirembe", "Namungoona", "Namuwongo",
  "Nateete", "Nkuba", "Sir Apollo Kagwa", "Wandegeya"
];

const locations = [
  { name: "Kampala", path: "/escorts-in/kampala", hasSubmenu: true, submenu: kampalaAreas },
  { name: "Entebbe", path: "/escorts-in/entebbe" },
  { name: "Mukono", path: "/escorts-in/mukono" },
  { name: "Jinja", path: "/escorts-in/jinja" },
  { name: "Mbarara", path: "/escorts-in/mbarara" },
  { name: "Fort Portal", path: "/escorts-in/fort-portal" },
  { name: "Arua", path: "/escorts-in/arua" },
  { name: "Wakiso", path: "/escorts-in/wakiso" },
  { name: "Gulu", path: "/escorts-in/gulu" },
  { name: "Masaka", path: "/escorts-in/masaka" },
  { name: "Mbale", path: "/escorts-in/mbale" },
  { name: "Tororo", path: "/escorts-in/tororo" },
  { name: "Lira", path: "/escorts-in/lira" },
  { name: "Hoima", path: "/escorts-in/hoima" },
  { name: "Kasese", path: "/escorts-in/kasese" },
  { name: "Soroti", path: "/escorts-in/soroti" },
  { name: "Kabale", path: "/escorts-in/kabale" },
];

interface MainItem {
  title: string;
  path: string;
  icon: any;
  children?: typeof locations;
  isEditAction?: boolean;
}

const mainItems: MainItem[] = [
  { title: "Home", path: "/", icon: Home },
  { title: "VIP Escorts", path: "/vip", icon: Star },
  { title: "Locations", path: "/escorts-in", icon: MapPin, children: locations },
  { title: "FAQ", path: "/faq", icon: HelpCircle },
  { title: "Become an escort", path: "/become-escort", icon: UserPlus },
  { title: "Edit My Profile", path: "#edit-profile", icon: Edit3, isEditAction: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [expandedLocation, setExpandedLocation] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);

  const isPathActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const toggleLocationExpansion = (locationName: string) => {
    if (expandedLocation === locationName) {
      setExpandedLocation(null);
    } else {
      setExpandedLocation(locationName);
    }
  };

  const DesktopSidebar = () => (
    <Sidebar className="hidden lg:block h-screen sticky top-0 left-0">
      <SidebarContent>
        <div className="p-4 mb-4">
          <Link href="/" title="Uganda Escorts - Hex Escorts">
            <Logo textSize="xl" />
          </Link>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <div key={item.title}>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={!item.isEditAction && isPathActive(item.path)}
                      onClick={(e) => {
                        if (item.isEditAction) {
                          e.preventDefault();
                          setIsPasscodeModalOpen(true);
                          return;
                        }
                        if (item.title === "Locations") {
                          setIsLocationExpanded(!isLocationExpanded);
                        }
                      }}
                    >
                      {item.isEditAction ? (
                        <button
                          type="button"
                          className="flex items-center w-full text-left font-medium text-pink-400 hover:text-pink-300 transition-colors"
                        >
                          <item.icon className="mr-2 h-4 w-4 text-pink-400" />
                          <span>{item.title}</span>
                        </button>
                      ) : item.title === "Locations" ? (
                        <div className="flex items-center w-full">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link href={item.path} className="flex items-center w-full">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {item.children && isLocationExpanded && (
                    <div className="ml-6 space-y-1 mt-1">
                      {item.children.map((child) => (
                        <div key={child.name}>
                          {child.hasSubmenu ? (
                            <div className="space-y-1">
                              <div 
                               className="flex items-center cursor-pointer text-sm py-1 hover:text-primary"
                                onClick={() => toggleLocationExpansion(child.name)}
                              >
                                {expandedLocation === child.name ? 
                                  <ChevronDown className="h-3 w-3 mr-1 text-primary" /> : 
                                  <ChevronRight className="h-3 w-3 mr-1" />
                                }
                                <span className={expandedLocation === child.name ? "text-primary" : ""}>{child.name}</span>
                              </div>
                              
                              {expandedLocation === child.name && child.submenu && (
                                <div className="ml-4 space-y-1">
                                  {child.submenu.map((area) => (
                                    <Link 
                                      key={area} 
                                      href={`/escorts-in/kampala/${area.toLowerCase().replace(/ /g, '-')}`}
                                      className="block text-xs py-1 hover:text-primary"
                                    >
                                      {area}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild isActive={isPathActive(child.path)}>
                                <Link href={child.path}>{child.name}</Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom Actions: Live Cams & Telegram */}
        <div className="p-4 mt-auto border-t border-gray-800 space-y-2.5">
          {/* Live Cams Button - Golden Nude Trends Theme */}
          <a
            href="https://nudetrends.afrozex.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_22px_rgba(245,158,11,0.7)] transition-all duration-300 hover:scale-[1.02] border border-amber-300/40"
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] tracking-widest uppercase text-amber-950 font-black flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-700 fill-red-700 inline" />
                  Nude Trends
                </span>
                <span className="text-sm font-black tracking-tight text-black drop-shadow-sm">
                  Live Cams &amp; Leaks
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-black text-amber-300 uppercase tracking-wider border border-amber-400/50 shadow-sm animate-pulse">
              LIVE
            </span>
          </a>

          {/* Telegram Button */}
          <a
            href="https://t.me/+yX6mljCz8to2ODE0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white shadow-lg shadow-[#24A1DE]/20 transition-all text-sm font-semibold"
          >
            <Send className="h-4 w-4" />
            Join Telegram Group
          </a>
        </div>
      </SidebarContent>
    </Sidebar>
  );

  const MobileSidebar = () => (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b flex items-center justify-between p-4">
      <Link href="/" title="Uganda Escorts - Hex Escorts">
        <Logo textSize="xl" />
      </Link>
      <div className="flex items-center">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-pink-500/15 border border-pink-500/40 hover:bg-pink-500/25 active:scale-95 transition-all shadow-[0_0_12px_rgba(255,32,121,0.25)] ml-2 flex-shrink-0"
            aria-label="Open menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between items-center pointer-events-none">
              <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
              <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
              <span className="w-full h-[2.5px] rounded-full bg-gradient-to-r from-[#ff2079] via-[#ec4899] to-[#f472b6] shadow-[0_0_6px_rgba(255,32,121,0.7)]" />
            </div>
          </Button>
          <SheetContent side="right" className="w-[280px] sm:w-[350px] bg-background border-l border-gray-800">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <nav className="space-y-2">
                {mainItems.map((item) => (
                  <div key={item.title}>
                    {item.isEditAction ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsPasscodeModalOpen(true);
                        }}
                        className="flex items-center w-full p-2 rounded-md hover:bg-muted text-pink-400 hover:text-pink-300 font-semibold text-left transition-colors"
                      >
                        <item.icon className="mr-2 h-5 w-5 text-pink-400" />
                        <span>{item.title}</span>
                      </button>
                    ) : item.title === "Locations" ? (
                      <>
                        <button
                          onClick={() => setIsLocationExpanded(!isLocationExpanded)}
                          className={cn(
                            "flex items-center w-full p-2 rounded-md",
                            isPathActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                          )}
                        >
                          <item.icon className="mr-2 h-5 w-5" />
                          <span>{item.title}</span>
                        </button>
                        {isLocationExpanded && (
                          <div className="ml-6 space-y-1 mt-1">
                            {locations.map((city) => (
                              <div key={city.name} className="rounded-md">
                                {city.hasSubmenu ? (
                                  <div>
                                    <div 
                                      className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer"
                                      onClick={() => toggleLocationExpansion(city.name)}
                                    >
                                      {expandedLocation === city.name ? 
                                        <ChevronDown className="h-4 w-4 mr-1 text-primary" /> : 
                                        <ChevronRight className="h-4 w-4 mr-1" />
                                      }
                                      <span className={expandedLocation === city.name ? "text-primary" : ""}>
                                        {city.name}
                                      </span>
                                    </div>
                                    
                                    {expandedLocation === city.name && city.submenu && (
                                      <div className="ml-6 space-y-1 mt-1 max-h-[250px] overflow-y-auto">
                                        {city.submenu.map((area) => (
                                          <Link
                                            key={area}
                                            href={`/escorts-in/kampala/${area.toLowerCase().replace(/ /g, '-')}`}
                                            className="block p-1 text-sm hover:text-primary"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                          >
                                            {area}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    href={city.path}
                                    className={cn(
                                      "flex items-center p-2 rounded-md",
                                      isPathActive(city.path) ? "bg-primary/80 text-primary-foreground" : "hover:bg-muted"
                                    )}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {city.name}
                                  </Link>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.path}
                        className={cn(
                          "flex items-center p-2 rounded-md",
                          isPathActive(item.path) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="mr-2 h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Bottom Actions in mobile menu: Live Cams & Telegram */}
              <div className="pt-4 mt-4 border-t border-gray-800 space-y-2.5">
                {/* Live Cams Button - Golden Nude Trends Theme */}
                <a
                  href="https://nudetrends.afrozex.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-400 text-black font-extrabold shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:shadow-[0_0_22px_rgba(245,158,11,0.7)] transition-all duration-300 border border-amber-300/40"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-80"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[10px] tracking-widest uppercase text-amber-950 font-black flex items-center gap-1">
                        <Flame className="w-3 h-3 text-red-700 fill-red-700 inline" />
                        Nude Trends
                      </span>
                      <span className="text-sm font-black tracking-tight text-black drop-shadow-sm">
                        Live Cams &amp; Leaks
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-black text-amber-300 uppercase tracking-wider border border-amber-400/50 shadow-sm animate-pulse">
                    LIVE
                  </span>
                </a>

                {/* Telegram Button */}
                <a
                  href="https://t.me/+yX6mljCz8to2ODE0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg bg-[#24A1DE] hover:bg-[#24A1DE]/90 text-white shadow-lg shadow-[#24A1DE]/20 transition-all text-sm font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Send className="h-5 w-5" />
                  Join our Telegram Group
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
      />
    </>
  );
}
