import os
import requests
import zipfile

# Configuration
DATA_URL = "https://physionet.org/content/mimiciii-demo/get-zip/1.4/"
DATA_DIR = "datasets/mimic_iii_demo"
ZIP_PATH = os.path.join(DATA_DIR, "mimic_iii_demo.zip")

def download_data():
    if not os.path.exists(DATA_DIR):
        os.makedirs(DATA_DIR)
        print(f"Created directory: {DATA_DIR}")

    print(f"Downloading MIMIC-III Demo Dataset (13.4 MB)...")
    response = requests.get(DATA_URL, stream=True)
    
    if response.status_code == 200:
        with open(ZIP_PATH, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print("Download complete.")
    else:
        print(f"Failed to download. Status code: {response.status_code}")
        return False

    print("Extracting files...")
    with zipfile.ZipFile(ZIP_PATH, 'r') as zip_ref:
        zip_ref.extractall(DATA_DIR)
    
    # Cleanup zip
    os.remove(ZIP_PATH)
    print(f"Extraction complete. Data available in: {DATA_DIR}")
    return True

if __name__ == "__main__":
    download_data()
