"use client"

import { useEffect, useState } from "react"

export function AdsBanner() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const isLocalhost = () => {
    if (!isClient) return false
    return window.location.hostname === "localhost" || 
           window.location.hostname === "127.0.0.1"
  }

  if (!isClient) {
    // Return a placeholder during server-side rendering
    return (
      <div className="mt-4 w-full min-h-[90px]">
        <div className="h-[90px] w-full bg-gray-200"></div>
      </div>
    )
  }

  return (
    <div className="relative bg-background">
      <div className="flex flex-col items-center justify-center">
        {isLocalhost() ? (
          <div className="bg-yellow-100 border border-yellow-400 p-4 mb-4 w-full">
            <p className="text-yellow-700 text-sm">[Modo Desenvolvimento]</p>
            <div className="h-[90px] w-full bg-gray-200 flex items-center justify-center">
              Mock de Anúncio (300x250)
            </div>
          </div>
        ) : (
          <div className="mt-4 w-full min-h-[90px]">
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6983643349322034" crossOrigin="anonymous"></script>
            {/* ads */ } 
            <ins className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-6983643349322034"
                data-ad-slot="1469366432"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
          </div>
        )}
      </div>
    </div>
  )
}