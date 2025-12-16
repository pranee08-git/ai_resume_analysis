import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import { FaBriefcase } from "react-icons/fa";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed overview of your resume" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [resumeMeta, setResumeMeta] = useState<any>(null);

  /* 🔐 Auth guard */
  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  /* 📄 Load resume data */
  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);
      setResumeMeta(data);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      setResumeUrl(URL.createObjectURL(pdfBlob));

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;

      setImageUrl(URL.createObjectURL(imageBlob));
      setFeedback(data.feedback);
    };

    loadResume();
  }, [id, fs, kv]);

  /* 🧠 Extract keywords from Job Description */
  const extractKeywordsFromJD = (jd: string) => {
    if (!jd) return "";

    const stopWords = [
      "and", "or", "the", "a", "an", "to", "with", "for",
      "of", "in", "on", "at", "by", "is", "are", "will",
      "be", "as", "this", "that", "you", "we", "our"
    ];

    return jd
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(
        word => word.length > 2 && !stopWords.includes(word)
      )
      .slice(0, 6)
      .join(" ");
  };

  /* 🔍 Naukri navigation (JD-based) */
  const openNaukriJobs = () => {
    const jobTitle =
      resumeMeta?.jobTitle ||
      (feedback as any)?.jobTitle ||
      "";

    const extractedKeywords = extractKeywordsFromJD(jobTitle);

    const role =
      resumeMeta?.role ||
      (feedback as any)?.summary?.suggestedRole ||
      "software developer";

    const location = resumeMeta?.location || "india";

    const finalKeywords = extractedKeywords || role;

    const keywordsSlug = finalKeywords
      .toLowerCase()
      .replace(/\s+/g, "-");

    const locationSlug = location
      .toLowerCase()
      .replace(/\s+/g, "-");

    const url = `https://www.naukri.com/${keywordsSlug}-jobs-in-${locationSlug}`;

    window.open(url, "_blank");
  };

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Resume Preview */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 flex items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="gradient-border h-[90%] w-fit animate-fade-in-scale hover-lift">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl transition-all duration-300"
                  title="resume"
                />
              </a>
            </div>
          )}
        </section>

        {/* Feedback Section */}
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold animate-fade-in-up">
            Resume Review
          </h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-fade-in-up animate-delay-200">
              <Summary feedback={feedback} />

              <ATS
                score={feedback.ATS.score || 0}
                suggestions={feedback.ATS.tips || []}
              />

              {/* Naukri Button */}
              <button
                onClick={openNaukriJobs}
                className="w-fit flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition hover:scale-105"
              >
                <FaBriefcase />
                Find Matching Jobs on Naukri
              </button>

              <Details feedback={feedback} />
            </div>
          ) : (
            <div className="animate-fade-in-scale">
              <img
                src="/images/resume-scan-2.gif"
                className="w-full animate-pulse"
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
