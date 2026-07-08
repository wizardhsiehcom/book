import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import time

def get_links(url, domain):
    try:
        r = requests.get(url, timeout=10)
        soup = BeautifulSoup(r.text, 'html.parser')
        links = []
        for a in soup.find_all('a', href=True):
            href = a['href']
            full_url = urllib.parse.urljoin(domain, href)
            links.append(full_url)
        return list(set(links))
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return []

def main():
    base_url = "https://ocw.mit.edu/courses/9-35-perception-spring-2024/"
    domain = "https://ocw.mit.edu"
    
    print(f"Fetching main page {base_url}...")
    main_links = get_links(base_url, domain)
    
    # Find all pages under this course
    pages = [link for link in main_links if link.startswith(base_url)]
    
    print(f"Found {len(pages)} pages to scan for resources.")
    
    resource_links = set()
    for page in pages:
        page_links = get_links(page, domain)
        for link in page_links:
            if '/resources/' in link and link.startswith(base_url):
                resource_links.add(link)
                
    resource_links = list(resource_links)
    print(f"Found {len(resource_links)} unique resource pages.")
    
    out_dir = "data/mit9.35/reference"
    os.makedirs(out_dir, exist_ok=True)
    
    for r_url in resource_links:
        try:
            print(f"Checking resource {r_url}...")
            res = requests.get(r_url, timeout=10)
            s = BeautifulSoup(res.text, 'html.parser')
            # Look for actual files (pdf, zip, mov)
            for a in s.find_all('a', href=True):
                href = a['href']
                if href.lower().endswith('.pdf') or href.lower().endswith('.zip') or href.lower().endswith('.mov'):
                    file_url = urllib.parse.urljoin(domain, href)
                    filename = os.path.basename(urllib.parse.urlparse(file_url).path)
                    
                    # Clean filename if it has an MD5 hash prefix from OCW
                    if '_' in filename:
                        parts = filename.split('_', 1)
                        if len(parts[0]) == 32: # likely an MD5 hash
                            filename = parts[1]
                    
                    filepath = os.path.join(out_dir, filename)
                    if not os.path.exists(filepath):
                        print(f"Downloading {filename}...")
                        f_res = requests.get(file_url, stream=True, timeout=20)
                        if f_res.status_code == 200:
                            with open(filepath, 'wb') as f:
                                for chunk in f_res.iter_content(8192):
                                    f.write(chunk)
                            print(f"Successfully downloaded {filename}.")
                        else:
                            print(f"Failed to download {filename}, status code {f_res.status_code}")
                    else:
                        print(f"{filename} already exists.")
                    break # We only need the first matching link per resource page, as it's the download link.
            time.sleep(0.5) # Be polite to the server
        except Exception as e:
            print(f"Error processing {r_url}: {e}")

if __name__ == '__main__':
    main()
