import type { CharacterId } from '../game/types';
import type { CharacterMood } from '../game/characterBeats';

type Props = { character: CharacterId; mood: CharacterMood; className?: string };

const LOOKS: Record<CharacterId, { label: string; glow: string; skin: string; hair: string; hairLight: string; coat: string; trim: string }> = {
  mara: { label: 'Mara Venn', glow: '#d7a65e', skin: '#bf9478', hair: '#1d252b', hairLight: '#d2c6ac', coat: '#243a43', trim: '#d5ad69' },
  ilya: { label: 'Ilya Sen', glow: '#ba7778', skin: '#a96f56', hair: '#1e2428', hairLight: '#6b4e43', coat: '#352c31', trim: '#c77c70' },
  vale: { label: 'Soren Vale', glow: '#9aafba', skin: '#bc9c83', hair: '#7d8588', hairLight: '#d8dcda', coat: '#29343b', trim: '#b4c5c8' },
  elias: { label: 'Elias Rook', glow: '#6caeb9', skin: '#bb8e70', hair: '#4d382d', hairLight: '#9b7557', coat: '#1d343d', trim: '#6eb8c2' },
  nadia: { label: 'Nadia Quill', glow: '#a1a7c9', skin: '#a8755a', hair: '#d1d0c5', hairLight: '#f2ead8', coat: '#323143', trim: '#b3a4d7' },
  jorel: { label: 'Jorel Sen', glow: '#7b9a87', skin: '#a87557', hair: '#22292a', hairLight: '#6c7770', coat: '#253b38', trim: '#90b49a' },
};

function eyebrows(mood: CharacterMood) {
  switch (mood) {
    case 'angry': return <><path d="M57 75 L75 81" /><path d="M102 81 L120 75" /></>;
    case 'shocked': return <><path d="M57 72 Q66 65 76 72" /><path d="M101 72 Q111 65 120 72" /></>;
    case 'weary': return <><path d="M57 78 L75 80" /><path d="M102 80 L120 78" /></>;
    case 'hopeful': return <><path d="M57 76 Q66 70 76 76" /><path d="M101 76 Q111 70 120 76" /></>;
    case 'wary': return <><path d="M57 75 L75 79" /><path d="M102 78 L120 74" /></>;
    default: return <><path d="M57 77 Q66 73 76 76" /><path d="M101 76 Q111 73 120 77" /></>;
  }
}

function mouth(mood: CharacterMood) {
  if (mood === 'hopeful' || mood === 'steady') return <path d="M75 119 Q89 129 103 119" />;
  if (mood === 'angry' || mood === 'determined') return <path d="M75 122 Q89 119 103 122" />;
  if (mood === 'shocked') return <ellipse cx="89" cy="122" rx="5.5" ry="7" />;
  if (mood === 'weary' || mood === 'concerned') return <path d="M75 124 Q89 117 103 124" />;
  return <path d="M77 122 Q89 126 101 122" />;
}

