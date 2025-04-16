const express = require('express');
const router = express.Router();
const { Donation } = require('../../model/donation.js');

router.post('/', async (req, res) => {
    try {
        const { donationId } = req.body;
        if (!donationId) return res.status(400).json({ message: "DonationId not provided" });
        
        const donation = await Donation.findByIdAndUpdate(donationId, {
            status: "claimed",
            claimedBy: {
                userId: req.user._id,
                name: req.user.username || req.user.name,
                email: req.user.email,
                contactNumber: req.user.contactNumber || 'Not provided'
            }
        });

        if (!donation) return res.status(404).json({ message: "Donation not found" });
        req.user.claimedDonations.push(donationId);
        await req.user.save();
        res.status(200).json({ message: "Donation claimed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
