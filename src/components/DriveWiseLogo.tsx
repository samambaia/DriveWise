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
      
      {/* Car icon */}
      <g transform="translate(120, 120)">
        {/* Car body */}
        <path
          d="M20 100 H60 L70 70 H110 L125 100 H150 V140 H20 V100 Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Car roof */}
        <path
          d="M75 70 L90 50 H100 L115 70"
          fill="white"
          opacity="0.9"
        />
        
        {/* Front wheel */}
        <circle cx="50" cy="140" r="22" fill="white" opacity="0.95" />
        <circle cx="50" cy="140" r="12" fill="url(#logoGradient)" />
        
        {/* Rear wheel */}
        <circle cx="120" cy="140" r="22" fill="white" opacity="0.95" />
        <circle cx="120" cy="140" r="12" fill="url(#logoGradient)" />
        
        {/* Headlights */}
        <rect x="145" y="110" width="8" height="15" rx="2" fill="url(#accentGradient)" />
      </g>
      
      {/* Dollar sign in center */}
      <g transform="translate(256, 256)">
        {/* Dollar symbol */}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="180"
          fontWeight="bold"
          fill="white"
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
      {/* Car silhouette */}
      <path
        d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
        fill="currentColor"
      />
      
      {/* Dollar sign overlay */}
      <text
        x="12"
        y="13"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="8"
        fontWeight="bold"
        fill="white"
        fontFamily="Inter, Arial, sans-serif"
      >
        $
      </text>
    </svg>
  );
}
