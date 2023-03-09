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
    getUserPage,
    userVideos,
    confirm,
    deleteAccount,
    changePass} = require('../controllers/tasks');

router.route('/videos').get(checkAuth, getIndex).post(checkAuth, queryVideos);;
router.route('/videos/:id').get(checkAuth, bringVideo);
router.route('/videos/:id/watch').get(checkAuth, streamVideo);
router.route('/user/login').get(checkNotAuth, getLoginPage).post(login);
router.route('/user/register').get(checkNotAuth, getRegisterPage).post(register);
router.route('/user/logout').get(logout);
router.route('/user/:id').get(checkAuth, getUserPage).post(userVideos)
router.route('/user/:id/account').post(confirm, deleteAccount).patch(confirm, changePass);
router.route('/user/manage/upload').post(uploadVideo)
router.route('/user/manage/register').post(registerVideo);
router.route('/user/manage/delete/:id').delete(deleteVideo);
router.route('/user/manage/update/:id').patch(updateVideo);

module.exports = router;