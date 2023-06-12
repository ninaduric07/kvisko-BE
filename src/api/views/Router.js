const { Router } = require("express");
const { handleRegister } = require('../controllers/Register');
const { handleLogin } = require('../controllers/Login')
const {body} = require('express-validator');
const { handleSession } = require("../controllers/Session");
const { handleLogout } = require("../controllers/Logout");
const { changeName, changeSurname, changeEmail, changePbr, changePassword, changeImage } = require("../controllers/ChangeProfile");
const{ getAdmins, getNonAdmins, setAdmin, removeAdmin, searchNonAdmins } = require("../controllers/ManageAdmins");
const{defaultController} = require("../controllers/DefaultController.js");
const { getCategories, deleteCategory, newCategory, searchCategories } = require("../controllers/Categories");
const { createQuiz } = require("../controllers/createQuiz");
const {searchQuizes, getQuizes, getCategoryQuizes, getOneQuiz, editQuiz, quizChangeName, deleteQuiz, quizChangeDescription, quizChangeDuration, quizChangeImage, quizChangeReviewDuration, searchMainQuizes } = require("../controllers/ManageQuizes");
const {createQuestion1, getQuestions, createIncorrectAnswer, submitSlagalica, createQuestion3} = require("../controllers/createQuestions")
const {getQuestion1,
    getQuestion2,
    editQuestion1, 
    getQuizQuestion, 
    editTextQuestion, 
    addIncorrectAnswer, 
    getCorrectAnswer,
     editCorrectAnswer, 
     deleteIncorrectAnswer,
    getSlagalica,
    deletePair,
    addPair,
    searchQuestions,
    getAllQuestions,
addQuestion, removeQuestion, addAnswer3 } = require("../controllers/getQuestions");
const { getPlayQuiz, savePair, getPlayQuizQuestions, saveAnswer, saveResult, getResult, getReviewQuizQuestions, getResultTable, getLeftPair, getRightPair, saveSlagalica, saveMultipleAnswer } = require("../controllers/playQuiz");

const router = new Router();

