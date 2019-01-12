const express = require('express');
const cors = require('cors');
const projects = require('./data/helpers/projectModel');
const actions = require('./data/helpers/actionModel');
const morgan = require('morgan');

const server = express();
server.use(cors());
server.use(express.json());
server.use(morgan('common'));

// COMPLETE Get all projects and actions
// TODO Create actions and projects
// TODO Get projects and actions by id
// TODO Remove projects and actions by id
// TODO Update projects and actions
// TODO Retrieve actions for project

server.get('/api/projects', (req, res) => {
    projects.get().then(projects => {
        res.status(200).json(projects);
    });
});

server.get('/api/actions', (req, res) => {
    actions.get().then(actions => {
        res.status(200).json(actions);
    });
});

server.post('/api/projects', (req, res) => {
    if (!req.body) {
        res.status(400).json({
            errMessage: 'Please include a project name and description',
        });
        return;
    }
    let { name, description, completed } = req.body;

    if (!name || !description) {
        res.status(400).json({
            errMessage: 'Please include a project name and description',
        });
        return;
    }

    if (name.length >= 128) {
        res.status(400).json({
            errMessage: 'Maximum name length 128 exceeded',
        });
    }

    completed = typeof completed === 'undefined' ? false : completed;

    console.log(completed);

    project = { name: name, description: description, completed: completed };

    projects
        .insert(project)
        .then(result => {
            projects
                .get(result.id)
                .then(project => {
                    res.status(201).json(project);
                })
                .catch(err => {
                    res.status(500).json({ errMessage: err });
                });
        })
        .catch(err => {
            res.status(500).json({ errMessage: err });
        });
});

server.post('/api/actions', async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            errMessage:
                'Please include an associated project id, description, notes, and optionally completion boolean',
        });
        return;
    }

    let { project_id, description, notes, completed } = req.body;

    if ((!project_id, !description, !notes)) {
        res.status(400).json({
            errMessage:
                'Please include an associated project id, description, notes, and optionally completion boolean',
        });
        return;
    }

    if (description.length >= 128) {
        res.status(400).json({
            errMessage: 'Manimum description lenght of 128 exceeded',
        });
        return;
    }

    const projectsList = await projects.get();

    if (!projectsList[project_id]) {
        res.status(404).json({
            errMessage: 'Project by this ID does not exist',
        });
        return;
    }
    console.log('test');

    completed = typeof completed === 'undefined' ? false : completed;

    const action = {
        project_id: project_id,
        description: description,
        notes: notes,
        completed: completed,
    };

    actions
        .insert(action)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ errMessage: 'Action not added' });
        });

    // await projects.get(project_id).catch(err => {
    // });
});

server.get('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    projects
        .get(id)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(404).json({
                errMessage: 'Project by this ID does not exist',
            });
        });
});

server.get('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    actions
        .get(id)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(404).json({
                errMessage: 'Action by this ID does not exist',
            });
        });
});

server.put('/api/projects/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (changes === {}) {
        res.status(400).json({
            errMessage: 'Please include changes to commit',
        });
        return;
    }

    projects
        .update(id, changes)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                errMessage: 'Project by this id does not exist.',
            });
        });
});

server.put('/api/actions/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    console.log(changes);

    if (JSON.stringify(changes) === '{}') {
        res.status(400).json({
            errMessage: 'Please include changes to commit',
        });
        return;
    }

    actions
        .update(id, changes)
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({
                errMessage: 'Action by this id does not exist.',
            });
        });
});

server.delete('/api/projects/:id', (req, res) => {
    const { id } = req.params;

    projects
        .remove(id)
        .then(result => {
            projects
                .get(id)
                .then(result => {
                    res.status(500).json({
                        errMessage: 'Project not deleted.',
                    });
                })
                .catch(err => {
                    res.status(201).json({
                        errMessage: 'Project successfully deleted',
                    });
                });
        })
        .catch(err => {
            res.status(404).json({
                errMessage: 'Project by this id does not exist.',
            });
        });
});

server.delete('/api/actions/:id', (req, res) => {
    const { id } = req.params;

    actions
        .remove(id)
        .then(result => {
            actions
                .get(id)
                .then(result => {
                    res.status(500).json({
                        errMessage: 'Project not deleted.',
                    });
                })
                .catch(err => {
                    res.status(201).json({
                        errMessage: 'Project successfully deleted',
                    });
                });
        })
        .catch(err => {
            res.status(404).json({
                errMessage: 'Project by this id does not exist.',
            });
        });
});

server.get('/api/projects/:id/actions', (req, res) => {
    const { id } = req.params;
    console.log(id);

    projects
        .get(id)
        .then(result => {
            res.status(200).json(result.actions);
        })
        .catch(err => {
            res.status(404).json({
                errMessage: 'Project by this id does not exist.',
            });
        });
});

module.exports = server;
