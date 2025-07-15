import React from "react";

type AdsenseTypes = {
  pId: string;
}
export const AdSense = ({ pId }: AdsenseTypes) => {
  return (
    <script 
              async 
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pId}`}
              crossOrigin="anonymous"
              //strategy='afterInteractive'
              />
  )
}

