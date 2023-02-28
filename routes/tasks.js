const express = require('express');
const router = express.Router();
const {getIndex, getAllVideos, registerVideo, bringVideo, uploadVideo, streamVideo, updateVideo, deleteVideo} = require('../controllers/tasks');

router.route('/').get(getIndex).post(registerVideo);
router.route('/:id').get(bringVideo).patch(updateVideo).delete(deleteVideo);
router.route('/:id/watch').get(streamVideo)
router.route('/upload').post(uploadVideo);
router.route('/search/:query').get(getAllVideos)

module.exports = router;