export default function CharacterPortrait({ character, mood, className = '' }: Props) {
  const look = LOOKS[character];
  const suffix = `portrait-${character}`;
  const isMara = character === 'mara';
  const isIlya = character === 'ilya';
  const isVale = character === 'vale';
  const isElias = character === 'elias';
  const isNadia = character === 'nadia';
  const isJorel = character === 'jorel';

  return (
    <svg className={`character-portrait-art ${className}`} viewBox="0 0 180 210" role="img" aria-label={`${look.label}, ${mood} expression`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${suffix}-back`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={look.glow} stopOpacity=".55"/><stop offset=".55" stopColor="#172b36"/><stop offset="1" stopColor="#08131c"/></linearGradient>
        <linearGradient id={`${suffix}-skin`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={look.skin}/><stop offset="1" stopColor="#765346"/></linearGradient>
        <linearGradient id={`${suffix}-coat`} x1="0" y1="0" x2="1" y2="1"><stop stopColor={look.coat}/><stop offset="1" stopColor="#101c25"/></linearGradient>
        <clipPath id={`${suffix}-clip`}><rect width="180" height="210" rx="6" /></clipPath>
      </defs>
      <g clipPath={`url(#${suffix}-clip)`}>
        <rect width="180" height="210" fill={`url(#${suffix}-back)`} />
        <circle cx="134" cy="35" r="42" fill={look.glow} opacity=".16" />
        <circle cx="134" cy="35" r="28" fill="none" stroke={look.glow} strokeOpacity=".2" />
        <path d="M0 143 L33 108 55 131 78 97 102 126 128 91 180 145 V210 H0Z" fill="#07131c" opacity=".62" />
        <path d="M18 210 Q19 173 41 159 L65 147 112 147 140 162 Q161 178 163 210Z" fill={`url(#${suffix}-coat)`} />
        <path d="M68 140 L67 164 Q88 181 111 162 L108 137Z" fill={`url(#${suffix}-skin)`} />
        <path d="M62 151 L88 177 116 150 127 210 48 210Z" fill={look.trim} opacity=".85" />
        <path d="M75 157 L88 174 101 157 110 210 66 210Z" fill="#101c25" />
        {isMara && <path d="M40 91 Q28 45 65 24 Q103 4 129 35 Q149 58 135 111 L123 148 48 148Z" fill={look.hair} />}
        {isIlya && <path d="M45 90 Q31 53 52 27 Q79 4 111 19 Q141 32 136 82 L124 105 48 106Z" fill={look.hair} />}
        {isVale && <path d="M46 82 Q34 39 61 25 Q88 10 116 24 Q143 42 132 82 L119 95 51 95Z" fill={look.hair} />}
        {isElias && <path d="M41 92 Q30 48 50 30 Q53 16 69 20 Q81 6 94 18 Q111 8 124 28 Q146 38 135 91 L122 107 49 107Z" fill={look.hair} />}
        {isNadia && <path d="M43 96 Q25 53 44 28 Q59 12 75 18 Q93 5 111 21 Q143 28 137 76 L131 151 115 162 48 151Z" fill={look.hair} />}
        {isJorel && <path d="M43 89 Q29 55 49 28 Q69 8 106 20 Q139 34 136 77 L124 100 49 101Z" fill={look.hair} />}
        <ellipse cx="49" cy="96" rx="7" ry="12" fill={`url(#${suffix}-skin)`} />
        <ellipse cx="129" cy="96" rx="7" ry="12" fill={`url(#${suffix}-skin)`} />
        <path d="M49 64 Q52 40 72 34 Q94 25 115 42 Q128 53 126 85 L118 116 Q109 139 89 142 Q69 138 60 118 L51 89Z" fill={`url(#${suffix}-skin)`} />
        <path d="M50 79 Q49 47 72 38 Q101 26 121 48 L116 62 Q96 52 84 57 Q69 62 59 79 L55 98Z" fill={look.hair} />
        {isMara && <><path d="M114 43 Q131 58 125 96 L117 118 112 84 102 61Z" fill={look.hair} /><path d="M62 47 Q73 25 86 31" fill="none" stroke={look.hairLight} strokeWidth="4" strokeLinecap="round" /></>}
        {isIlya && <><path d="M50 62 Q39 79 43 103 L53 125 60 84Z" fill={look.hair} /><path d="M48 49 Q72 15 109 36" fill="none" stroke={look.hairLight} strokeOpacity=".5" strokeWidth="3" /></>}
        {isVale && <><path d="M53 43 Q88 16 120 43 L117 55 Q88 43 56 55Z" fill={look.hairLight} opacity=".8" /><path d="M48 89 L55 79 57 113 66 132 50 121Z" fill={look.hair} /></>}
        {isElias && <><path d="M47 58 Q39 45 55 31 L66 34 59 63Z" fill={look.hairLight} opacity=".65" /><path d="M119 59 L137 39 132 72 123 84Z" fill={look.hair} /><path d="M61 119 Q89 147 117 119 L111 139 Q89 158 68 138Z" fill={look.hair} opacity=".9" /></>}
        {isNadia && <><path d="M49 40 Q36 65 47 117 L61 145 66 102 59 63Z" fill={look.hairLight} /><path d="M117 39 Q139 62 130 113 L117 145 112 100 121 63Z" fill={look.hairLight} /><path d="M48 49 Q88 20 124 48" fill="none" stroke="#f7f0df" strokeWidth="3" /></>}
        {isJorel && <><path d="M49 53 Q44 39 62 28 L55 63Z" fill={look.hairLight} opacity=".35" /><path d="M58 113 Q88 137 119 110 L113 137 Q87 161 66 137Z" fill={look.hair} /></>}
        <g fill="none" stroke="#3b2925" strokeWidth="2.5" strokeLinecap="round">{eyebrows(mood)}</g>
        <g fill="#101b20"><ellipse cx="67" cy="91" rx="5.1" ry={mood === 'weary' ? 2.7 : 3.7} /><ellipse cx="110" cy="91" rx="5.1" ry={mood === 'weary' ? 2.7 : 3.7} /></g>
        <g fill="#e8eeea" opacity=".85"><circle cx="68" cy="90" r="1.1"/><circle cx="111" cy="90" r="1.1"/></g>
        <path d="M89 93 L84 110 Q88 114 94 110" fill="none" stroke="#744e41" strokeWidth="2" strokeLinecap="round" />
        <g fill="none" stroke={mood === 'angry' ? '#3a2423' : '#6f463b'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">{mouth(mood)}</g>
        {isVale && <path d="M74 132 Q89 140 104 132" stroke="#57616a" strokeWidth="4" strokeLinecap="round" fill="none" />}
        {isElias && <g fill="none" stroke="#9db6bc" strokeWidth="2.4"><rect x="56" y="82" width="25" height="18" rx="6"/><rect x="97" y="82" width="25" height="18" rx="6"/><path d="M81 88 H97"/></g>}
        {isNadia && <g fill="none" stroke="#c5c7cd" strokeWidth="2"><path d="M54 88 Q66 79 80 86 L78 99 Q65 105 57 98Z"/><path d="M98 86 Q112 79 124 88 L121 98 Q109 105 100 99Z"/><path d="M80 89 L98 89"/></g>}
        <path d="M55 146 L46 171 65 182 77 158 M122 146 L133 171 114 183 102 158" stroke={look.trim} strokeWidth="2" strokeOpacity=".5" fill="none" />
        {isMara && <><path d="M42 173 L59 159 70 210 H22Z" fill="#172a34"/><path d="M138 173 L119 159 108 210 H158Z" fill="#172a34"/><circle cx="124" cy="174" r="4" fill={look.trim}/></>}
        {isIlya && <path d="M36 166 Q60 175 70 158 L76 210 H26Z" fill="#8a5554" opacity=".9" />}
        {isVale && <><path d="M31 167 L55 156 68 210 H15Z" fill="#172630"/><path d="M143 167 L120 156 108 210 H165Z" fill="#172630"/><path d="M89 177 L89 203" stroke={look.trim} strokeWidth="3"/><circle cx="89" cy="184" r="5" fill={look.trim}/></>}
        {isElias && <><path d="M39 165 L62 155 76 210 H25Z" fill="#152831"/><path d="M140 165 L116 155 103 210 H155Z" fill="#152831"/><path d="M108 173 L126 190" stroke={look.trim} strokeWidth="3"/><circle cx="127" cy="191" r="4" fill={look.trim}/></>}
        {isNadia && <><path d="M38 162 L60 154 77 210 H21Z" fill="#25263a"/><path d="M141 162 L118 154 102 210 H159Z" fill="#25263a"/><path d="M54 181 L69 195 M124 181 L109 195" stroke={look.trim} strokeWidth="2"/></>}
        {isJorel && <><path d="M34 164 L60 153 76 210 H18Z" fill="#172e2b"/><path d="M144 164 L119 153 103 210 H161Z" fill="#172e2b"/><path d="M120 174 L134 186" stroke={look.trim} strokeWidth="3"/><circle cx="134" cy="187" r="4" fill={look.trim}/></>}
        <path d="M8 25 H32 M8 25 V49 M172 161 V185 M148 185 H172" stroke={look.glow} strokeOpacity=".6" strokeWidth="1" fill="none" />
        <g fill="#d6e8e8" opacity=".55"><circle cx="23" cy="67" r="1.3"/><circle cx="151" cy="57" r="1.1"/><circle cx="25" cy="132" r="1.2"/><circle cx="151" cy="121" r="1.4"/><circle cx="37" cy="28" r="1"/><circle cx="145" cy="23" r="1.3"/></g>
        <rect x=".5" y=".5" width="179" height="209" fill="none" stroke={look.glow} strokeOpacity=".7" />
      </g>
    </svg>
  );
}
