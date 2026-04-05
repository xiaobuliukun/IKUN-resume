import { Metadata } from "next";
import DashboardSidebar from "./_components/DashboardSidebar";
import metaConfig from "@/constant/metaConfig";

export const metadata: Metadata = metaConfig.Dashboard;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
