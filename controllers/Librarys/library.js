const { validationLibraryData } = require("./libraryHelper");
const mongoose = require("mongoose");
const db = require("../../models/index");
const Librarys = db.Librarys;


exports.newLibrary = async (req, res) => {
    const data = req.body
    const { valid, errors } = validationLibraryData(data);
    try {
        if (!valid) {
            return res.status(400).json({
                errors,
            });
        } else {
            const library = new Librarys({
                _id: new mongoose.Types.ObjectId(),
                library_name: data.name,
                llibrary_phone_no: data.phoneNumber,
                library_city: data.city,
                library_addrress: data.address,
                library_status: true,
                // created_at: ISTTime,
                is_deleted: false
            })

            library.save()
                .then(async (result) => {
                    await result.save()
                })
                .catch((err) => {
                    console.log(err)
                    res.status(500).json({
                        message: err.toString()
                    })
                });
            return res.status(201).json({
                message: "Library is created...!!",
            });
        }
    } catch (error) {
        return res.status(400).json({ errors: "something want to worng" });
    }
}

exports.listLibrarys = async (req, res) => {
    try {
        const librarys = await Librarys.find();
        return res.status(200).json({ librarys: librarys })
    } catch (error) {
        return res.status(400).json({ error: "Something went to wrong..." })
    }
}

exports.libraryDetails = async (req, res) => {
    try {
        const errors = [];
        const id = req.params.library_id;
        const libraryData = await Librarys.findById(id);
        if (libraryData === undefined) {
            errors.push({ msg: "Library data not found...!!" });
            return res.status(403).json({
                errors
            })
        }
        return res.status(200).json({ libraryData: libraryData });
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}

exports.updateLibraryDetails = async (req, res) => {
    try {
        const id = req.params.library_id;
        const data = req.body;
        const { valid, errors } = validationLibraryData(data);
        if (!valid) {
            return res.status(400).json({
                errors
            });
        }
        await Librarys.findByIdAndUpdate(id,
            {
                $set: {
                    library_name: data.name,
                    llibrary_phone_no: data.phoneNumber,
                    library_city: data.city,
                    library_addrress: data.address,
                }
            },
        )
        const updateData = await Librarys.findById(id)
        return res.status(200).json({ libraryData: updateData })
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.code });
        return res.status(400).json({ error })
    }

}

exports.libraryRemove = async (req, res) => {
    try {
        const id = req.params.library_id;
        const libraryremoved = await Librarys.findByIdAndRemove({ _id: id })
        if (libraryremoved) {
            return res.status(200).json("Library deleted...");
        } else {
            return res.status(400).json("Library is not available")
        }
    } catch (error) {
        const errors = [];
        errors.push({ msg: error.message });
        return res.status(400).json(error);
    }
}