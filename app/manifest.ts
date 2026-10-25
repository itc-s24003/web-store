import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Online Store',
    short_name: 'Online Store',
    description: 'モバイルオーダーで注文を簡単に',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        sizes: "192x192",
        src: "/logo_192.png",
        type: "image/png",
      },
      {
        sizes: "512x512",
        src: "/logo_512.png",
        type: "image/png",
      }
    ],
  }
}