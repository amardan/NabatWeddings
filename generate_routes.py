import os
import re

# Define the routes and their specific SEO metadata
routes = {
    "about": {
        "title": "Meet Elmira Jafari | Bilingual Persian & English Wedding Officiant",
        "description": "Meet Elmira Jafari, an award-nominated journalist offering luxury bilingual Farsi/English wedding ceremonies and Sofreh Aghd in DMV and worldwide.",
    },
    "process": {
        "title": "The Journey to I Do - Our Process | Nabat Persian Weddings",
        "description": "Explore our collaborative process for planning and officiating your custom Persian wedding ceremony, from initial consultation to the wedding day.",
    },
    "experience": {
        "title": "Ceremony Styles & Experience | Nabat Persian Weddings",
        "description": "Bilingual wedding officiating, traditional Sofreh Aghd, and modern custom scripts. Based in DMV, serving NYC, California, Florida, and worldwide.",
    },
    "gallery": {
        "title": "Gallery - Persian Wedding Photos & Videos | Nabat Persian Weddings",
        "description": "View photos and videos of beautiful Persian wedding ceremonies and Sofreh Aghd officiated by Elmira Jafari.",
    },
    "love-stories": {
        "title": "Love Stories & Client Reviews | Nabat Persian Weddings",
        "description": "Read testimonials and client reviews from couples who experienced luxury, bilingual, custom Persian wedding ceremonies with Elmira Jafari.",
    },
    "faq": {
        "title": "Frequently Asked Questions | Nabat Persian Weddings",
        "description": "Find answers to common questions about bilingual wedding ceremonies, traditional Sofreh Aghd, custom scripts, travel fees, and more.",
    },
    "contact": {
        "title": "Inquire & Start Your Journey | Nabat Persian Weddings",
        "description": "Connect with Elmira Jafari to book your luxury bilingual Persian wedding officiant. Available in D.C., Maryland, Virginia, California, Florida, and worldwide.",
    }
}

def generate_subpages():
    # Read the main index.html file
    with open("index.html", "r", encoding="utf-8") as f:
        original_html = f.read()

    print("Generating subpage routes...")
    
    for route, meta in routes.items():
        # Create folder if it doesn't exist
        os.makedirs(route, exist_ok=True)
        
        # Target canonical url (trailing slash matches the URL GitHub Pages
        # actually serves with a 200; /about 301-redirects to /about/)
        canonical_url = f"https://www.nabatpersianweddings.com/{route}/"
        
        # Perform SEO replacements
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
        
        # Write to subpage index.html
        subpage_path = os.path.join(route, "index.html")
        with open(subpage_path, "w", encoding="utf-8") as f:
            f.write(html)
            
        print(f"  Generated: {subpage_path} (Canonical: {canonical_url})")

    print("Subpage generation complete!")

if __name__ == "__main__":
    generate_subpages()
