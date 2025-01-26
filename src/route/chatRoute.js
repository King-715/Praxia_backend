const express = require("express");
const ChatGPTController = require("../controllers/ChatGptController");

const router = express.Router();

router.post("/", ChatGPTController.searchData);
router.get("/", ChatGPTController.getChatHistory);

module.exports = router;