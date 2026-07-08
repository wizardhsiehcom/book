import os
import requests
from bs4 import BeautifulSoup
import urllib.parse

def main():
    base_url = "https://ocw.mit.edu/courses/mas-531-computational-camera-and-photography-fall-2009/pages/lecture-notes/"
    domain = "https://ocw.mit.edu"
    
    print(f"Fetching {base_url}...")
    r = requests.get(base_url)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    # Find all resource pages on the lecture notes page
    resource_links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if '/resources/' in href:
            resource_links.append(urllib.parse.urljoin(domain, href))
            
    resource_links = list(set(resource_links))
    print(f"Found {len(resource_links)} resource pages.")
    
    out_dir = "data/mas531/reference"
    os.makedirs(out_dir, exist_ok=True)
    
    for r_url in resource_links:
        try:
            print(f"Checking {r_url}...")
            res = requests.get(r_url)
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
                        f_res = requests.get(file_url, stream=True)
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
        except Exception as e:
            print(f"Error processing {r_url}: {e}")

if __name__ == '__main__':
    main()
