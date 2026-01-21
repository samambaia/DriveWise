export function DriveWiseLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="none"
      {...props}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00897B" />
          <stop offset="100%" stopColor="#00695C" />
        </linearGradient>
        <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
        <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2F1" />
          <stop offset="100%" stopColor="#B2DFDB" />
        </linearGradient>
      </defs>

      {/* Background circle with visible border */}
      <circle cx="256" cy="256" r="240" fill="url(#circleGradient)" stroke="url(#logoGradient)" strokeWidth="6" />

      {/* Outer ring */}
      <circle
        cx="256" cy="256" r="220"
        fill="none"
        stroke="url(#logoGradient)"
        strokeWidth="4"
        opacity="0.8"
      />

      {/* Car icon (left side, larger) */}
      <g transform="translate(60, 120)">
        {/* Car body */}
        <path
          d="M15 75 H45 L52.5 52.5 H82.5 L93.75 75 H120 V105 H15 V75 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Car roof */}
        <path
          d="M56.25 52.5 L67.5 37.5 H75 L86.25 52.5"
          fill="white"
          opacity="0.9"
        />

        {/* Front wheel */}
        <circle cx="37.5" cy="105" r="16.5" fill="white" opacity="0.95" />
        <circle cx="37.5" cy="105" r="9" fill="url(#logoGradient)" />

        {/* Rear wheel */}
        <circle cx="90" cy="105" r="16.5" fill="white" opacity="0.95" />
        <circle cx="90" cy="105" r="9" fill="url(#logoGradient)" />

        {/* Headlights */}
        <rect x="108.75" y="82.5" width="6" height="11.25" rx="1.5" fill="url(#accentGradient)" />
      </g>

      {/* Dollar sign (right side, larger) */}
      <g transform="translate(380, 256)">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="160"
          fontWeight="bold"
          fill="url(#accentGradient)"
          fontFamily="Inter, Arial, sans-serif"
        >
          $
        </text>
      </g>

      {/* Progress indicator arc */}
      <path
        d="M 256 80 A 176 176 0 0 1 432 256"
        fill="none"
        stroke="url(#accentGradient)"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DriveWiseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="smallLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00897B" />
          <stop offset="100%" stopColor="#00695C" />
        </linearGradient>
        <linearGradient id="smallAccentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>

      {/* Car silhouette (left side) */}
      <g transform="translate(2, 4)">
        {/* Car body */}
        <path
          d="M2 5 H5 L5.5 3.5 H8.5 L9.5 5 H11 V7 H2 V5 Z"
          fill="currentColor"
        />

        {/* Front wheel */}
        <circle cx="4" cy="7" r="1" fill="currentColor" />

        {/* Rear wheel */}
        <circle cx="9" cy="7" r="1" fill="currentColor" />
      </g>

      {/* Dollar sign (right side) */}
      <text
        x="18"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="10"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="Inter, Arial, sans-serif"
      >
        $
      </text>
    </svg>
  );
}