import localFont from "next/font/local";

export const aileron = localFont({
    src: [
        { path: '../fonts/Aileron-BlackItalic.woff2', weight: '1100', style: 'italic' },
        { path: '../fonts/Aileron-BoldItalic.woff2', weight: '1000', style: 'italic' },
        { path: '../fonts/Aileron-HeavyItalic.woff2', weight: '900', style: 'italic' },
        { path: '../fonts/Aileron-SemiBoldItalic.woff2', weight: '600', style: 'italic' },
        { path: '../fonts/Aileron-Italic.woff2', weight: '500', style: 'italic' },
        { path: '../fonts/Aileron-ThinItalic.woff2', weight: '100', style: 'italic' },
        { path: '../fonts/Aileron-LightItalic.woff2', weight: '300', style: 'italic' },
        { path: '../fonts/Aileron-UltraLightItalic.woff2', weight: '200', style: 'italic' },

        { path: '../fonts/Aileron-Black.woff2', weight: '1100', style: 'normal' },
        { path: '../fonts/Aileron-Heavy.woff2', weight: '1000', style: 'normal' },
        { path: '../fonts/Aileron-Bold.woff2', weight: '900', style: 'normal' },
        { path: '../fonts/Aileron-Light.woff2', weight: '300', style: 'normal' },
        { path: '../fonts/Aileron-Regular.woff2', weight: '500', style: 'normal' },
        { path: '../fonts/Aileron-SemiBold.woff2', weight: '600', style: 'normal' },
        { path: '../fonts/Aileron-Thin.woff2', weight: '100', style: 'normal' },
        { path: '../fonts/Aileron-UltraLight.woff2', weight: '200', style: 'normal' },
    ],
    variable: "--font-aileron",
})