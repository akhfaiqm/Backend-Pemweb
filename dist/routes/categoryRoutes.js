"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_js_1 = require("../controllers/categoryController.js");
const router = express_1.default.Router();
router.get("/", categoryController_js_1.getCategories);
router.post("/", categoryController_js_1.createCategory);
router.get("/:id", categoryController_js_1.getCategoryById);
router.put("/:id", categoryController_js_1.updateCategory);
router.delete("/:id", categoryController_js_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map