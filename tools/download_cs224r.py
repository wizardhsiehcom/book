import os
import requests
from bs4 import BeautifulSoup
import urllib.parse
import re

def download_file(url, folder, filename=None):
    if not filename:
        filename = os.path.basename(urllib.parse.urlparse(url).path)
        if not filename:
            filename = "downloaded_file"
    
    # If the filename does not have an extension, try to guess or just append .pdf if it's arxiv
    if 'arxiv.org/pdf/' in url and not filename.endswith('.pdf'):
        filename += '.pdf'

    filepath = os.path.join(folder, filename)
    if os.path.exists(filepath):
        print(f"Already exists: {filepath}")
        return

    print(f"Downloading {filename} from {url} to {folder}")
    try:
        res = requests.get(url, stream=True, headers={'User-Agent': 'Mozilla/5.0'})
        if res.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in res.iter_content(8192):
                    f.write(chunk)
        else:
            print(f"Failed to download {url}: HTTP {res.status_code}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")

def main():
    base_url = 'https://cs224r.stanford.edu/'
    try:
        r = requests.get(base_url, headers={'User-Agent': 'Mozilla/5.0'})
        r.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch {base_url}: {e}")
        return

    soup = BeautifulSoup(r.text, 'html.parser')
    
    ref_dir = 'data/cs224r/reference'
    hw_dir = 'data/cs224r/assignments'
    os.makedirs(ref_dir, exist_ok=True)
    os.makedirs(hw_dir, exist_ok=True)

    for a in soup.find_all('a', href=True):
        href = a['href']
        text = a.text.strip()
        full_url = urllib.parse.urljoin(base_url, href)
        
        # Papers / PDFs
        if href.endswith('.pdf'):
            folder = hw_dir if 'hw' in href.lower() or 'homework' in href.lower() else ref_dir
            download_file(full_url, folder)
        elif href.endswith('.zip'):
            folder = hw_dir if 'hw' in href.lower() or 'homework' in href.lower() or 'code' in href.lower() else ref_dir
            download_file(full_url, folder)
        elif 'arxiv.org/abs/' in full_url:
            # Convert abs to pdf
            pdf_url = full_url.replace('/abs/', '/pdf/')
            # Try to name it intelligently based on the link text or the arxiv ID
            arxiv_id = full_url.split('/abs/')[-1]
            filename = f"arxiv_{arxiv_id}.pdf"
            # Sanitize text
            safe_text = re.sub(r'[^A-Za-z0-9_\-\.]', '_', text)
            if len(safe_text) > 3:
                filename = f"{safe_text}.pdf"
            download_file(pdf_url, ref_dir, filename)
        elif 'arxiv.org/pdf/' in full_url:
            filename = full_url.split('/')[-1]
            if not filename.endswith('.pdf'):
                filename += '.pdf'
            download_file(full_url, ref_dir, filename)

if __name__ == '__main__':
    main()
