const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createPokemon,
  getAll,
  getById,
  updatePokemon,
  deletePokemon
} = require('../controllers/pokemon.controller');


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post('/', upload.single('imagen'), createPokemon);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', upload.single('imagen'), updatePokemon);
router.delete('/:id', deletePokemon);

module.exports = router;
