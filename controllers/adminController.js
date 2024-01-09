const deptModel = require('../models/departments');
const userModel = require("../models/employees");
const Image = require("../models/imageSchema")
const adminCollection = require("../models/adminSchema");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;



const JWT_SECRET = "qpuEEAkckC40XDAhjKUpEbvvEWdoNf";

module.exports = {

    getAdmin : async (req, res) => {
        let admin;
        try {
            admin = await adminCollection.find(); 
            res.status(200).json({ admin })
        } catch (error) {
            console.log(error);
        }
    },

    adminLogin: async (req, res) => {
        try {
            const { username, password } = req.body;
            console.log("admin", req.body);
            let admin = await adminCollection.findOne({ username: username });
            console.log(admin);
            if (!admin) {
                res.json({ error: "not found" });
            } else {
                if (password !== admin.password) {
                    res.json({ pswdError: "Incorrect password" });
                } else {
                    console.log("admin password");
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
    
    // imageUpload: (req, res) => {
    //     console.log(req.body);
    //     const { deptId } = req.body;

    //     const imgUrl = req.file.filename;

    //     departments.updateOne({ _id: new ObjectId(deptId) }, { $set: { image: imgUrl } }).then((da) => {
    //         console.log(da);
    //         res.json({ status: true, imageUrl: imgUrl });
    //     });
    // },

    addDepartment: async (req, res) => {
        try {
            const { deptName, yearFounded, description } = req.body;
        
            let data = {
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
                    console.log('Image uploaded:', newImage.path);
                } catch (imageError) {
                    console.error('Error saving image:', imageError);
                    res.status(500).json({ error: 'Error saving image' });
                    return; 
                }
            } else {
                data.deptImg = 'default-path-for-no-image';
            }
        
            const existingDept = await deptModel.findOne({ deptName: deptName });
        
            if (!existingDept) {
                const newDept = new deptModel(data);
                await newDept.save();
                res.status(200).json({ message: 'added successfully', data });
            } else {
                console.log("Department already exists");
                res.status(400).json({ error: "Department already exists" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },


    viewDepartments: async (req,res) => {
        try {
            departments = await deptModel.find(). 
            then(departments => res.json(  departments ))
        } catch (error) {
            console.log(error);
        }
    },

    department : async (req,res) => {
        let department
        const id = req.params.id;
        try {
            department = await deptModel.findById(id) ;
            // console.log(department);
            res.status(200).json({ department })
        } catch (error) {
            console.log(error);
        }
    },

    updateDepartment: async (req,res) => {
        let department;
        const id = req.params.id;
        const { deptName, yearFounded, deptImg, description } = req.body;
        try {
            department = await deptModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        deptName,
                        yearFounded,
                        deptImg,
                        description,
                    },
                },
                { new: true }
            );
            department = await department.save().then( () => {
                res.json({ message: 'updated' })
            })
        } catch (error) {
            console.log(error);
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
            }

            if(req.file){
                const profileImg = req.file.filename;
                const newProfileImg = new Image({ path: profileImg })

                try {
                    await newProfileImg.save();
                    data.profileImg = newProfileImg.path;
                    console.log('Image uploaded:', newProfileImg.path);
                } catch {
                    console.error('Error saving image:', imageError)
                    res.status(500).json({ error: 'Error saving image' })
                    return;
                }
            } else {
                data.profileImg = 'default-path-for-no-image';
            }

            const existingUser = await userModel.findOne({ employeeName: employeeName });

            if(!existingUser) {
                const newUser = new userModel(data);
                await newUser.save()
                res.status(200).json({ message: 'added successfully', data });
            } else {
                console.log("User already exists");
                res.status(400).json({ error: "User already exists" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
 

    viewEmployees: async (req,res) => {
        try {
            employees = await userModel.find(). 
            then(employees => res.json(  employees ))
            // console.log(employees);
        } catch (error) {
            console.log(error);
        }
    },

    employees : async (req,res) => {
        let employee
        const id = req.params.id;
        try {
            employee = await userModel.findById(id) ;
            res.status(200).json({ employee })
        } catch (error) {
            console.log(error);
        }
    },

    

    changeUser: async (req, res) => {
        const userData = req.body;
        const id = userData.id;
        const username = userData.username;
        // console.log(id,username);
        console.log("user_name ", username);
        const existingUser = await userModel.findOne({ username: username });
        if (!existingUser) {
            userModel.updateOne({ _id: new ObjectId(id) }, { $set: { username: username } }).then((data) => {
                console.log("updated_usename", req.body.username, data);
                res.json({ update: true, data });
            });
        } else {
            res.json({ error: "exist" });
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
    
}
