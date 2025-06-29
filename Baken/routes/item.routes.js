const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');

const {createItem,getAllItems,getItemById,updateItem,deleteItem} = require('../controllers/item.controller');

router.post('/', upload.single('imagen'), createItem);
router.get('/', getAllItems);
router.get('/:id', getItemById);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);

module.exports = router;
