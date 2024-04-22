const Medicine = require("../models/medicine");
const Request = require("../models/request")
const Donor = require("../models/donor")

exports.approveMed = async (req, res) => {
    try {
        const id = req.query.id;
        const med = await Medicine.findById(id).populate('donor').exec();
        console.log(med);
        if (med) {
            med.approval = !(med.approval);
            await med.save();
            return res.status(200).json({
                med,
                message: "Approval changed"
            });
        }
        else {
            return res.status(400).json({
                message: 'Medicine not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.getAllReq = async (req, res) => {
    try {
        const reqs = await Request.find()
            // .populate('receiver').populate('medicine').exec()
            .populate({
                path: 'receiver',
                model: 'Receiver'
            })
            .populate({
                path: 'medicine',
                model: 'Medicine',
                populate: {
                    path: 'donor',
                    model: 'Donor'
                }
            })
            .exec();
        if (reqs) {
            return res.status(200).json({
                reqs
            });
        }
        else {
            return res.status(400).json({
                message: 'Request not found'
            });
        }
    } catch (error) {

    }
}

exports.getRequestById = async (req, res) => {
    try {
        const id = req.query.id;
        const reqs = await Request.findById(id).populate('receiver').populate('medicine').exec()
        console.log(reqs);
        if (reqs) {
            return res.status(200).json({
                reqs
            });
        }
        else {
            return res.status(400).json({
                message: 'Request not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.acceptRequest = async (req, res) => {
    try {
        const id = req.query.id;
        const reqs = await Request.findById(id).populate('receiver').populate('medicine').exec()
        console.log(reqs);
        if (reqs) {
            reqs.accept = "accept";
            const med = await Medicine.findById(reqs.medicine._id);
            if (med) {
                const original_quantity = med.quantity
                med.quantity = med.quantity - reqs.quantity;
                await med.save()
                reqs.medicine.quantity = original_quantity
                await reqs.save();
                return res.status(200).json({
                    reqs,
                    message: "Request Accepted"
                });
            }
            else {
                return res.status(400).json({
                    message: 'Medicine not found'
                });
            }
        }
        else {
            return res.status(400).json({
                message: 'Request not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.rejectRequest = async (req, res) => {
    try {
        const id = req.query.id;
        const reqs = await Request.findById(id)
        console.log(reqs);
        if (reqs) {
            reqs.accept = "reject";
            await reqs.save();
            return res.status(200).json({
                reqs,
                message: "Medicine Approved"
            });
        }
        else {
            return res.status(400).json({
                message: 'Medicine not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}


exports.donorCount = async (req, res) => {
    try {
        const donors = await Donor.find();
        if (donors) {
            const donorTypeCounts = {};

            donors.forEach(donor => {
                const donorType = donor.donorType;
                donorTypeCounts[donorType] = (donorTypeCounts[donorType] || 0) + 1;
            });

            const result = Object.entries(donorTypeCounts).map(([donorType, count]) => ({
                donorType,
                count: count
            }));

            return res.status(200).json({
                result
            });
        }

        return res.status(400).json({
            message: 'Donor list is empty'
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.availbleMedicine=async(req,res)=>{
    try {
        const meds=await Medicine.find({}, 'name quantity');
        if(meds){
            const pieChartData = meds.map(item => ({
                name: item.name,
                quantity: item.quantity,
            }));
            return res.status(200).json({
                pieChartData
            });
        }
        return res.status(400).json({
            message: 'Medicine list is empty'
        });
    } catch (error) {
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}