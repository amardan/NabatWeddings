import os
import re

# Define the routes and their specific SEO metadata, H1s, and breadcrumb labels
routes = {
    "about": {
        "title": "Meet Elmira Jafari | Bilingual Persian & English Wedding Officiant",
        "description": "Meet Elmira Jafari, an award-nominated journalist offering luxury bilingual Farsi/English wedding ceremonies and Sofreh Aghd in DMV and worldwide.",
        "h1": "About Elmira Jafari",
        "breadcrumb_name": "About Elmira",
    },
    "process": {
        "title": "The Journey to I Do - Our Process | Nabat Persian Weddings",
        "description": "Explore our collaborative process for planning and officiating your custom Persian wedding ceremony, from initial consultation to the wedding day.",
        "h1": "The Journey to I Do",
        "breadcrumb_name": "The Process",
    },
    "experience": {
        "title": "Ceremony Styles & Experience | Nabat Persian Weddings",
        "description": "Bilingual wedding officiating, traditional Sofreh Aghd, and modern custom scripts. Based in DMV, serving NYC, California, Florida, and worldwide.",
        "h1": "Ceremony Styles & Experience",
        "breadcrumb_name": "Ceremony Styles",
    },
    "gallery": {
        "title": "Gallery - Persian Wedding Photos & Videos | Nabat Persian Weddings",
        "description": "View photos and videos of beautiful Persian wedding ceremonies and Sofreh Aghd officiated by Elmira Jafari.",
        "h1": "Persian Wedding Gallery",
        "breadcrumb_name": "Gallery",
    },
    "love-stories": {
        "title": "Love Stories & Client Reviews | Nabat Persian Weddings",
        "description": "Read testimonials and client reviews from couples who experienced luxury, bilingual, custom Persian wedding ceremonies with Elmira Jafari.",
        "h1": "Love Stories & Client Reviews",
        "breadcrumb_name": "Love Stories",
    },
    "faq": {
        "title": "Frequently Asked Questions | Nabat Persian Weddings",
        "description": "Find answers to common questions about bilingual wedding ceremonies, traditional Sofreh Aghd, custom scripts, travel fees, and more.",
        "h1": "Frequently Asked Questions",
        "breadcrumb_name": "FAQ",
    },
    "contact": {
        "title": "Inquire & Start Your Journey | Nabat Persian Weddings",
        "description": "Connect with Elmira Jafari to book your luxury bilingual Persian wedding officiant. Available in D.C., Maryland, Virginia, California, Florida, and worldwide.",
        "h1": "Inquire & Connect with Elmira",
        "breadcrumb_name": "Inquire",
    }
}

def generate_subpages():
    with open("index.html", "r", encoding="utf-8") as f:
        original_html = f.read()

    print("Generating subpage routes...")
    
    for route, meta in routes.items():
        os.makedirs(route, exist_ok=True)
        
        canonical_url = f"https://www.nabatpersianweddings.com/{route}/"
        
        html = original_html
        
        # Replace title tag
        html = re.sub(
            r'<title>.*?</title>',
            f'<title>{meta["title"]}</title>',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace meta description tag
        html = re.sub(
            r'<meta\s+name="description"\s+content=".*?">',
            f'<meta name="description" content="{meta["description"]}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace canonical link tag
        html = re.sub(
            r'<link\s+rel="canonical"\s+href=".*?">',
            f'<link rel="canonical" href="{canonical_url}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Open Graph URL tag
        html = re.sub(
            r'<meta\s+property="og:url"\s+content=".*?">',
            f'<meta property="og:url" content="{canonical_url}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Open Graph Title tag
        html = re.sub(
            r'<meta\s+property="og:title"\s+content=".*?">',
            f'<meta property="og:title" content="{meta["title"]}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Open Graph Description tag
        html = re.sub(
            r'<meta\s+property="og:description"\s+content=".*?">',
            f'<meta property="og:description" content="{meta["description"]}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Twitter URL tag
        html = re.sub(
            r'<meta\s+property="twitter:url"\s+content=".*?">',
            f'<meta property="twitter:url" content="{canonical_url}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Twitter Title tag
        html = re.sub(
            r'<meta\s+property="twitter:title"\s+content=".*?">',
            f'<meta property="twitter:title" content="{meta["title"]}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace Twitter Description tag
        html = re.sub(
            r'<meta\s+property="twitter:description"\s+content=".*?">',
            f'<meta property="twitter:description" content="{meta["description"]}">',
            html,
            flags=re.IGNORECASE
        )
        
        # Replace hero H1 tag for subpages
        html = re.sub(
            r'<h1>Nabat Persian Weddings</h1>',
            f'<h1>{meta["h1"]}</h1>',
            html,
            count=1
        )
        
        # Build tailored 2-item BreadcrumbList schema for subpages
        subpage_breadcrumb_schema = f'''<script type="application/ld+json">
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.nabatpersianweddings.com/"
        }},
        {{
          "@type": "ListItem",
          "position": 2,
          "name": "{meta['breadcrumb_name']}",
          "item": "{canonical_url}"
        }}
      ]
    }}
    </script>'''

        # Replace 10-item BreadcrumbList schema with tailored 2-item subpage BreadcrumbList schema
        html = re.sub(
            r'<script type="application/ld\+json">\s*\{\s*"@context": "https://schema.org",\s*"@type": "BreadcrumbList",[\s\S]*?</script>',
            subpage_breadcrumb_schema,
            html,
            count=1
        )
        
        # Safely add class="active" ONLY to the matching link inside <nav id="mobile-nav" class="desktop-nav">
        nav_pattern = r'(<nav id="mobile-nav" class="desktop-nav">[\s\S]*?)</nav>'
        def set_active_nav_link(match):
            nav_content = match.group(1)
            target_href = f'href="/{route}/"'
            active_href = f'href="/{route}/" class="active"'
            return nav_content.replace(target_href, active_href) + '</nav>'
            
        html = re.sub(nav_pattern, set_active_nav_link, html)
        
        # Write to subpage index.html
        subpage_path = os.path.join(route, "index.html")
        with open(subpage_path, "w", encoding="utf-8") as f:
            f.write(html)
            
        print(f"  Generated: {subpage_path} (Canonical: {canonical_url})")

    print("Subpage generation complete!")

if __name__ == "__main__":
    generate_subpages()
