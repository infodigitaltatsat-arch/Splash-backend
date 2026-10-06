const mongoose = require('mongoose');
const Address = require('../models/Address');

const editableAddressFields = [
    'type',
    'name',
    'mobile',
    'addressLine',
    'city',
    'state',
    'pincode',
    'isDefault',
];

const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user._id,
        }).sort({ createdAt: -1 });

        return res.json(addresses);
    }
    catch (error) {
        console.error('Failed to fetch addresses:', error);
        return res.status(500).json({
            message: 'Failed to fetch addresses',
        });
    }
};

const addAddress = async (req, res) => {
    try {
        const {
            type,
            name,
            mobile,
            addressLine,
            city,
            state,
            pincode,
        } = req.body || {};

        const address = await Address.create({
            user: req.user._id,
            type,
            name,
            mobile,
            addressLine,
            city,
            state,
            pincode,
        });

        return res.status(201).json({
            message: 'Address added successfully',
            address,
        });
    }
    catch (error) {
        console.error('Failed to add address:', error);
        const isValidationError = error instanceof mongoose.Error.ValidationError;
        return res.status(isValidationError ? 400 : 500).json({
            message: isValidationError ? 'Invalid address details' : 'Failed to add address',
        });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid address ID',
            });
        }

        const body = req.body || {};
        const updates = editableAddressFields.reduce((fields, field) => {
            if (Object.prototype.hasOwnProperty.call(body, field)) {
                fields[field] = body[field];
            }
            return fields;
        }, {});

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: 'No valid address fields provided',
            });
        }

        const address = await Address.findOneAndUpdate(
            {
                _id: id,
                user: req.user._id,
            },
            updates,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!address) {
            return res.status(404).json({
                message: 'Address not found',
            });
        }

        return res.json({
            message: 'Address updated successfully',
            address,
        });
    }
    catch (error) {
        console.error('Failed to update address:', error);
        const isValidationError = error instanceof mongoose.Error.ValidationError;
        return res.status(isValidationError ? 400 : 500).json({
            message: isValidationError ? 'Invalid address details' : 'Failed to update address',
        });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid address ID',
            });
        }

        const address = await Address.findOneAndDelete({
            _id: id,
            user: req.user._id,
        });

        if (!address) {
            return res.status(404).json({
                message: 'Address not found',
            });
        }

        return res.json({
            message: 'Address deleted successfully',
        });
    }
    catch (error) {
        console.error('Failed to delete address:', error);
        return res.status(500).json({
            message: 'Failed to delete address',
        });
    }
};

module.exports = {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
};