router.post('/register',[
    body('name').not().isEmpty(),
    body('surname').not().isEmpty(),
    body('username').not().isEmpty(),
    body('email').isEmail(),
    body('password').isLength({min: 8})
], handleRegister);
router.post('/login', [
    body('usernameOrEmail').not().isEmpty(),
    body('password').isLength({min: 8})
], handleLogin);
router.get('/session', handleSession);
router.get('/logout', handleLogout);
router.post('/changeName', [
    body('name').not().isEmpty()
], changeName);
router.post('/changeSurname', [
    body('surname').not().isEmpty()
], changeSurname);
router.post('/changeEmail', [
    body('email').isEmail()
], changeEmail);
router.post('/changePbr', [
    body('pbr').not().isEmpty()
], changePbr);
router.post('/changePassword', [
    body('newPassword').not().isEmpty()
], changePassword);
router.post('/changeImage', [
], changeImage);
router.get('/admin/getNonAdmins', getNonAdmins);
router.get('/admin/getAdmins', getAdmins);
router.get('/admin/setAdmin/:username', setAdmin);
router.get('/admin/removeAdmin/:username', removeAdmin);
router.get('/admin/searchNonAdmins', [], searchNonAdmins);
router.get('/', defaultController);
router.get('/admin/getCategories', getCategories);
router.post('/admin/newCategory',[
], newCategory);
router.get('/admin/removeCategory/:sifKategorije', deleteCategory);
router.get('/admin/searchCategories', [], searchCategories);
router.post('/admin/createQuiz', [], createQuiz);
router.get('/admin/searchQuizes', [], searchQuizes);
router.get('/admin/getQuizes', getQuizes);
router.get('/admin/getQuiz/:sifKviz', getOneQuiz);
router.post('/admin/quiz/changeName/:sifKviz', [], quizChangeName);
router.post('/admin/quiz/changeImage/:sifKviz', [], quizChangeImage);
router.post('/admin/quiz/changeDescription/:sifKviz', [], quizChangeDescription);
router.post('/admin/quiz/changeDuration/:sifKviz', [], quizChangeDuration);
router.post('/admin/quiz/changeReviewDuration/:sifKviz', [], quizChangeReviewDuration);
router.post('/admin/quiz/editQuiz/:sifKviz', [], editQuiz);
router.post('/admin/quiz/createQuestion1/:sifKviz/:sifTip', [], createQuestion1);
router.post('/admin/quiz/createQuestion3/:sifKviz/:sifTip', [], createQuestion3);
router.post('/admin/quiz/createSlagalica/:sifKviz/:sifTip', [], submitSlagalica);
router.post('/admin/quiz/createIncorrectAnswer/:sifKviz/:sifTip', [], createIncorrectAnswer);
router.get('/admin/quiz/getQuestions/:sifKviz', [], getQuestions);
router.get('/admin/quiz/getQuestion/input/:sifPitanje', [], getQuestion1);
router.get('/admin/quiz/getQuestion2/input/:sifPitanje', [], getQuestion2);
router.post('/admin/quiz/editQuestion/input/:sifPitanje', [], editQuestion1);
router.get('/admin/quiz/getQuizQuestion/:sifPitanje', [], getQuizQuestion);
router.post('/admin/quiz/editTextQuestion/:sifPitanje', [], editTextQuestion);
router.post('/admin/quiz/addIncorrectAnswer/:sifPitanje', [], addIncorrectAnswer);
router.post('/admin/quiz/addAnswer3/:sifPitanje', [], addAnswer3);
router.get('/admin/quiz/getCorrect/:sifPitanje', [], getCorrectAnswer);
router.post('/admin/quiz/editCorrect/:sifPitanjeOdgovor', [], editCorrectAnswer);
router.post('/admin/quiz/deleteIncorrect/:sifPitanjeOdgovor', [], deleteIncorrectAnswer);
router.get('/admin/quiz/getSlagalica/:sifPitanje', [], getSlagalica);
router.post('/admin/quiz/deletePair/:sifSlagalicaPar', [], deletePair);
router.post('/admin/quiz/addPair/:sifPitanje', [], addPair);
router.post('/admin/quiz/deleteQuiz/:sifKviz', [], deleteQuiz);
router.get('/admin/searchQuestions', [], searchQuestions);
router.get('/admin/quiz/getAllQuestions', [], getAllQuestions);
router.get('/admin/quiz/addQuestion/:sifKviz/:sifPitanje', [], addQuestion);
router.post('/admin/quiz/removeQuestion/:sifKviz/:sifPitanje', [], removeQuestion);
router.get('/searchQuizes', [], searchMainQuizes);
router.get('/quiz/:sifKviz', [], getPlayQuiz);
router.get('/quiz/getQuestions/:sifKviz', [], getPlayQuizQuestions);
router.post('/quiz/saveAnswer/:sifPitanje/:username', [], saveAnswer);
router.post('/quiz/saveMultipleAnswer/:sifPitanje', [], saveMultipleAnswer);
router.post('/quiz/saveResult/:sifKviz', [], saveResult);
router.get('/quiz/getResult/:sifKviz', [], getResult);
router.get('/quiz/getReviewQuestions/:sifKviz', [], getReviewQuizQuestions);
router.get('/quiz/getResultTable/:sifKviz', [], getResultTable);
router.get('/quiz/getLeftPair/:sifPitanje', [], getLeftPair);
router.get('/quiz/getRightPair/:sifPitanje', [], getRightPair);
router.get('/category/:sifKategorije', [], getCategoryQuizes);
router.post('/quiz/savePair', [], savePair);
router.post('/quiz/saveSlagalica/:sifPitanje', [], saveSlagalica);

module.exports = router;