import metaConfig from "@/constant/metaConfig";
import { Metadata } from "next";

export const metadata: Metadata = metaConfig.Edit;

export default function EditLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
            {children}
        </div>
    );
}
