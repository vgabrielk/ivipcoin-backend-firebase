'use strict';

const firebase = require('../db');
const Task = require('../models/task');
const firestore = firebase.firestore();


const addTask = async (req, res, next) => {
    try {
        console.log(req.body)
        const data = req.body;
        await firestore.collection('tasks').doc().set(data);
        res.send('Task saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllTasks = async (req, res, next) => {
    try {
        const tasks = await firestore.collection('tasks');
        const data = await tasks.get();
        const taskArray = [];
        if(data.empty) {
            res.status(404).send('No task record found');
        }else {
            data.forEach(doc => {
                const task = new Task(
                    doc.id,
                    doc.data().task_title,
                    doc.data().task_status,
                );
                taskArray.push(task);
            });
            res.send(taskArray);
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const task = await firestore.collection('tasks').doc(id);
        const data = await task.get();
        if(!data.exists) {
            res.status(404).send('Task with the given ID not found');
        }else {
            res.send(data.data());
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const updateTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const task =  await firestore.collection('tasks').doc(id);
        await task.update(data);
        res.send('Task record updated successfuly');        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const deleteTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        await firestore.collection('tasks').doc(id).delete();
        res.send('Task deleted successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addTask,
    getAllTasks,
    getTask,
    updateTask,
    deleteTask
}