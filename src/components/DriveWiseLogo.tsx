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
      </defs>
      
      {/* Background circle with gradient */}
      <circle cx="256" cy="256" r="240" fill="url(#logoGradient)" />
      
      {/* Outer ring */}
      <circle 
        cx="256" cy="256" r="220" 
        fill="none" 
        stroke="white" 
        strokeWidth="8" 
        opacity="0.2"
      />
      
      {/* Car icon (left side) */}
      <g transform="translate(80, 140)">
        {/* Car body */}
        <path
          d="M10 50 H30 L35 35 H55 L62.5 50 H75 V70 H10 V50 Z"
          fill="white"
          opacity="0.95"
        />

        {/* Car roof */}
        <path
          d="M37.5 35 L45 25 H50 L57.5 35"
          fill="white"
          opacity="0.9"
        />

        {/* Front wheel */}
        <circle cx="25" cy="70" r="11" fill="white" opacity="0.95" />
        <circle cx="25" cy="70" r="6" fill="url(#logoGradient)" />

        {/* Rear wheel */}
        <circle cx="60" cy="70" r="11" fill="white" opacity="0.95" />
        <circle cx="60" cy="70" r="6" fill="url(#logoGradient)" />

        {/* Headlights */}
        <rect x="72.5" y="55" width="4" height="7.5" rx="1" fill="url(#accentGradient)" />
      </g>

      {/* Dollar sign (right side, amber color) */}
      <g transform="translate(360, 256)">
        {/* Dollar symbol */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="120"
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
