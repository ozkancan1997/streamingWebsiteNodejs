const express = require('express');
const router = express.Router();
const {getAllVideos, registerVideo, uploadVideo, streamVideo, updateVideo, deleteVideo} = require('../controllers/tasks');

router.route('/').get(getAllVideos).post(registerVideo);
router.route('/:id').get(streamVideo).patch(updateVideo).delete(deleteVideo);
router.route('/upload').post(uploadVideo);

module.exports = router;