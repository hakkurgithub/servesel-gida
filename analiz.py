#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import re
from datetime import datetime

# --- KONFİGÜRASYON ---
MAX_FILE_SIZE_MB = 10
MAX_PREVIEW_LINES = 5
IGNORE_DIRS = {
    'node_modules', 'vendor', '.git', '.idea', '.vscode', 
    '__pycache__', 'dist', 'build', 'coverage', '.next', '.nuxt'
}
IGNORE_FILES = {
    'package-lock.json', 'yarn.lock', 'composer.lock', 
    '.DS_Store', 'Thumbs.db'
}
BINARY_EXTENSIONS = {
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', 
    '.exe', '.dll', '.so', '.dylib', '.zip', '.tar', '.gz', 
    '.mp4', '.mp3', '.woff', '.woff2', '.ttf', '.eot'
}

# --- RENKLER (ANSI) ---
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Windows CMD uyumluluğu için renkleri temizle (Eğer desteklenmiyorsa)
if os.name == 'nt':
    os.system('color')

class ProjectScanner:
    def __init__(self, root_path):
        self.root_path = os.path.abspath(root_path)
        self.report_data = {
            "root": self.root_path,
            "scan_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "structure": [],
            "stats": {"files": 0, "dirs": 0, "lines": 0},
            "tech_stack": {"frameworks": [], "languages": set(), "databases": []},
            "warnings": []
        }
        self.project_type = "Bilinmiyor"

    def is_binary(self, file_path):
        """Dosyanın binary olup olmadığını ilk 512 byte'a bakarak anlar."""
        try:
            with open(file_path, 'rb') as f:
                chunk = f.read(512)
                if b'\0' in chunk:
                    return True
                # Uzantı kontrolü de yapalım
                _, ext = os.path.splitext(file_path)
                if ext.lower() in BINARY_EXTENSIONS:
                    return True
        except:
            return True
        return False

    def get_file_summary(self, file_path):
        """Dosya içeriğini okur, satır sayısını ve önemli başlıkları çeker."""
        summary = {"lines": 0, "preview": [], "type": "text"}
        
        # Boyut kontrolü
        size_mb = os.path.getsize(file_path) / (1024 * 1024)
        if size_mb > MAX_FILE_SIZE_MB:
            summary["type"] = "large_file (>10MB)"
            return summary

        if self.is_binary(file_path):
            summary["type"] = "binary"
            return summary

        try:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                lines = f.readlines()
                summary["lines"] = len(lines)
                
                # Önemli satırları bul (importlar, fonksiyonlar, başlıklar)
                interesting = []
                for line in lines:
                    line = line.strip()
                    if not line: continue
                    # Basit regex ile "önemli" satırları yakala
                    if re.match(r'^(import|from|class|def|function|const|let|var|package|public|private|#)', line):
                        interesting.append(line[:60] + "..." if len(line)>60 else line)
                    if len(interesting) >= 3: break
                
                summary["preview"] = interesting
        except Exception as e:
            summary["type"] = f"read_error: {str(e)}"
        
        return summary

    def scan(self):
        """Tüm klasörü tarar."""
        if not os.path.exists(self.root_path):
            print(f"{Colors.FAIL}HATA: {self.root_path} klasörü bulunamadı!{Colors.ENDC}")
            sys.exit(1)

        print(f"{Colors.CYAN}Tarama başlatılıyor: {self.root_path}...{Colors.ENDC}")

        for root, dirs, files in os.walk(self.root_path):
            # Gizli ve ignore edilen klasörleri atla
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith('.')]
            
            level = root.replace(self.root_path, '').count(os.sep)
            indent = ' ' * 4 * (level)
            folder_name = os.path.basename(root)
            if folder_name == '': folder_name = os.path.basename(self.root_path)

            self.report_data["stats"]["dirs"] += 1
            
            # Bu klasördeki dosyaları işle
            file_list = []
            for f in files:
                if f in IGNORE_FILES or f.startswith('.'): continue
                
                full_path = os.path.join(root, f)
                file_info = self.get_file_summary(full_path)
                _, ext = os.path.splitext(f)
                
                if ext: self.report_data["tech_stack"]["languages"].add(ext.lower())
                self.report_data["stats"]["files"] += 1
                if isinstance(file_info["lines"], int):
                    self.report_data["stats"]["lines"] += file_info["lines"]

                file_list.append({
                    "name": f,
                    "info": file_info
                })

            self.report_data["structure"].append({
                "path": root,
                "indent": indent,
                "folder": folder_name,
                "files": file_list
            })

        self.analyze_project_type()
        self.check_requirements()
        self.generate_markdown()
        self.print_summary()

    def analyze_project_type(self):
        """Proje türünü ve teknolojileri tahmin etmeye çalışır."""
        files_flat = []
        for item in self.report_data["structure"]:
            for f in item["files"]:
                files_flat.append(f["name"])
        
        # 1. Node.js / JS Projeleri
        if 'package.json' in files_flat:
            self.read_package_json()
            if 'next' in self.report_data["tech_stack"]["frameworks"]:
                self.project_type = "Next.js Projesi"
            elif 'react' in self.report_data["tech_stack"]["frameworks"]:
                self.project_type = "React Projesi"
            elif 'vue' in self.report_data["tech_stack"]["frameworks"]:
                self.project_type = "Vue.js Projesi"
            else:
                self.project_type = "Node.js / Javascript Projesi"
        
        # 2. Python Projeleri
        elif 'manage.py' in files_flat:
            self.project_type = "Django Projesi"
            self.report_data["tech_stack"]["frameworks"].append("Django")
        elif 'requirements.txt' in files_flat or 'Pipfile' in files_flat:
            self.project_type = "Python Projesi"
            
        # 3. PHP Projeleri
        elif 'composer.json' in files_flat:
            if os.path.exists(os.path.join(self.root_path, 'artisan')):
                self.project_type = "Laravel Projesi"
                self.report_data["tech_stack"]["frameworks"].append("Laravel")
            else:
                self.project_type = "PHP Projesi (Composer)"
        elif 'wp-config.php' in files_flat:
             self.project_type = "WordPress Sitesi"
        
        # 4. Statik Site
        elif 'index.html' in files_flat:
            self.project_type = "Statik HTML Web Sitesi"

    def read_package_json(self):
        """package.json varsa bağımlılıkları okur."""
        pj_path = os.path.join(self.root_path, 'package.json')
        try:
            with open(pj_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                deps = list(data.get('dependencies', {}).keys())
                dev_deps = list(data.get('devDependencies', {}).keys())
                all_deps = deps + dev_deps
                
                # Önemli kütüphaneleri yakala
                keywords = ['react', 'next', 'vue', 'angular', 'tailwindcss', 'bootstrap', 'prisma', 'supabase', 'firebase', 'express']
                for k in keywords:
                    if any(k in d for d in all_deps):
                        self.report_data["tech_stack"]["frameworks"].append(k)
        except:
            pass

    def check_requirements(self):
        """Eksik dosya veya klasörleri kontrol eder."""
        root_files = [f["name"] for f in self.report_data["structure"][0]["files"]]
        root_dirs = [d for d in os.listdir(self.root_path) if os.path.isdir(os.path.join(self.root_path, d))]

        # Node.js Kontrolleri
        if 'package.json' in root_files:
            if 'node_modules' not in root_dirs:
                self.report_data["warnings"].append("⚠️ 'package.json' var ama 'node_modules' yüklü değil. (`npm install` gerekli)")
        
        # Python Kontrolleri
        if 'requirements.txt' in root_files:
            if not any(d in root_dirs for d in ['venv', '.venv', 'env']):
                self.report_data["warnings"].append("⚠️ 'requirements.txt' var ama sanal ortam (venv) görünmüyor.")

        # Ortam Değişkenleri
        if '.env.example' in root_files and '.env' not in root_files:
             self.report_data["warnings"].append("⚠️ '.env.example' dosyası var ama '.env' oluşturulmamış.")
             
        # Veritabanı
        if 'schema.prisma' in str(self.report_data["structure"]): 
             self.report_data["tech_stack"]["databases"].append("Prisma ORM")

    def generate_markdown(self):
        """Raporu MD dosyasına yazar."""
        output_path = os.path.join(self.root_path, "proje-tespit-raporu.md")
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(f"# 🕵️ Proje Tespit Raporu\n\n")
            f.write(f"**Analiz Yolu:** `{self.root_path}`\n")
            f.write(f"**Tarih:** {self.report_data['scan_time']}\n\n")
            
            f.write(f"## 1. Proje Özeti\n")
            f.write(f"- **Proje Türü:** {self.project_type}\n")
            f.write(f"- **Dosya Sayısı:** {self.report_data['stats']['files']}\n")
            f.write(f"- **Toplam Satır:** {self.report_data['stats']['lines']}\n")
            f.write(f"- **Tespit Edilen Teknolojiler:** {', '.join(self.report_data['tech_stack']['frameworks'])}\n")
            f.write(f"- **Kullanılan Diller/Uzantılar:** {', '.join(list(self.report_data['tech_stack']['languages']))}\n\n")
            
            if self.report_data["warnings"]:
                f.write(f"## ⚠️ Uyarılar ve Gereksinimler\n")
                for w in self.report_data["warnings"]:
                    f.write(f"- {w}\n")
                f.write("\n")

            f.write(f"## 2. Klasör ve Dosya Yapısı\n")
            f.write("```text\n")
            for item in self.report_data["structure"]:
                # Klasör ismi (root değilse)
                if item["indent"]:
                    f.write(f"{item['indent']}📁 {item['folder']}/\n")
                
                # Dosyalar
                for file_data in item["files"]:
                    fname = file_data["name"]
                    info = file_data["info"]
                    sub_indent = item['indent'] + "    "
                    
                    meta = ""
                    if info['type'] == 'text':
                        meta = f"({info['lines']} satır)"
                    else:
                        meta = f"[{info['type']}]"
                        
                    f.write(f"{sub_indent}📄 {fname} {meta}\n")
            f.write("```\n\n")
            
            f.write(f"## 3. Dosya Detayları (Örnek İçerikler)\n")
            for item in self.report_data["structure"]:
                for file_data in item["files"]:
                    if file_data["info"]["preview"]:
                        f.write(f"### `{file_data['name']}`\n")
                        f.write("```\n")
                        for line in file_data["info"]["preview"]:
                            f.write(f"{line}\n")
                        f.write("```\n")
        
        print(f"{Colors.GREEN}✅ Rapor başarıyla oluşturuldu: {output_path}{Colors.ENDC}")

    def print_summary(self):
        """Terminale renkli özet basar."""
        print(f"\n{Colors.HEADER}{'='*40}")
        print(f"   PROJE TARAMA ÖZETİ")
        print(f"{'='*40}{Colors.ENDC}")
        
        print(f"{Colors.BOLD}Proje Türü:{Colors.ENDC} {Colors.BLUE}{self.project_type}{Colors.ENDC}")
        print(f"{Colors.BOLD}Toplam Dosya:{Colors.ENDC} {self.report_data['stats']['files']}")
        print(f"{Colors.BOLD}Toplam Satır:{Colors.ENDC} {self.report_data['stats']['lines']}")
        
        if self.report_data['tech_stack']['frameworks']:
             print(f"{Colors.BOLD}Frameworkler:{Colors.ENDC} {', '.join(self.report_data['tech_stack']['frameworks'])}")
        
        if self.report_data["warnings"]:
            print(f"\n{Colors.WARNING}⚠️  DİKKAT GEREKTİRENLER:{Colors.ENDC}")
            for w in self.report_data["warnings"]:
                print(f"  - {w}")
        
        print(f"\n{Colors.GREEN}👉 Detaylı rapor için 'proje-tespit-raporu.md' dosyasını inceleyin.{Colors.ENDC}\n")

if __name__ == "__main__":
    # Script çalıştırılan klasörü alır
    current_dir = os.getcwd()
    
    # Kullanıcıya bilgi ver
    print(f"Hedef Dizin: {current_dir}")
    
    scanner = ProjectScanner(current_dir)
    scanner.scan()