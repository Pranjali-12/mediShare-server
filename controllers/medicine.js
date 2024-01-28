const Donor = require("../models/donor");
const Medicine = require("../models/medicine");
const Receiver = require("../models/receiver");
const Request =require("../models/request")

exports.addMed = async (req, res) => {
    console.log("addMed");
    try {

        const mfDate = new Date(req.body.mf_date);
        const expDate = new Date(req.body.exp_date);

        const new_med = new Medicine({
            donor: req.body.donor,
            name: req.body.name,
            mf_date: mfDate,
            exp_date: expDate,
            illness: req.body.illness,
            quantity: req.body.quantity,
            approval: false
        })

        await new_med.save();

        if (new_med) {
            const updateResult = await Donor.updateOne(
                { _id: req.body.donor },
                { $push: { medicinelist: new_med._id } }
            );

            if (updateResult.modifiedCount === 0) {
                console.error('Donor document not updated.');
            }
        }

        return res.status(200).json({
            message: 'Medicine added Successfully'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}


exports.getAllMed = async (req, res) => {
    try {
        const meds = await Medicine.find().populate('donor', 'firstName lastName').sort({ createdAt: -1 }).exec()

        const transformedMeds = meds.map(med => {
            return {
                id: med._id,
                name: med.name,
                owner: med.donor.firstName + " " + med.donor.lastName,
                illness: med.illness,
                mf_date: med.mf_date,
                exp_date: med.exp_date,
                quantity: med.quantity,
                approval: med.approval,
                createdAt: med.createdAt,
                updatedAt: med.updatedAt,
            };
        });


        if (meds) {
            return res.status(200).json(transformedMeds)
        }

        return res.status(400).json({ message: "There is no medicines" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.getMedById = async (req, res) => {
    try {
        const id = req.query.id;
        const med = await Medicine.findById(id).populate('donor').exec();
        console.log(med);
        if (med) {
            return res.status(200).json({
                med
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

exports.requestMed = async (req, res) => {
    try {
        const med_id = req.query.id;
        const ngo_id = req.body.ngoid;
        const med = await Medicine.findById(med_id);
        const ngo = await Receiver.findById(ngo_id);

        if (!med) {
            return res.status(400).json({
                message: 'Medicine not found'
            });
        }

        if (!ngo) {
            return res.status(401).json({
                message: 'Receiver not found'
            });
        }

        if (med.quantity < req.body.quantity) {
            return res.status(400).json({
                message: `Only ${med.quantity} medicine is available`
            });
        }

        const newRequest = new Request({
            receiver: ngo_id,
            medicine: med_id,
            quantity: req.body.quantity
        });

        await newRequest.save();

        if (newRequest) {
            const updateResult = await Receiver.updateOne(
                { _id: ngo_id },
                { $push: { requestlist: newRequest._id } }
            );

            if (updateResult.modifiedCount === 0) {
                console.error('Receiver document not updated.');
            }

            return res.status(200).json({
                newRequest,
                message: "Request Created Successfully"
            });
        }

        return res.status(400).json({
            message: "Error while creating request"
        });


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.getmedbyid = async (req, res) => {
    try {
      const medicine = await Medicine.findById(req.params.id).populate('donor').exec(); // Assuming you're using Mongoose for MongoDB
      if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
      }
      res.json(medicine);
    } catch (error) {
      console.error('Error fetching medicine by ID:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

