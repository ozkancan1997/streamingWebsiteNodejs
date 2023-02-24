const express = require('express');
const router = express.Router();
const {getAllVideos, uploadVideo, streamVideo, updateVideo, deleteVideo} = require('../controllers/tasks');

router.route('/').get(getAllVideos).post(uploadVideo);
router.route('/:id').get(streamVideo).patch(updateVideo).delete(deleteVideo);

module.exports = router;