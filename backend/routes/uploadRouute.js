const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/upload", upload.single("file"), (req, res) => {
  res.json({
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

module.exports = router;