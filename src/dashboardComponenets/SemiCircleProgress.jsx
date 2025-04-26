function SemiCircleProgress({ spent, budget }) {
  const percentage = Math.min((spent / budget) * 100, 100);
  const radius = 65;
  const stroke = 10;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-[150px] h-[80px]">
      <svg width="150" height="120" viewBox="0 0 150 80">
        {/* Background Arc */}
        <path
          d="M 10 70 A 65 65 0 0 1 140 70"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
        />
        {/* Progress Arc */}
        <path
          d="M 10 70 A 65 65 0 0 1 140 70"
          fill="none"
          stroke="#3b82f6"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
        {/* Left Label - 0 */}
        <text
          x="10"
          y="90"
          fontSize="12"
          fill="#ffffff"
        >
          $0
        </text>
        {/* Right Label - Total Budget */}
        <text
          x="140"
          y="90"
          fontSize="12"
          fill="#ffffff"
          textAnchor="end"
        >
          ${budget}
        </text>
      </svg>

      {/* Inner Labels (centered in arc) */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center text-white">
        <div className="text-sm font-medium mt-5">${spent} spent</div>
        <div className="text-xs">{Math.round(percentage)}%</div>
      </div>
    </div>
  );
}

export default SemiCircleProgress;
