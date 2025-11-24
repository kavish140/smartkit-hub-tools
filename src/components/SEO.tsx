import { useEffect, memo } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}

const SEO: React.FC<SEOProps> = memo(({
  title,
  description,
  keywords = "",
  canonical = "",
  ogImage = "https://aismartkit.tech/og-image.png",
  structuredData
}) => {
  useEffect(() => {
    // Update title
    document.title = `${title} | SmartKit.tech`;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.content = content;
    };

    // Update meta tags
    updateMetaTag("description", description);
    if (keywords) updateMetaTag("keywords", keywords);
    
    // Open Graph tags
    updateMetaTag("og:title", `${title} | SmartKit.tech`, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", ogImage, true);
    updateMetaTag("og:url", canonical || window.location.href, true);
    updateMetaTag("og:type", "website", true);
    
    // Twitter tags
    updateMetaTag("twitter:title", `${title} | SmartKit.tech`);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", ogImage);
    updateMetaTag("twitter:card", "summary_large_image");

    // Canonical URL
    if (canonical) {
      let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.rel = "canonical";
        document.head.appendChild(linkElement);
      }
      
      linkElement.href = canonical;
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let scriptElement = document.querySelector('script[type="application/ld+json"][data-page]') as HTMLScriptElement;
      
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.type = "application/ld+json";
        scriptElement.setAttribute("data-page", "true");
        document.head.appendChild(scriptElement);
      }
      
      scriptElement.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function to revert to default on unmount
    return () => {
      document.title = "SmartKit.tech - 30 Free Online Tools | Calculators, Converters & Utilities";
    };
  }, [title, description, keywords, canonical, ogImage, structuredData]);

  return null;
});

SEO.displayName = 'SEO';

export default SEO;
