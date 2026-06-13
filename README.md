# 📤 Media Upload Service

A **Node.js** backend service for image and video upload management with **Cloudinary** integration and database logging.

---

## ✨ Features

- 🗂️ **Local File Upload** — Save images directly to the server's filesystem
- 🌤️ **Image Upload to Cloudinary** — Upload images (`jpg`, `jpeg`, `png`) to Cloudinary cloud storage
- 🎬 **Video Upload to Cloudinary** — Upload videos (up to **5MB**) to Cloudinary cloud storage
- 🗜️ **Reduced Image Upload to Cloudinary** — Compress images at **quality 30** and upload to Cloudinary
- 🗃️ **Database Entry** — Every Cloudinary upload is logged to the database automatically

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| ⚙️ Runtime | Node.js |
| 🚀 Framework | Express.js |
| ☁️ Cloud Storage | Cloudinary |
| 🗄️ Database | MongoDB (via Mongoose) |
| 📁 File Handling | express-fileupload |

---

## 📁 Project Structure

```
MediaUploadService/
├── Config/
│   ├── cloudinary.js        # ☁️ Cloudinary SDK configuration
│   └── database.js          # 🗄️ MongoDB connection setup
├── Controller/
│   ├── files/               # 💾 Local storage directory (auto-created)
│   └── fileController.js    # 🧠 All upload controllers (local, image, video, reduce)
├── Models/
│   └── fileModel.js         # 📄 DB schema for upload records
├── Routes/
│   └── fileUpload.js        # 🔀 Route definitions
├── .env                     # 🔐 Environment variables (not committed)
├── index.js                 # 🚪 Entry point
├── package-lock.json
└── package.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js v16+
- npm
- A [Cloudinary](https://cloudinary.com/) account ☁️
- A running MongoDB instance (local or Atlas) 🗄️

### 📦 Installation

```bash
git clone https://github.com/your-username/MediaUploadService.git
cd MediaUploadService
npm install
```

### 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
URL=<your_mongodb_connection_string>

# ☁️ Cloudinary Credentials
API_KEY=<your_cloudinary_api_key>
API_SECRET=<your_cloudinary_api_secret>
CLOUD_NAME=<your_cloudinary_cloud_name>

# 📧 Mail Configuration (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_USER=<your_gmail_address>
MAIL_PASSWORD=<your_gmail_app_password>
```

