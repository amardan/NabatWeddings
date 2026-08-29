#!/usr/bin/env python3
import json
import urllib.request
import xml.etree.ElementTree as ET
import sys
import os
import ssl

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

    namespaces = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    
    urls = []
    for loc in root.findall('.//ns:loc', namespaces):
        if loc.text:
            urls.append(loc.text.strip())

    if not urls:
        for loc in root.findall('.//loc'):
            if loc.text:
                urls.append(loc.text.strip())

    if not urls:
        print("No URLs found in sitemap.xml.")
        sys.exit(1)

    print(f"Found {len(urls)} URLs in sitemap.xml.")

    host = "www.nabatpersianweddings.com"
    key = "16aa960c59c842f68f610ee9c4fff643"
    key_location = f"https://{host}/{key}.txt"

    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location,
        "urlList": urls
    }

    endpoints = [
        "https://api.indexnow.org/indexnow",
        "https://www.bing.com/indexnow",
        "https://yandex.com/indexnow"
    ]

    data = json.dumps(payload).encode('utf-8')
    ctx = ssl._create_unverified_context()

    for endpoint in endpoints:
        print(f"\nSubmitting URLs to {endpoint}...")
        req = urllib.request.Request(
            endpoint,
            data=data,
            headers={'Content-Type': 'application/json; charset=utf-8', 'User-Agent': 'NabatWeddings-IndexNow/2.0'},
            method='POST'
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
                status_code = response.getcode()
                response_text = response.read().decode('utf-8')
                print(f"-> Success! HTTP Status: {status_code}")
                if response_text:
                    print(f"   Response: {response_text}")
        except urllib.error.HTTPError as e:
            print(f"-> HTTP Error {e.code}: {e.reason}")
        except Exception as e:
            print(f"-> Connection Error: {e}")

if __name__ == "__main__":
    submit_to_indexnow()
