// Create this file: backend/src/middleware/debug-middleware.js
export const debugRequestMiddleware = (req, res, next) => {
  console.log("🔍 === REQUEST DEBUG START ===");
  console.log("📅 Timestamp:", new Date().toISOString());
  console.log("🌐 Method:", req.method);
  console.log("🔗 URL:", req.url);

  // Check Content-Type
  const contentType = req.get("Content-Type");
  console.log("📄 Content-Type:", contentType);

  if (contentType && contentType.includes("multipart/form-data")) {
    console.log("✅ Multipart form data detected");
  } else {
    console.log("❌ NOT multipart form data - files won't be processed!");
  }

  // Log body keys (before multer processes it)
  console.log("📝 Body keys (raw):", Object.keys(req.body));

  // After multer processes the request
  const originalSend = res.send;
  res.send = function (data) {
    console.log("📁 Files after multer:", req.files?.length || 0);
    console.log("📝 Body after multer:", Object.keys(req.body));

    if (req.files && req.files.length > 0) {
      console.log("📋 File details:");
      req.files.forEach((file, index) => {
        console.log(`  File ${index + 1}:`, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          filename: file.filename,
          path: file.path,
          size: file.size,
        });
      });
    }

    console.log("🔍 === REQUEST DEBUG END ===");
    originalSend.call(this, data);
  };

  next();
};
