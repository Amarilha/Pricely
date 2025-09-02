"use client"

export default function HeroContent() {
  return (
    <main className="flex items-center justify-center min-h-screen w-full">
      <div className="text-center max-w-lg z-20 -mt-60 transform">
        <div
          className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm mb-4 relative"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 left-1 right-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full" />
          <span className="text-white/90 text-xs font-light relative z-10">✨ Nova plataforma de Precificação</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl md:leading-16 tracking-tight font-light text-white mb-4">
          <span className="font-light tracking-tight text-gray-00">O Fim do </span><span className="font-medium italic instrument">Achômetro</span>
          <br />
          <span className="font-light tracking-tight text-gray-100">na Precificação</span>
        </h1>

        {/* Description */}
        <p className="text-xs font-light text-white/70 mb-4 leading-relaxed mx-auto max-w-md">
          A plataforma brasileira que transforma freelancers e agências em negócios prósperos com precificação 
          inteligente e gestão financeira clara.
        </p>

        {/* Buttons 
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="px-8 py-3 rounded-full bg-transparent border border-white/30 text-white font-normal text-xs transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
            Teste Grátis 
          </button>
          <button className="px-8 py-3 rounded-full bg-white text-black font-normal text-xs transition-all duration-200 hover:bg-white/90 cursor-pointer">
            Ver como funciona
          </button>
        </div>
        */}


      </div>
    </main>
  )
};