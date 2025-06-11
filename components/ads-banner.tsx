'use client'
import React from "react";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
}

const AdsBanner= ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
  }: AdBannerTypes) =>  {
    React.useEffect(() => {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (error:any) {
        console.log(error.message);
      }
   
  }, []);

  return (
    <ins className="adsbygoogle"
        style={{display: 'block'}}
        data-ad-client="ca-pub-6983643349322034"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
        ></ins>
  );
}

export { AdsBanner }