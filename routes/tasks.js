const express = require('express');
const router = express.Router();
const {getIndex,
    checkAuth,
    checkNotAuth,
    queryVideos,
    bringVideo,
    registerVideo,
    uploadVideo,
    streamVideo,
    updateVideo,
    deleteVideo,
    login,
    getLoginPage,
    register,
    getRegisterPage,
    logout,
    getUserVideos,
    userVideos} = require('../controllers/tasks');

router.route('/videos/').get(checkAuth, getIndex);
router.route('/videos/:id').get(checkAuth, bringVideo).patch(updateVideo).delete(deleteVideo);
router.route('/videos/:id/watch').get(checkAuth, streamVideo);
router.route('/videos/search/:query').get(checkAuth, queryVideos);
router.route('/user/login').get(checkNotAuth, getLoginPage).post(login);
router.route('/user/register').get(checkNotAuth, getRegisterPage).post(register);
router.route('/user/logout').get(logout);
router.route('/user/:id').get(checkAuth, getUserVideos).post(userVideos)
router.route('/user/manage/upload').post(uploadVideo)
router.route('/user/manage/register').post(registerVideo)

module.exports = router;