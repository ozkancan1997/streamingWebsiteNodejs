const express = require('express');
const router = express.Router();
const {getIndex, getAllVideos, registerVideo, bringVideo, uploadVideo, streamVideo, updateVideo, deleteVideo, login, getLoginPage, register, getRegisterPage} = require('../controllers/tasks');

router.route('/videos/').get(getIndex).post(registerVideo);
router.route('/videos/:id').get(bringVideo).patch(updateVideo).delete(deleteVideo);
router.route('/videos/:id/watch').get(streamVideo)
router.route('/videos/upload').post(uploadVideo);
router.route('/videos/search/:query').get(getAllVideos)
router.route('/user/login').get(getLoginPage).post(login)
router.route('/user/register').get(getRegisterPage).post(register)

module.exports = router;