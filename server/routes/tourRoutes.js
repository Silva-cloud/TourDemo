const express = require('express');
const tourController = require('../controllers/tourControllers');

const router = express.Router();

// router.param("id", tourController.checkID)

router
  .route('/')
  .post(tourController.saveATour)
  .get(tourController.getAllTours);

router
  .route('/top-5-cheap')
  .get(tourController.top5CheapAliase, tourController.getAllTours);

router.route('/get-tour-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .get(tourController.getASpecificTour)
  .patch(tourController.editATour)
  .delete(tourController.deleteATour);

module.exports = router;
