const Receiver = require('../models/receiver');
const jwt=require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const existingReceiver = await Receiver.findOne({ email: req.body.email });

        if (existingReceiver) {
            return res.status(400).json({
                message: 'Receiver Already Registered'
            });
        }

        const newReceiver = new Receiver({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            location: req.body.location,
            receiverType: req.body.receiverType
        });

        await newReceiver.save();

        return res.status(200).json({
            message: 'Receiver Created Successfully'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
};

exports.login = async (req, res) => {
    try {
        const existingReceiver = await Receiver.findOne({ email: req.body.email});

        if (existingReceiver) {
            if (existingReceiver.authenticate(req.body.password)) {
                const token = jwt.sign({ _id: existingReceiver._id, role: existingReceiver.role }, "test", { expiresIn: '1h' })
                const { _id, name, email,location,receiverType, role } = existingReceiver;
                res.status(200).json({
                    token,
                    Receiver: {
                        _id, name, email,location,receiverType, role
                    },
                    status: 200
                })
            }

            else {
                res.status(400).json({
                    message: "Enter correct credentials"
                })
            }
        }

        else{
            res.status(400).json({
                message: "Receiver doesn't exist"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}

exports.getAllReq=async(req,res)=>{
    
    try {
        const ngo_id=req.params.id;
        const ngo=await Receiver.findById(ngo_id).populate({
            path: 'requestlist',
            populate: {
                path: 'medicine',
                model: 'Medicine', 
            },
        })
        .exec();


        if(ngo){
            const requestList = ngo.requestlist; 
            res.status(200).json({
                requestList
            });
        }
        else{
            res.status(400).json({
                message: "Receiver doesn't exist"
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error,
            message: 'Something Went Wrong'
        });
    }
}