const express = require('express');
const Employee = require('../models/employee');
const config = require ('../data/config.json')

const router = express.Router();

/**
 * findEmployeeId
 */
router.get('/:empId', async(req, res) => {
  try
  {
    Employee.findOne({'empId': req.params.empId}, function(err, emp) {
      /**
       * if there is a mongodb error, handle it and return a 501 error message
       */
      if(err)
      {
        console.log(err);
        res.status(501).send({
          'err': config.mongoServerError + ': ' + err.message
        })
      }
      /**
       * If there is no error, return the emp object from MongoDB
       */
      else
      {
        console.log(emp);
        res.json(emp); // returns the data as JSON
      }
    })
  }
  /**
   * For any potential server errors
   */
  catch(e) {
    console.log(e);
    res.status(500).send({
      'err': config.serverError + ': ' + e.message
    })
  }
})

/**
 * findAllTasks
 */
router.get('/:empId/tasks', async(req, res) => {
  try {
    Employee.findOne({'empId': req.params.empId}, 'empId todo done', function(err, emp) {
      if (err) {
        console.log(err);
        res.status(501).send({
          'err': config.mongoServerError + ': ' + err.message
        })
      } else {
        console.log(emp);
        res.json(emp);
      }
    })
  } catch (e) {
    console.log(e);
    res.status(500).send({
      'err': config.serverError + ': ' + e.message
    })
  }
})

/**
 * createTask
 */
router.post('/:empId/tasks', async(req, res) => {
  try {
    Employee.findOne({'empId': req.params.empId}, function(err, emp) {
      if (err) {
        console.log(err);
        res.status(501).send({
          'err': config.mongoServerError + ': ' + err.message
        })
      } else {
        console.log(emp);

        const newTask = {
          text: req.body.text
        }

        emp.todo.push(newTask);

        emp.save(function(err, updatedEmp) {
          if (err) {
            console.log(err);
            res.status(501).send({
              'err': config.mongoServerError + ': ' + err.message
            })
          } else {
            console.log(updatedEmp);
            res.json(updatedEmp);
          }
        })
      }
    })
  } catch (e) {
    console.log(e);
    res.status(500).send({
      'err': config.serverError + ': ' + e.message
    })
  }
})

module.exports = router;
