import Modal from "@/app/components/ui/Modal";
import { EditorComponents } from "@/lib/componentOptimization";
import { Resume } from "@/store/useResumeStore";
import { FaDownload } from "react-icons/fa";

const ReactJsonView = EditorComponents.JsonViewer;

interface JsonModalProps {
    isJsonModalOpen: boolean;
    closeJsonModal: () => void;
    handleDownloadJson: () => void;
    activeResume: Resume;
    t: (key: string) => string;
}

export default function JsonModal({ isJsonModalOpen, closeJsonModal, handleDownloadJson, activeResume, t }: JsonModalProps) {
    return (
        <Modal
            isOpen={isJsonModalOpen} 
            onClose={closeJsonModal}
            title={t('mobileEdit.jsonData')}
        >
            <div className="relative">
                <button
                    onClick={handleDownloadJson}
                    className="absolute top-3 right-3 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Download JSON file"
                >
                    <FaDownload />
                </button>
                <pre className="text-sm bg-white p-4 rounded-md overflow-x-auto h-[80vh]">
                    {activeResume && <ReactJsonView src={activeResume} displayDataTypes={false} />}
                </pre>
            </div>
        </Modal>
    );
}
