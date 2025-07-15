'use client'
import React from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
  className?: string;
};

const AdsBanner = ({
  dataAdSlot,
  dataAdFormat = "auto",
  dataFullWidthResponsive = true,
  className = "",
}: AdBannerTypes) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const adContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);

    // Carrega o script do AdSense se não estiver presente
    if (!(window as any).adsbygoogle) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6983643349322034';
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    return () => {
      // Limpa os anúncios ao desmontar
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isMounted || !adContainerRef.current) return;

    // Função para carregar o anúncio
    const loadAd = () => {
      try {
        // Limpa o container antes de adicionar novo anúncio
        adContainerRef.current!.innerHTML = '';

        // Cria novo elemento ins
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        ins.style.display = 'block';
        ins.dataset.adClient = 'ca-pub-6983643349322034';
        ins.dataset.adSlot = dataAdSlot;
        ins.dataset.adFormat = dataAdFormat;
        ins.dataset.fullWidthResponsive = dataFullWidthResponsive.toString();

        adContainerRef.current!.appendChild(ins);

        // Carrega o anúncio
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error) {
        console.error("AdSense error:", error);
      }
    };

    loadAd();

    // Se o script ainda não estiver carregado, tenta novamente após um delay
    if (!(window as any).adsbygoogle) {
      const timer = setTimeout(loadAd, 500);
      return () => clearTimeout(timer);
    }
  }, [isMounted, dataAdSlot, dataAdFormat, dataFullWidthResponsive]);

  if (!isMounted) {
    return <div className={`ads-placeholder ${className}`} style={{ minHeight: '90px' }} />;
  }

  return (
    <div 
      className={`ads-container ${className}`} 
      ref={adContainerRef}
      key={`ad-${dataAdSlot}-${Date.now()}`}
    />
  );
};

export { AdsBanner };