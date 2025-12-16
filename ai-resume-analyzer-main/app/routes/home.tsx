import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import Chatbot from "~/components/Chatbot";
import { usePuterStore } from "~/lib/puter";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map(
        (resume) => JSON.parse(resume.value) as Resume
      );

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, [kv]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen relative">
      <Navbar />
      <Chatbot />

      {/* 🗑 Wipe Icon — Above Chatbot */}
      <button
        onClick={() => navigate("/wipe")}
        title="Wipe Resume History"
        className="fixed bottom-2 right-4 z-50 bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition transform hover:scale-110"
      >
        <FaTrash size={20} />
      </button>

      <section className="main-section">
        <div className="page-heading py-16 animate-fade-in-up">
          <h1 className="animate-fade-in-scale">
            Track Your Applications & Resume Ratings
          </h1>

          {!loadingResumes && resumes.length === 0 ? (
            <h2 className="animate-fade-in-up animate-delay-200">
              No resumes found. Upload your first resume to get feedback.
            </h2>
          ) : (
            <h2 className="animate-fade-in-up animate-delay-200">
              Review your submissions and check AI-powered feedback.
            </h2>
          )}
        </div>

        {loadingResumes && (
          <div className="flex flex-col items-center justify-center animate-fade-in-scale">
            <div className="relative">
              <img
                src="/images/resume-scan-2.gif"
                className="w-[200px] animate-pulse"
              />
            </div>
            <p className="text-lg text-gray-600 mt-4 animate-pulse">
              Analyzing your resume...
            </p>
            <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full animate-progress"></div>
            </div>
          </div>
        )}

        {!loadingResumes && resumes.length > 0 && (
          <div className="resumes-section">
            {resumes.map((resume, index) => (
              <div
                key={resume.id}
                className="animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ResumeCard resume={resume} />
              </div>
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4 animate-fade-in-scale animate-delay-300">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold hover-lift"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
