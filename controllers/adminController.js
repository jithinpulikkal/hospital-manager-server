const deptModel = require("../models/departments");
const userModel = require("../models/employees");
const Image = require("../models/imageSchema");
const adminCollection = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const departments = require("../models/departments");
const { ObjectId } = mongoose.Types;

const JWT_SECRET = "qpuEEAkckC40XDAhjKUpEbvvEWdoNf";

module.exports = {
    getAdmin: async (req, res) => {
        let admin;
        try {
            admin = await adminCollection.find();
            res.status(200).json({ admin });
        } catch (error) {
            console.log(error);
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("admin", req.body);
            let admin = await adminCollection.findOne({ username: username });
            // console.log(admin);
            if (!admin) {
                res.json({ error: "not found" });
            } else {
                if (password !== admin.password) {
                    res.json({ pswdError: "Incorrect password" });
                } else {
                    // console.log("admin password");
                    const token = jwt.sign({}, JWT_SECRET);
                    res.json({ status: "ok", login: true, data: token, admin });
                    console.log({ data: admin, token });
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    addDepartment: async (req, res) => {
        try {
            const { deptName, yearFounded, description } = req.body;

            let data = {
                deptName,
                yearFounded,
                description,
            };

            // console.log(data);

            if (req.file) {
                const deptImg = req.file.filename;
                const newImage = new Image({ path: deptImg });

                try {
                    await newImage.save();
                    data.deptImg = newImage.path;
                    // console.log("Image uploaded:", newImage.path);
                } catch (imageError) {
                    console.error("Error saving image:", imageError);
                    res.status(500).json({ error: "Error saving image" });
                    return;
                }
            } else {
                data.deptImg = "default-path-for-no-image";
            }

            const existingDept = await deptModel.findOne({ deptName: deptName });

            if (!existingDept) {
                const newDept = new deptModel(data);
                await newDept.save();
                console.log("Department added: ", newDept);
                res.status(200).json({ message: " department added successfully", newDept });
            } else {
                console.log("Department already exists");
                res.status(400).json({ error: "Department already exists" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    viewDepartments: async (req, res) => {
        try {
            const departments = await deptModel.find();
            res.json(departments);
        } catch (error) {
            console.error(error);
        }
    },

    getDeptById: async (req, res) => {
        try {
            const { id } = req.params;
            const department = await deptModel.findById(id);

            if (!department) {
                return res.status(404).json({ error: "Department not found" });
            }
            res.json(department);

        } catch (error) {
            console.error("Error fetching department data: ", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    updateDepartment: async (req, res) => {
        try {
            const id = req.params.id;
            const { deptName, yearFounded, description } = req.body;
    
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid department ID' });
            }
    
            if (!deptName || !yearFounded || !description) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            const data = {
                deptName,
                yearFounded,
                description,
            };
    
            if (req.file) {
                const deptImg = req.file.filename;
                const newImage = new Image({ path: deptImg });
    
                try {
                    await newImage.save();
                    data.deptImg = newImage.path;
                    console.log('Department image uploaded:', newImage.path);
                } catch (imageError) {
                    console.error('Error saving department image:', imageError);
                    res.status(500).json({ error: 'Error saving department image' });
                    return;
                }
            } else {
                data.deptImg = 'default-path-for-no-image';
            }
    
            const department = await deptModel.findOneAndUpdate(
                { _id: id },
                { $set: data },
                { new: true }
            );
    
            if (!department) {
                return res.status(404).json({ error: 'Department not found' });
            }
    
            res.json({ message: 'Department updated successfully', department });
        } catch (error) {
            console.error('Error updating department:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteDepartment: async (req, res) => {
        console.log("reqq--", req.body);
        let deptId = req.body.id;
        console.log("deleted", deptId);
        deptModel.deleteOne({ _id: new ObjectId(deptId) }).then(async (data) => {
            let details = await deptModel.find();
            res.json({ delete: true, details });
        });
    },

    addUser: async (req, res) => {
        try {
            const { employeeName, employeeNumber, age, description, department } = req.body;

            let data = {
                employeeName,
                age,
                employeeNumber,
                description,
                department,
            };

            if (req.file) {
                const profileImg = req.file.filename;
                const newProfileImg = new Image({ path: profileImg });

                try {
                    await newProfileImg.save();
                    data.profileImg = newProfileImg.path;
                    console.log("Image uploaded:", newProfileImg.path);
                } catch {
                    console.error("Error saving image:", imageError);
                    res.status(500).json({ error: "Error saving image" });
                    return;
                }
            } else {
                data.profileImg = "default-path-for-no-image";
            }

            const existingUser = await userModel.findOne({ employeeName: employeeName });

            if (!existingUser) {
                const newUser = new userModel(data);
                await newUser.save();
                res.status(200).json({ message: "added successfully", data });
            } else {
                console.log("User already exists");
                res.status(400).json({ error: "User already exists" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    viewEmployees: async (req, res) => {
        try {
            employees = await userModel.find().then((employees) => res.json(employees));
        } catch (error) {
            console.log(error);
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userModel.findById(id);

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json(user);
            
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    changeUser: async (req, res) => {
        try {
            const id = req.params.id;
    
            // Validate if the provided id is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ error: 'Invalid user ID' });
            }
    
            const { employeeName, age, employeeNumber, description, department } = req.body;
    
            if (!employeeName || !age || !employeeNumber || !description || !department) {
                return res.status(400).json({ error: 'All fields are required' });
            }
    
            const data = {
                employeeName,
                age,
                employeeNumber,
                description,
                department,
            };
    
            if (req.file) {
                const profileImg = req.file.filename;
                const newProfileImg = new Image({ path: profileImg });
    
                try {
                    await newProfileImg.save();
                    data.profileImg = newProfileImg.path;
                    console.log('Image uploaded:', newProfileImg.path);
                } catch (imageError) {
                    console.error('Error saving image:', imageError);
                    res.status(500).json({ error: 'Error saving image' });
                    return;
                }
            } else {
                data.profileImg = 'default-path-for-no-image';
            }
    
            const employee = await userModel.findByIdAndUpdate(
                id,
                {
                    $set: data,
                },
                { new: true }
            );
    
            if (!employee) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            res.json({ message: 'User updated', employee });
        } catch (error) {
            console.error('Error in changeUser:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    deleteUser: async (req, res) => {
        console.log("reqq--", req.body);
        let deptId = req.body.id;
        console.log("deleted", deptId);
        userModel.deleteOne({ _id: new ObjectId(deptId) }).then(async (data) => {
            let details = await userModel.find();
            res.json({ delete: true, details });
        });
    },
};
