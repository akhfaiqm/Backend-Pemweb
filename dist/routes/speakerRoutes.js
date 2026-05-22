"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const speakerController_js_1 = require("../controllers/speakerController.js");
const router = express_1.default.Router();
router.get("/", speakerController_js_1.getSpeakers);
router.post("/", speakerController_js_1.createSpeaker);
router.get("/:id", speakerController_js_1.getSpeakerById);
router.put("/:id", speakerController_js_1.updateSpeaker);
router.delete("/:id", speakerController_js_1.deleteSpeaker);
exports.default = router;
//# sourceMappingURL=speakerRoutes.js.map