> ⚠️ **Note:** For `MAIL_PASSWORD`, use a [Google App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

### ▶️ Run the Server

```bash
# 🔧 Development
npm run dev

# 🚀 Production
npm start
```

The server starts at `http://localhost:4000` 🌐

---

## 📡 API Reference

**Base URL:** `http://localhost:4000`

> 📝 All routes accept `multipart/form-data`

---

### 1️⃣ Local File Upload

**POST** `/localFileUpload`

🗂️ Saves the uploaded file to the server's local `files/` directory. No DB entry is created for this route.

**📥 Request (form-data)**

| Field  | Type | Description           |
|--------|------|-----------------------|
| `file` | File | Image file to upload  |

**🏷️ File Naming Convention**
```
/files/<timestamp>.<extension>
# e.g., /files/1718123456789.jpg
```

**📤 Response**
```json
{
  "success": true,
  "message": "File uploaded successfully on server"
}
```

---

### 2️⃣ Image Upload to Cloudinary

**POST** `/imageUpload`

🌤️ Validates the file type, uploads to Cloudinary under the `ImageProcessing` folder, and saves the record to the database.

**📥 Request (form-data)**

| Field       | Type   | Description                      |
|-------------|--------|----------------------------------|
| `imageFile` | File   | Image file (`jpg`, `jpeg`, `png`) |
| `name`      | String | User's name                      |
| `tags`      | String | Tags for the file                |
| `email`     | String | User's email address             |

**🚫 Supported Formats:** `jpg`, `jpeg`, `png` only

**📤 Response**
```json
{
  "sucess": true,
  "message": "File successfully uploaded on Cloudinary"
}
```

> ⚠️ Unsupported file type returns:
> ```json
> { "message": "This File is not supported at Cloudinary" }
> ```

---

### 3️⃣ Video Upload to Cloudinary

**POST** `/videoUpload`

🎬 Validates video size, uploads to Cloudinary under the `ImageProcessing` folder, and saves the record to the database.

**📥 Request (form-data)**

| Field   | Type   | Description               |
|---------|--------|---------------------------|
| `video` | File   | Video file to upload      |
| `name`  | String | User's name               |
| `tags`  | String | Tags for the file         |
| `email` | String | User's email address      |

**📏 Size Limit:** Maximum **5MB**

**📤 Response**
```json
{
  "success": true,
  "message": "Video uploaded on cloudinary successfully"
}
```

> ⚠️ Oversized video returns:
> ```json
> { "message": "You need to compress the video, you only can upload upto 5MB" }
> ```

---

### 4️⃣ Reduced Image Upload to Cloudinary

**POST** `/reduce/ImageUpload`

🗜️ Compresses the image to **quality 30** via Cloudinary transformation and uploads it under the `ImageProcessing` folder.

**📥 Request (form-data)**

| Field       | Type   | Description                       |
|-------------|--------|-----------------------------------|
| `imageFile` | File   | Image file (`jpg`, `jpeg`, `png`)  |
| `name`      | String | User's name                       |
| `tags`      | String | Tags for the file                 |
| `email`     | String | User's email address              |

**🚫 Supported Formats:** `jpg`, `jpeg`, `png` only

**📤 Response**
```json
{
  "sucess": true,
  "message": "Reduce file successfully uploaded on Cloudinary"
}
```

---

## ⚙️ How It Works

Each upload request follows this flow:

```
📲 Client Request
       │
       ▼
🔀 Express Route
       │
       ▼
🧠 Controller (validate file type / size)
       │
       ├──► 💾 Local: Save to /files/<timestamp>.<ext>
       │         (no DB entry)
       │
       └──► ☁️  Cloudinary: Upload to "ImageProcessing" folder
                    │
                    ▼
              🗃️ Save record to MongoDB (name, tags, email, url)
                    │
                    ▼
              ✅ Return JSON Response
```

---

## 💾 Local File Storage

When a file is saved locally, the path is constructed as:

```js
const path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
```

🕐 `Date.now()` guarantees a **unique filename** per upload, and the original extension is preserved.

---

## 🗃️ Database Schema

Every Cloudinary upload creates a document in MongoDB with the following fields:

| Field   | Type   | Description                        |
|---------|--------|------------------------------------|
| `name`  | String | Uploader's name                    |
| `tags`  | String | Tags associated with the file      |
| `email` | String | Uploader's email                   |
| `url`   | String | Cloudinary `secure_url` of the file |

---

## ❌ Error Handling

All routes return structured JSON on failure:

```json
{
  "success": false,
  "error": "<error message>",
  "message": "Descriptive error message"
}
```

Common error scenarios:

| Scenario | Response |
|----------|----------|
| 🚫 Unsupported file type | `"This File is not supported at Cloudinary"` |
| 📏 Video exceeds 5MB | `"You need to compress the video, you only can upload upto 5MB"` |
| ☁️ Cloudinary upload failure | `"Error while uploading the file on cloudinary"` |
| 🗄️ Database error | Caught in try/catch, returns error message |

---

## 🔒 Security Notes

- 🙈 Never commit your `.env` file — add it to `.gitignore`
- 🌍 Use environment-specific credentials for production deployments
- 📏 File type validation is enforced for all Cloudinary image routes (`jpg`, `jpeg`, `png` only)
- 🎬 Video uploads are capped at **5MB** server-side

---

## 👨‍💻 Author

**Devang Singh Mehta**
