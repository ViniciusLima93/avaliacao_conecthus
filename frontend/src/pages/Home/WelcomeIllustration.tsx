import { useTheme } from 'styled-components';

/** Ilustração decorativa: cadeado (WenLock), lâmpada de ideia e checklist. */
export function WelcomeIllustration() {
  const { colors } = useTheme();

  return (
    <svg
      viewBox="0 0 420 320"
      role="img"
      aria-label="Ilustração de boas-vindas com cadeado, lâmpada e checklist"
      width="100%"
      height="100%"
    >
      {/* chão */}
      <line
        x1="40"
        y1="298"
        x2="380"
        y2="298"
        stroke={colors.navy}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* círculo de fundo */}
      <circle cx="170" cy="178" r="112" fill={colors.navy} />
      <circle
        cx="170"
        cy="178"
        r="112"
        fill="none"
        stroke={colors.white}
        strokeOpacity="0.08"
        strokeWidth="18"
      />

      {/* raios da lâmpada */}
      <g stroke={colors.navy} strokeWidth="2.5" strokeLinecap="round">
        <line x1="300" y1="14" x2="290" y2="34" />
        <line x1="238" y1="48" x2="256" y2="58" />
        <line x1="344" y1="76" x2="362" y2="76" />
        <line x1="332" y1="118" x2="346" y2="130" />
        <line x1="258" y1="118" x2="244" y2="130" />
      </g>

      {/* lâmpada */}
      <circle
        cx="300"
        cy="82"
        r="34"
        fill={colors.white}
        stroke={colors.navy}
        strokeWidth="2.5"
      />
      <circle cx="306" cy="78" r="28" fill={colors.accent} />
      <path
        d="M286 86 q7 -12 14 0 q7 12 14 0"
        fill="none"
        stroke={colors.navy}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="286"
        y="114"
        width="28"
        height="9"
        rx="3"
        fill={colors.accent}
        stroke={colors.navy}
        strokeWidth="2"
      />
      <rect
        x="288"
        y="123"
        width="24"
        height="9"
        rx="3"
        fill={colors.accent}
        stroke={colors.navy}
        strokeWidth="2"
      />

      {/* cadeado */}
      <path
        d="M128 176 v-34 a42 42 0 0 1 84 0 v34"
        fill="none"
        stroke={colors.white}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <rect
        x="104"
        y="170"
        width="132"
        height="112"
        rx="16"
        fill={colors.accent}
        stroke={colors.navy}
        strokeWidth="3"
      />
      <rect
        x="104"
        y="170"
        width="132"
        height="22"
        rx="11"
        fill={colors.white}
        fillOpacity="0.25"
      />
      <circle cx="170" cy="220" r="13" fill={colors.navy} />
      <rect x="164" y="226" width="12" height="28" rx="6" fill={colors.navy} />

      {/* checklist */}
      <g transform="rotate(6 318 222)">
        <rect
          x="262"
          y="160"
          width="112"
          height="136"
          rx="10"
          fill={colors.white}
          stroke={colors.navy}
          strokeWidth="2.5"
        />
        <rect
          x="296"
          y="150"
          width="44"
          height="18"
          rx="6"
          fill={colors.navy}
        />
        {[190, 222, 254].map((y, index) => (
          <g key={y}>
            <rect
              x="278"
              y={y}
              width="18"
              height="18"
              rx="4"
              fill={index < 2 ? colors.accent : colors.white}
              stroke={colors.navy}
              strokeWidth="2"
            />
            {index < 2 && (
              <path
                d={`M282 ${y + 9} l4 4 l7 -8`}
                fill="none"
                stroke={colors.white}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            <line
              x1="306"
              y1={y + 6}
              x2="358"
              y2={y + 6}
              stroke={colors.navy}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="306"
              y1={y + 13}
              x2="342"
              y2={y + 13}
              stroke={colors.navy}
              strokeOpacity="0.35"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
