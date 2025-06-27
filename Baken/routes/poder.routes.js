const express = require('express');
const router = express.Router();
const {
  createPoder,
  getAll,
  getById,
  updatePoder,
  deletePoder
} = require('../controllers/poder.controller');

router.post('/', createPoder);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updatePoder);
router.delete('/:id', deletePoder);

module.exports = router;
