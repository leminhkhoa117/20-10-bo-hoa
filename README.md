# 🌺 20/10 · Bó Hoa & Lá Thư

Landing page chúc mừng ngày 20 tháng 10: nhập tên → **bó hoa hồng** (vẽ bằng SVG) → cuộn xuống **lá thư** → mở thư, nền tối lại và lời chúc hiện dần từng dòng.

**🔗 Bản chạy thật: <https://leminhkhoa117.github.io/20-10-bo-hoa/>**

> Không dùng WebGL/three.js: bó hoa, phong bì và lá thư đều là **SVG + CSS**, nên trang nhẹ (~78 KB gzip), tải nhanh và sắc nét ở mọi độ phân giải.

---

## ✨ Trải nghiệm

| Bước | Mô tả |
|------|-------|
| 1. **Nhập tên** | Thẻ kính trắng trên nền hồng sáng. Chỉ hỏi tên (không hỏi người gửi). Tên được ghi nhớ trên máy cho lần sau. |
| 2. **Landing page** | Trang cuộn gọn (không nav, không footer): lời chào *"Gửi Minh Anh,"* + **bó hoa SVG** (hồng, cúc, lá xanh, giấy kraft, nơ hồng, hạt sương) — trôi nhẹ, hover phóng to và **bấm được**. Nút âm thanh nhỏ ở góc phải. |
| 3. **Lá thư** | Cuộn xuống phần "Lá thư" có phong bì hồng với **dấu hoa** và nút "Mở lá thư". |
| 4. **Mở thư (modal)** | Nền tối lại + làm mờ, phong bì hiện giữa: nắp bật mở, dấu hoa rơi đi, **tờ thư trồi ra rồi mở dần** thành tấm giấy lớn dễ đọc. Đóng bằng ✕, Esc hoặc bấm nền. |
| 5. **Đọc lời chúc** | Lời chúc hiện dần từng ký tự với con trỏ nhấp nháy, cuối thư hiện chữ ký. |

### Chi tiết

- Bó hoa là SVG thủ công: hoa hồng 5 lớp cánh xoáy, cúc 3 vòng cánh mảnh, hoa nhỏ lấp đầy, cành lá, giấy kraft có nếp gấp, lớp cellophane, nơ hồng 2 vòng + 2 đuôi và hạt sương.
- Phong bì dựng theo kỹ thuật của repo tham khảo [`leminhkhoa117/memory`](https://github.com/leminhkhoa117/memory): chia lớp (thân sau – tờ thư – túi – hai nắp bên – nắp trên), nắp xoay quanh mép trên, tờ thư nằm giữa thân và mặt trước nên bị che khi trồi ra.
- Tôn trọng `prefers-reduced-motion`, có `focus-visible`, `aria-live` cho trình đọc màn hình, đóng modal bằng Esc.

## 🧰 Công nghệ

- **Frontend**: React 19 + Vite. Không thư viện 3D — chỉ SVG + CSS animation.
- **Backend**: Node.js + Express: sinh lá thư theo tên (băm tên → 5 mẫu + 5 bảng màu bó hoa), phục vụ bản build.
- **Âm thanh**: WebAudio tổng hợp (không cần file nhạc).
- **Font**: Quicksand, Dancing Script, Playfair Display (tự tải, hỗ trợ đầy đủ dấu tiếng Việt).

## 📁 Cấu trúc

```
.
├── client/
│   ├── public/fonts/            # font tiếng Việt
│   └── src/
│       ├── components/
│       │   ├── Welcome.jsx      # màn hình nhập tên
│       │   ├── Landing.jsx      # trang cuộn: hero + phần lá thư
│       │   ├── BouquetArt.jsx   # bó hoa vẽ bằng SVG
│       │   ├── EnvelopeCard.jsx # phong bì nhỏ ở phần lá thư
│       │   └── LetterModal.jsx  # modal mở thư (nền tối + phong bì + tờ thư)
│       ├── hooks/
│       │   ├── useSequentialTypewriter.js
│       │   └── useReducedMotion.js
│       ├── api.js               # gọi API + nội dung dự phòng
│       ├── audio.js             # âm thanh tổng hợp
│       ├── styles.css
│       └── App.jsx              # điều phối: nhập tên → landing → modal
├── server/
│   ├── src/index.js             # API + phục vụ bản build
│   ├── src/messages.js          # 5 mẫu lá thư + 5 bảng màu bó hoa
│   └── src/store.js             # lưu lời chúc (atomic, dự phòng)
└── scripts/
    ├── fetch-fonts.mjs          # tải font
    └── visual-test.mjs          # chạy thử toàn luồng + chụp ảnh (headless Chrome)
```

## 🚀 Chạy dự án

```bash
npm install
npm run fonts        # tải font chữ (chạy 1 lần)
npm run dev          # server :5174 + client :5173
```

Mở **http://localhost:5173**.

### Production

```bash
npm start            # build client rồi chạy server tại http://localhost:5174
```

### Deploy lên GitHub Pages

Repo đã có sẵn workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): mỗi lần push lên `main`, GitHub Actions build client ở **chế độ tĩnh** (`VITE_STATIC=1`, `BASE_PATH=/<tên-repo>/`) rồi deploy `client/dist` lên Pages.

- Bản tĩnh tự sinh lá thư ngay trên trình duyệt bằng `shared/letters.js` (dùng chung với server) nên **không cần backend** vẫn có thư riêng theo tên.
- Bật Pages: **Settings → Pages → Source: GitHub Actions** (đã bật sẵn cho repo này).
- Đổi tên repo thì workflow tự đổi `BASE_PATH` theo tên repo mới.

```bash
git add -A && git commit -m "update" && git push
```

### Kiểm thử giao diện tự động

```bash
npm run visual                                   # 1280x800
node scripts/visual-test.mjs --name=wide --width=1920 --height=900
node scripts/visual-test.mjs --name=mobile --width=390 --height=844
node scripts/visual-test.mjs --name=live --url=https://leminhkhoa117.github.io/20-10-bo-hoa/
```

Ảnh lưu vào `dev-shots/`.

## 🔌 API

| Method | Đường dẫn | Mô tả |
|--------|-----------|-------|
| `GET` | `/api/health` | Kiểm tra server |
| `POST` | `/api/letter` | `{ name }` → lá thư + bảng màu bó hoa riêng cho tên đó |
| `GET` | `/api/wishes?limit=12` | (tuỳ chọn) lời chúc gần nhất |
| `POST` | `/api/wishes` | (tuỳ chọn) lưu lời chúc |

Nếu server chưa chạy, client tự dùng nội dung dự phòng nên trang vẫn hoạt động.
