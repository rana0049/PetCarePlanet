const Pet = require('../models/Pet');

// @desc    Get all pets for logged in user
// @route   GET /api/pets
// @access  Private
const getPets = async (req, res) => {
    try {
        const pets = await Pet.find({ owner: req.user._id });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new pet
// @route   POST /api/pets
// @access  Private
const createPet = async (req, res) => {
    const { name, type, breed, age, gender } = req.body;

    try {
        const pet = new Pet({
            owner: req.user._id,
            name,
            type,
            breed,
            age,
            gender,
        });

        const createdPet = await pet.save();
        res.status(201).json(createdPet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Private
const getPetById = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet && pet.owner.toString() === req.user._id.toString()) {
            res.json(pet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update pet health (weight, vaccinations)
// @route   PUT /api/pets/:id/health
// @access  Private
const updatePetHealth = async (req, res) => {
    const { weight, vaccination, medicalRecord } = req.body;

    try {
        const pet = await Pet.findById(req.params.id);

        if (pet && pet.owner.toString() === req.user._id.toString()) {
            if (weight) {
                pet.weightHistory.push({ weight });
            }
            if (vaccination) {
                pet.vaccinations.push(vaccination);
            }
            if (medicalRecord) {
                pet.medicalHistory.push(medicalRecord);
            }

            const updatedPet = await pet.save();
            res.json(updatedPet);
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (pet && pet.owner.toString() === req.user._id.toString()) {
            await pet.deleteOne();
            res.json({ message: 'Pet removed' });
        } else {
            res.status(404).json({ message: 'Pet not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPets, createPet, getPetById, updatePetHealth, deletePet };
