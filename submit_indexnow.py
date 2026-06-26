#!/usr/bin/env python3
import json
import urllib.request
import xml.etree.ElementTree as ET
import sys
import os

def submit_to_indexnow():
    sitemap_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sitemap.xml')
    if not os.path.exists(sitemap_path):
        print(f"Error: {sitemap_path} does not exist.")
        sys.exit(1)

    # Parse sitemap.xml to extract URLs
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
    except Exception as e:
        print(f"Error parsing sitemap.xml: {e}")
        sys.exit(1)

    # XML Namespaces are typically present in sitemap.xml
    # Check sitemap namespace, e.g., {http://www.sitemaps.org/schemas/sitemap/0.9}
    namespaces = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = []
    for loc in root.findall('.//ns:loc', namespaces):
        if loc.text:
            urls.append(loc.text.strip())

    if not urls:
        # Fallback without namespace in case XML format differs
        for loc in root.findall('.//loc'):
            if loc.text:
                urls.append(loc.text.strip())

    if not urls:
        print("No URLs found in sitemap.xml.")
        sys.exit(1)

    print(f"Found {len(urls)} URLs in sitemap.xml.")

    host = "www.nabatpersianweddings.com"
    key = "7410dff99f15c1b9edc47c360576971a"
    key_location = f"https://{host}/{key}.txt"

    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls
    }

    url = "https://api.indexnow.org/indexnow"
    data = json.dumps(payload).encode('utf-8')
    
    req = urllib.request.Request(
        url,
        data=data,
        headers={'Content-Type': 'application/json; charset=utf-8'},
        method='POST'
    )

    print("Submitting URLs to IndexNow...")
    try:
        with urllib.request.urlopen(req) as response:
            status_code = response.getcode()
            response_text = response.read().decode('utf-8')
            print(f"Success! HTTP Status: {status_code}")
            if response_text:
                print(f"Response: {response_text}")
    except urllib.error.HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        try:
            print(e.read().decode('utf-8'))
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"Connection Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    submit_to_indexnow()
