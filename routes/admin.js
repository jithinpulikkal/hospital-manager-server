const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const upload = require("../middlewares/multer");

router.post("/getAdmin", adminController.getAdmin);

router.post("/login", adminController.adminLogin);


router.get("/departments", adminController.viewDepartments);
router.post("/addDept", upload.single("deptImg"),adminController.addDepartment);
router.put("/updateDept", adminController.updateDepartment);
router.post("/deleteDept", adminController.deleteDepartment);


router.get("/employees", adminController.viewEmployees);
router.post("/adduser", upload.single("profileImg"),adminController.addUser);
router.post("/updateUser", adminController.changeUser);
router.post("/deleteUser", adminController.deleteUser);


module.exports = router;
