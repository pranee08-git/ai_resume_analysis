import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FaTrash } from "react-icons/fa";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isWiping, setIsWiping] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    setFiles(files);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleWipeAll = async () => {
    if (!window.confirm("This will permanently delete all resume history. Continue?")) return;

    try {
      setIsWiping(true);

      for (const file of files) {
        await fs.delete(file.path);
      }

      await kv.flush();
      await loadFiles();
    } catch (err) {
      console.error("Wipe failed:", err);
    } finally {
      setIsWiping(false);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 relative min-h-screen">
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Wipe App Data</h2>
        <p className="text-sm text-gray-600">
          Authenticated as: {auth.user?.username}
        </p>
      </div>

      <div className="mb-8">
        <h3 className="font-medium mb-2">Existing Files</h3>
        <div className="flex flex-col gap-2">
          {files.length === 0 && (
            <p className="text-gray-500 text-sm">No resume files found.</p>
          )}

          {files.map((file) => (
            <div
              key={file.id}
              className="flex justify-between bg-gray-100 px-4 py-2 rounded-md"
            >
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 🗑 Floating Wipe Icon — ACTUALLY MOVED DOWN */}
      <button
        onClick={handleWipeAll}
        disabled={isWiping}
        title="Wipe all resume history"
        className="fixed bottom-2 right-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110"
      >
        <FaTrash size={20} />
      </button>
    </div>
  );
};

export default WipeApp;
