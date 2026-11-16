// Chef Hut: uma pizza com corpo, boina de chef e avental. O rosto é a própria pizza.
// `busto` mostra só cabeça e ombros (cabeçalho do chat); `animar` liga o aceno e o piscar.
export default function ChefAvatar({ busto = false, animar = true, className = '', ...rest }) {
  return (
    <svg
      className={`chef-svg ${animar ? 'chef-anim' : ''} ${className}`}
      viewBox={busto ? '22 0 76 104' : '0 0 120 170'}
      role="img"
      aria-label="Chef Hut, uma pizza com boina e avental de chef"
      {...rest}
    >
      {!busto && <ellipse cx="60" cy="165" rx="26" ry="4" fill="rgba(0,0,0,.2)" />}

      {!busto && (
        <g>
          <rect x="46" y="136" width="11" height="20" rx="4" fill="#3a3a3a" />
          <rect x="63" y="136" width="11" height="20" rx="4" fill="#3a3a3a" />
          <ellipse cx="50" cy="158" rx="10" ry="5" fill="#202020" />
          <ellipse cx="70" cy="158" rx="10" ry="5" fill="#202020" />
        </g>
      )}

      {/* jaleco, avental e braços */}
      <rect x="32" y="90" width="56" height="50" rx="16" fill="#fff" stroke="#d8d8d8" strokeWidth="1.5" />
      <path d="M45 96h30l7 42H38z" fill="#c00000" />
      <path d="M45 96l-3-6M75 96l3-6" stroke="#a00000" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="52" y="120" width="16" height="11" rx="2.5" fill="#a00000" />
      <circle cx="60" cy="108" r="2.2" fill="#fff" />
      <circle cx="60" cy="114" r="2.2" fill="#fff" />

      <path d="M84 100q14 10 6 24" stroke="#d8d8d8" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M84 100q14 10 6 24" stroke="#fff" strokeWidth="11.5" strokeLinecap="round" fill="none" />
      <circle cx="90" cy="126" r="6.5" fill="#fbe3b5" stroke="#e2c18a" strokeWidth="1" />

      <g className="chef-wave" style={{ transformOrigin: '36px 102px', transformBox: 'view-box' }}>
        <path d="M36 102Q20 98 17 82" stroke="#d8d8d8" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M36 102Q20 98 17 82" stroke="#fff" strokeWidth="11.5" strokeLinecap="round" fill="none" />
        <circle cx="17" cy="78" r="6.5" fill="#fbe3b5" stroke="#e2c18a" strokeWidth="1" />
      </g>

      {/* rosto: pizza (borda, molho, queijo e coberturas) */}
      <circle cx="60" cy="62" r="35" fill="#e3a857" stroke="#c98a36" strokeWidth="1.5" />
      <circle cx="60" cy="62" r="30" fill="#d9411e" />
      <circle cx="60" cy="62" r="28" fill="#f7c948" />
      <circle cx="42" cy="46" r="5.5" fill="#b3261e" />
      <circle cx="40.5" cy="44.5" r="1.1" fill="#e8685e" />
      <circle cx="79" cy="50" r="5.5" fill="#b3261e" />
      <circle cx="77.5" cy="48.5" r="1.1" fill="#e8685e" />
      <circle cx="74" cy="78" r="5.5" fill="#b3261e" />
      <circle cx="46" cy="79" r="5" fill="#b3261e" />
      <path d="M58 40l5 3-3 5-5-2z" fill="#3e8e41" />
      <path d="M85 64l5 2-2 5-5-2z" fill="#3e8e41" />
      <circle cx="60" cy="86" r="3.2" fill="none" stroke="#222" strokeWidth="1.8" />

      <g className="chef-olhos">
        <ellipse cx="50" cy="60" rx="5.2" ry="6.4" fill="#fff" />
        <ellipse cx="70" cy="60" rx="5.2" ry="6.4" fill="#fff" />
        <circle cx="51" cy="61" r="3" fill="#202020" />
        <circle cx="71" cy="61" r="3" fill="#202020" />
        <circle cx="52" cy="59.8" r="1" fill="#fff" />
        <circle cx="72" cy="59.8" r="1" fill="#fff" />
      </g>
      <circle cx="43" cy="70" r="4" fill="#ef8a7e" opacity=".55" />
      <circle cx="77" cy="70" r="4" fill="#ef8a7e" opacity=".55" />
      <path d="M50 72q10 10 20 0" stroke="#7a2412" strokeWidth="2.6" strokeLinecap="round" fill="none" />

      {/* boina de chef */}
      <circle cx="44" cy="17" r="12" fill="#fff" stroke="#d8d8d8" strokeWidth="1.5" />
      <circle cx="60" cy="11" r="14" fill="#fff" stroke="#d8d8d8" strokeWidth="1.5" />
      <circle cx="76" cy="17" r="12" fill="#fff" stroke="#d8d8d8" strokeWidth="1.5" />
      <rect x="39" y="19" width="42" height="14" rx="5" fill="#fff" stroke="#d8d8d8" strokeWidth="1.5" />
      <path d="M52 21v10M60 21v10M68 21v10" stroke="#ececec" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="39" y="29" width="42" height="4" rx="2" fill="#c00000" />
    </svg>
  )
}
