/**
 * Title: employee-api.js
 * Author: Prof. Krasso
 * Date: 15 January 2023
 * Modified By: Patrick Wolff
 * Description: Employee API
 */

const express = require('express');
const Employee = require('../models/employee');
const config = require ('../data/config.json')
const router = express.Router();

/**
 * findEmployeeId
 * @openapi
 * /api/employees/{empId}:
 *  get:
 *    tags:
 *      - Employees
 *    description: API for returning employee by empId
 *    summary: returns employee document matching empId in params
 *    parameters:
 *      - in: path
 *        name: empId
 *        schema:
 *          type: number
 *          description: empId to search for
 *    responses:
 *      '200':
 *        description: Employee document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
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
 * @openapi
 * /api/employees/{empId}/tasks:
 *  get:
 *    tags:
 *      - Employees
 *    description: Gets all tasks for one employee
 *    summary: returns all tasks for one employee
 *    parameters:
 *      - in: path
 *        name: empId
 *        schema:
 *          type: number
 *          description: empId to search for
 *    responses:
 *      '200':
 *        description: Employee document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
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
 * @openapi
 * /api/employees/{empId}/tasks:
 *  post:
 *    tags:
 *      - Employees
 *    description: Creates new task for the todo list
 *    summary: Creates new task for the todo list
 *    parameters:
 *      - in: path
 *        name: empId
 *        schema:
 *          type: number
 *          description: empId to search for
 *    requestBody:
 *      description: task title
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - text
 *              - dueDate
 *            properties:
 *              text:
 *                type: string
 *              dueDate:
 *                type: string
 *                format: date
 *    responses:
 *      '200':
 *        description: Employee document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
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

/**
 * updateTask
 * @openapi
 * /api/employees/{empId}/tasks:
 *  put:
 *    tags:
 *      - Employees
 *    description: Updates existing tasks
 *    summary: Updates existing tasks
 *    parameters:
 *      - in: path
 *        name: empId
 *        schema:
 *          type: number
 *          description: empId to search for
 *    requestBody:
 *      description: task title
 *      content:
 *        application/json:
 *          schema:
 *            required:
 *              - todo
 *              - done
 *            properties:
 *              todo:
 *                type: array
 *                items:
 *                  properties:
 *                    text:
 *                      type: string
 *                    dueDate:
 *                      type: string
 *                      format: date
 *              done:
 *                type: array
 *                items:
 *                  properties:
 *                    text:
 *                      type: string
 *                    dueDate:
 *                      type: string
 *                      format: date
 *    responses:
 *      '200':
 *        description: Employee document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
 */
router.put('/:empId/tasks', async (req, res) => {
  try {
    Employee.findOne({'empId' : req.params.empId}, function(err, emp) {

      if (err) {
        console.log(err);
        res.status(501).send({
          'err': 'MongoDB server error: ' + err.message
        })
      } else {

        console.log(emp);

        if (emp) {
          emp.set({
            todo: req.body.todo,
            done: req.body.done
          });

          emp.save(function(err, updatedEmp) {
            if (err) {
              console.log(err);
              res.status(501).send({
                'err': 'MongoDB server error: ' + err.message
              })
            } else {
              console.log(updatedEmp);
              res.json(updatedEmp);
            }
          })
        } else {
          console.log('no employee matching the passed-in empId: ' + req.params.empId);
          res.status(501).send({
            'err': 'EmployeeId: ' + req.params.empId + ' does not belong to the registered user.'
          })
        }
      }
    })
  } catch (e) {
    console.log(e);
    res.status(500).send({
      'err': 'Internal server error: ' + e.message
    })
  }
})

/**
 * deleteTask
 * @openapi
 * /api/employees/{empId}/tasks/{taskId}:
 *  delete:
 *    tags:
 *      - Employees
 *    description: Delete a task
 *    summary: Delete a task
 *    parameters:
 *      - in: path
 *        name: empId
 *        schema:
 *          type: number
 *          description: empId to search for
 *      - in: path
 *        name: taskId
 *        type: string
 *        description: mongoDB _id of task to be deleted
 *    responses:
 *      '200':
 *        description: Employee document
 *      '500':
 *        description: Server Exception
 *      '501':
 *        description: MongoDB Exception
 *
 */
router.delete('/:empId/tasks/:taskId', async(req, res) => {
  try {
    Employee.findOne({'empId': req.params.empId}, function(err, emp) {
      if (err) {
        console.log(err);
        res.status(501). send({
          'err': 'MongoDB server error: ' + err.message
        })
      } else {

        console.log(emp);

        if(emp) {

          const taskId = req.params.taskId;

          const todoItem = emp.todo.find(item => item._id.toString() === taskId);
          const doneItem = emp.done.find(item => item._id.toString() === taskId);

        if (todoItem) {

          emp.todo.id(todoItem._id).remove();

          emp.save(function(err, updatedTodoItemEmp) {
            if (err) {
              console.log(err);
              res.status(501).send({
                'err': 'MongoDB server error: ' + err.message
              })
            } else {
              console.log(updatedTodoItemEmp);
              res.json(updatedTodoItemEmp);
            }
          })

        } else if(doneItem) {

          emp.done.id(doneItem._id).remove();

          emp.save(function(err, updatedDoneItemEmp) {
            if (err) {
              console.log(err);
              res.status(501).send({
                'err': 'MongoDB server error: ' + err.message
              })
            } else {
              console.log(updatedDoneItemEmp);
              res.json(updatedDoneItemEmp);
            }
          })

        } else {
          console.log('Invalid taskId: ' + taskId);
          res.status(401).send({
            'err': 'Invalid taskId: ' + taskId
          })
        }

        } else {
          console.log('no employee matching the passed-in empId: ' + req.params.empId);
          res.status(501).send({
            'err': 'EmployeeId: ' + req.params.empId + ' does not belong to the registered user.'
          })
        }
      }
    })
  } catch (e) {
    console.log(e);
    res.status(501).send({
      'err': 'Internal server error: ' + e.message
    })
  }
})

module.exports = router;
