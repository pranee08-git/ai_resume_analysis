const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    return (
        <div className="relative w-[100px] h-[100px] animate-fade-in-scale">
            <svg
                height="100%"
                width="100%"
                viewBox="0 0 100 100"
                className="transform -rotate-90 drop-shadow-lg"
            >
                {/* Background circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="#e5e7eb"
                    strokeWidth={stroke}
                    fill="transparent"
                    className="animate-pulse"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id="grad" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FF97AD" />
                        <stop offset="50%" stopColor="#5171FF" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                </defs>
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="url(#grad)"
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="drop-shadow-sm"
                    style={{
                        strokeDashoffset: strokeDashoffset,
                        transition: 'stroke-dashoffset 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        filter: 'drop-shadow(0 0 8px rgba(81, 113, 255, 0.3))'
                    }}
                />
            </svg>

            {/* Score and issues */}
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up animate-delay-500">
                <span className="font-semibold text-sm transition-all duration-1000 relative">
                    {`${score}/100`}
                    <div className="absolute -inset-1 bg-gradient-to-r from-pink-400/20 to-blue-400/20 rounded blur-sm animate-pulse"></div>
                </span>
            </div>
        </div>
    );
};

export default ScoreCircle;
