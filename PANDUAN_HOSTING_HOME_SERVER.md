# Panduan Hosting LAMIMI_ID di Home Server

Panduan ini menjalankan LAMIMI_ID di komputer/server milik sendiri sampai dapat diakses memakai domain dan HTTPS.

## Arsitektur produksi

```text
Pengunjung -> HTTPS :443 -> Nginx
                              |-- frontend/dist
                              |-- /api/*     -> FastAPI 127.0.0.1:8001
                              `-- /uploads/* -> FastAPI 127.0.0.1:8001
                                                   `-> MongoDB 127.0.0.1:27017
```

Jangan membuka port `8001` atau `27017` ke internet. Hanya Nginx yang boleh menerima koneksi publik. Vite `yarn dev` hanya untuk development.

Contoh di bawah menggunakan Ubuntu Server/Debian. Ganti nama user, folder, domain, IP, dan email sesuai server sendiri.

## 1. Prasyarat

Siapkan home server yang stabil, sebaiknya memakai kabel LAN dan UPS, Ubuntu Server 22.04/24.04 atau Debian 12, IP lokal tetap (contoh `192.168.1.50`), domain (contoh `lamimi.id`), serta akses admin router dan DNS domain.

Sebaiknya buat user deployment terpisah, bukan menjalankan aplikasi sebagai `root`.

## Deployment dengan Docker Compose

Project ini menyediakan `docker-compose.yml` dengan empat service: MongoDB,
backend FastAPI, frontend React, dan Nginx sebagai pintu masuk. Di server:

```bash
git clone URL_REPOSITORY /opt/lamimi_project
cd /opt/lamimi_project
cp backend/.env.docker.example backend/.env
```

Edit `backend/.env` dan isi secret, kredensial admin, domain, serta API key.
File tersebut jangan di-commit ke Git. Pastikan direktori upload tersedia:

```bash
mkdir -p backend/uploads/covers backend/uploads/ebooks
docker compose build
docker compose up -d
docker compose ps
```

Aplikasi dapat diuji melalui `http://IP_SERVER:8000`. MongoDB dan backend tidak
dipublikasikan ke host; hanya Nginx yang menerima koneksi dari luar. Data MongoDB
disimpan di volume `mongo_data`, sedangkan file upload memakai
`backend/uploads`, sehingga rebuild container tidak menghapus data.

Untuk memindahkan database lama ke container, restore backup MongoDB ke service
`mongo` setelah container aktif:

```bash
docker compose cp lamimi-backup.archive mongo:/tmp/lamimi-backup.archive
docker compose exec mongo mongorestore \
  --gzip --archive=/tmp/lamimi-backup.archive \
  --nsFrom='NAMA_DATABASE_LAMA.*' \
  --nsTo='lamimi_production.*'
```

Konfigurasi Nginx yang disediakan melayani HTTP pada port `8000`. Port `443` pada
Compose sudah dicadangkan untuk HTTPS, tetapi blok `listen 443 ssl` dan path
sertifikat harus ditambahkan setelah sertifikat Let's Encrypt tersedia. Jangan
menganggap port `443` otomatis aman hanya karena sudah dipetakan di Compose.

## 2. Instalasi software

```bash
sudo apt update
sudo apt install -y git nginx rsync curl build-essential python3.11 python3.11-venv python3-pip
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install --global yarn
```

Instal MongoDB dari dokumentasi resmi MongoDB sesuai versi Ubuntu yang dipakai. Pastikan aktif dan hanya bind ke localhost:

```bash
sudo systemctl enable --now mongod
sudo systemctl status mongod
ss -lntp | grep 27017
```

Hasil yang diharapkan adalah `127.0.0.1:27017`, bukan `0.0.0.0:27017`.

## 3. Salin project ke server

Dari komputer development:

```bash
rsync -az --delete \
  --exclude '.git' \
  --exclude 'frontend/node_modules' \
  --exclude 'backend/.venv' \
  --exclude 'backend/.env' \
  ./ user@192.168.1.50:/opt/lamimi_project/
```

Ganti akun dan IP server. Di server:

```bash
sudo mkdir -p /opt/lamimi_project
sudo chown -R "$USER":"$USER" /opt/lamimi_project
cd /opt/lamimi_project
mkdir -p backend/uploads/covers backend/uploads/ebooks
```

Upload file ebook ke `backend/uploads/ebooks`, lalu isi path seperti
`/uploads/ebooks/nama-file.pdf` pada URL download buku atau variasinya di admin.
Jangan memberikan URL file asli langsung kepada customer; aplikasi akan membuat
link bertoken setelah admin mengubah status pesanan menjadi `lunas`. Link berlaku
30 hari, maksimal 3 download, dan memeriksa email yang dipakai saat checkout.

## 4. Environment produksi

Buat `/opt/lamimi_project/backend/.env`. Jangan commit file ini ke Git atau menaruhnya di frontend.

```env
MONGO_URL="mongodb://127.0.0.1:27017"
DB_NAME="lamimi_production"
CORS_ORIGINS="https://lamimi.id,https://www.lamimi.id"
APP_URL="https://lamimi.id"
JWT_SECRET="GANTI_DENGAN_SECRET_ACAK_MINIMAL_32_KARAKTER"
ADMIN_EMAIL="admin@lamimi.id"
ADMIN_PASSWORD="GANTI_DENGAN_PASSWORD_ADMIN_YANG_UNIK"
OWNER_WHATSAPP="628xxxxxxxxxx"
SHOPEE_URL="https://s.shopee.co.id/ganti"
RAJAONGKIR_API_KEY="isi_api_key_produksi"
RAJAONGKIR_ORIGIN_CITY_ID="isi_id_kota_asal"
RAJAONGKIR_ORIGIN_CITY_NAME="Kabupaten Bogor"
RAJAONGKIR_ORIGIN_DESTINATION_SEARCH="Cibinong"
RAJAONGKIR_COURIER="jne"
NEWS_API_KEY="isi_api_key_newsapi"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USERNAME="alamat-email-pengirim"
SMTP_PASSWORD="app-password-email"
SMTP_FROM_NAME="LAMIMI_ID"
SMTP_USE_SSL="false"
ADMIN_NOTIFICATION_EMAIL="alamat-email-admin"
```

Ganti `JWT_SECRET`, password admin, password SMTP, dan API key. Untuk Gmail gunakan App Password, bukan password akun utama.

## 5. Instal dependency dan build

```bash
cd /opt/lamimi_project/backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
deactivate

cd /opt/lamimi_project/frontend
yarn install --frozen-lockfile
yarn build
```

Catatan: `requirements.txt` memiliki dependency `litellm` dari sumber internal Emergent. Jika server tidak dapat mengakses URL tersebut, instal dependency dari sumber resmi yang tersedia di lingkungan deployment atau sesuaikan dependency setelah memastikan fitur yang membutuhkannya tidak dipakai. Jangan mengabaikan error `pip install`.

Saat backend pertama kali hidup, `seed_data.json` mengisi katalog dan konfigurasi awal jika collection terkait masih kosong. Jalankan setelah `.env` produksi benar.

Uji sebelum memasang service:

```bash
cd /opt/lamimi_project/backend
.venv/bin/python -c 'import server; print("backend import OK")'
test -f /opt/lamimi_project/frontend/dist/index.html
```

## 6. FastAPI sebagai systemd service

Buat `/etc/systemd/system/lamimi-backend.service`:

```ini
[Unit]
Description=LAMIMI_ID FastAPI backend
After=network-online.target mongod.service
Wants=network-online.target

[Service]
Type=simple
User=lamimi
Group=lamimi
WorkingDirectory=/opt/lamimi_project/backend
EnvironmentFile=/opt/lamimi_project/backend/.env
ExecStart=/opt/lamimi_project/backend/.venv/bin/uvicorn server:app --host 127.0.0.1 --port 8001 --workers 1
Restart=always
RestartSec=5
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Aktifkan service:

```bash
sudo useradd --system --home /opt/lamimi_project --shell /usr/sbin/nologin lamimi || true
sudo chown -R lamimi:lamimi /opt/lamimi_project/backend
sudo systemctl daemon-reload
sudo systemctl enable --now lamimi-backend
sudo systemctl status lamimi-backend
```

Uji dari server:

```bash
curl -i http://127.0.0.1:8001/api/
journalctl -u lamimi-backend -n 100 --no-pager
```

`/api/` harus mengembalikan JSON `LAMIMI_ID API`.

## 7. Nginx sebagai reverse proxy

Buat `/etc/nginx/sites-available/lamimi`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lamimi.id www.lamimi.id;
    root /opt/lamimi_project/frontend/dist;
    index index.html;
    client_max_body_size 5M;

    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Aktifkan:

```bash
sudo ln -s /etc/nginx/sites-available/lamimi /etc/nginx/sites-enabled/lamimi
sudo nginx -t
sudo systemctl reload nginx
```

`try_files ... /index.html` diperlukan agar URL React Router seperti katalog, detail buku, checkout, dan admin dapat dibuka langsung.

## 8. Domain dan akses dari internet

### Pilihan A: public IP dan port forwarding

1. Buat DNS `A` untuk `lamimi.id` dan `www` menuju public IP rumah. Tambahkan `AAAA` hanya jika IPv6 server benar-benar siap.
2. Di router, forward TCP port `80` dan `443` ke `192.168.1.50`.
3. Batasi firewall server:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Jika IP rumah berubah, gunakan DDNS atau DNS API provider. Jangan forward port MongoDB `27017` atau backend `8001`.

### Pilihan B: CGNAT atau port forwarding tidak tersedia

Gunakan Cloudflare Tunnel, Tailscale Funnel, atau tunnel sejenis. Arahkan tunnel ke `http://127.0.0.1:80` (Nginx), bukan langsung ke `8001`.

Contoh Cloudflare Tunnel:

```bash
cloudflared tunnel login
cloudflared tunnel create lamimi
cloudflared tunnel route dns lamimi lamimi.id
cloudflared tunnel route dns lamimi www.lamimi.id
```

Buat `/etc/cloudflared/config.yml`:

```yaml
tunnel: UUID_TUNNEL
credentials-file: /etc/cloudflared/UUID_TUNNEL.json
ingress:
  - hostname: lamimi.id
    service: http://127.0.0.1:80
  - hostname: www.lamimi.id
    service: http://127.0.0.1:80
  - service: http_status:404
```

Pasang dan aktifkan service tunnel sesuai dokumentasi Cloudflare:

```bash
sudo cloudflared service install
sudo systemctl enable --now cloudflared
```

## 9. HTTPS Let's Encrypt

Untuk setup public IP, setelah DNS dan port forwarding aktif:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d lamimi.id -d www.lamimi.id
sudo certbot renew --dry-run
```

Pilih redirect HTTP ke HTTPS. Verifikasi:

```bash
curl -I https://lamimi.id
curl -sS https://lamimi.id/api/
```

Jangan membuat sertifikat sebelum DNS mengarah ke server dan port `80` dapat diakses dari internet. Cloudflare Tunnel biasanya sudah menyediakan HTTPS publik, tetapi Nginx tetap dipakai untuk routing lokal.

## 10. Checklist pengujian

Lakukan dari jaringan luar rumah, misalnya data seluler:

- `https://lamimi.id` menampilkan halaman utama tanpa mixed-content error.
- Refresh langsung pada `/catalog`, `/checkout`, `/track-order`, dan admin tidak menghasilkan 404.
- Request browser ke `/api/...` berstatus 2xx dan tidak menuju `localhost`.
- Cover buku dan bukti pembayaran dapat dibuka melalui `/uploads/...`.
- Login admin dan logout bekerja.
- Buat satu pesanan uji dan cek alur email/WhatsApp yang relevan.
- Login dari perangkat lain untuk memastikan aplikasi tidak hanya bekerja di LAN.

Diagnosis:

```bash
sudo systemctl status mongod lamimi-backend nginx
sudo journalctl -u lamimi-backend -f
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
curl -I https://lamimi.id
```

## 11. Backup dan deploy berikutnya

Backup wajib mencakup MongoDB, `backend/uploads`, dan `.env` yang disimpan secara terenkripsi. Contoh backup manual:

```bash
BACKUP="/var/backups/lamimi/$(date +%F_%H%M%S)"
sudo mkdir -p "$BACKUP"
sudo mongodump --uri="mongodb://127.0.0.1:27017/lamimi_production" --out="$BACKUP/mongo"
sudo rsync -a /opt/lamimi_project/backend/uploads/ "$BACKUP/uploads/"
sudo install -m 600 /opt/lamimi_project/backend/.env "$BACKUP/backend.env"
```

Salin backup ke disk/server lain dan uji restore berkala. Backup yang hanya ada di home server tidak cukup jika disk rusak atau server terkena ransomware.

Deploy versi baru:

```bash
cd /opt/lamimi_project
git pull --ff-only
cd frontend && yarn install --frozen-lockfile && yarn build
cd ../backend && .venv/bin/pip install -r requirements.txt
sudo systemctl restart lamimi-backend
sudo nginx -t && sudo systemctl reload nginx
curl -sS https://lamimi.id/api/
```

## 12. Masalah umum

**`502 Bad Gateway`:** cek `systemctl status lamimi-backend`, `curl http://127.0.0.1:8001/api/`, dan `journalctl -u lamimi-backend`.

**Route React 404:** pastikan Nginx memakai `try_files $uri $uri/ /index.html;`.

**API gagal di browser:** pastikan domain ada di `CORS_ORIGINS`, frontend memakai path relatif `/api`, dan blok Nginx `/api/` tersedia. Restart backend setelah mengubah `.env`.

**Upload 404:** pastikan `backend/uploads` ada, permission user `lamimi` benar, dan Nginx meneruskan `/uploads/` ke port `8001`.

**Domain tidak bisa dibuka:** periksa DNS, public IP, port forwarding, firewall, dan CGNAT ISP. Gunakan Cloudflare Tunnel jika tidak ada public IP.

**MongoDB gagal:** pastikan `mongod` aktif dan `MONGO_URL` memakai `127.0.0.1:27017`. Jangan membuka MongoDB ke internet sebagai solusi.

## Status akhir yang diharapkan

```text
https://lamimi.id              -> frontend React production
https://lamimi.id/api/         -> FastAPI melalui Nginx
https://lamimi.id/uploads/...  -> upload melalui FastAPI/Nginx
MongoDB                        -> hanya localhost
port publik                    -> hanya 80/443 (dan SSH yang dibatasi)
backup                         -> otomatis dan tersimpan di lokasi kedua
```
