// const { db } = require("../../config/admin");
// const { validationLibraryData } = require("./libraryHelper");


// exports.newLibrary = async (req, res) => {
//     const data = req.body
//     const { valid, errors } = validationLibraryData(data);
//     try {
//             if (!valid) {
//                 return res.status(400).json({
//                     errors,
//                 });
//             } else {
//         const libraryData = {
//             library_name: data.name,
//             llibrary_phone_no: data.phoneNumber,
//             library_city: data.city,
//             library_addrress: data.address,
//             library_status: true,
//             created_at: new Date(),
//             is_deleted: false
//         }
//         await db.collection("librarys").doc().set(libraryData);
//         return res.status(200).json({
//             message: "Library is created...!!",
//         });
//         }
//     } catch (error) {
//         return res.status(400).json({ errors: "something want to worng" });
//     }
// }

// exports.listLibrarys = async (req, res) => {
//     try {
//         const librarys = [];
//         const data = await db.collection("librarys").get();
//         data.forEach((doc) => {
//             if (doc.data().is_deleted === false) {
//                 const library = { id: doc.id, libraryData: doc.data() };
//                 librarys.push(library);
//             }
//         });
//         return res.status(200).json({ librarys: librarys })

//     } catch (error) {
//         return res.status(400).json({ error: "Something went to wrong..." })
//     }
// }

// exports.libraryDetails = async (req, res) => {
//     try {
//         const errors = [];
//         const id = req.params.library_id;
//         const data = await db.collection("librarys").doc(id).get();
//         if (data.data() === undefined) {
//             errors.push({ msg: "Library data not found...!!" });
//             return res.status(403).json({
//                 errors
//             })
//         }
//         const libraryData = data.data();
//         return res.status(200).json({ libraryData: libraryData });
//     } catch (error) {
//         const errors = [];
//         errors.push({ msg: error.message });
//         return res.status(400).json(error);
//     }
// }

// exports.updateLibraryDetails = async (req, res) => {
//     try {
//         const id = req.params.library_id;
//         const data = req.body;
//         const { valid, errors } = validationLibraryData(data);
//         if (!valid) {
//             return res.status(400).json({
//                 errors
//             });
//         }
//         const libraryData = {
//             library_name: data.name,
//             llibrary_phone_no: data.phoneNumber,
//             library_city: data.city,
//             library_addrress: data.address,
//         }
//         const updatelibrary = await db.collection("librarys").doc(id);
//         await updatelibrary.update(libraryData);
//         const ul = await updatelibrary.get();
//         const updateData = ul.data();
//         return res.status(201).json({ libraryData: updateData })
//     } catch (error) {
//         const errors = [];
//         errors.push({ msg: error.code });
//         return res.status(400).json({ error })
//     }

// }

// exports.libraryRemove = async (req, res) => {
//     try {
//         const id = req.params.library_id;
//         const data = await db.collection("librarys").doc(id);
//         await data.update({ is_deleted: true });
//         return res.status(200).json("Library deleted...");
//     } catch (error) {
//         const errors = [];
//         errors.push({ msg: error.message });
//         return res.status(400).json(error);
//     }
// }