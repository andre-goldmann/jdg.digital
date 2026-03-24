const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const workspaceDir =
  process.env.OPENCLAW_WORKSPACE_ROOT || path.resolve(__dirname, '..', '..');

app.use(express.json());
app.use(express.text());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files if they don't exist
const tasksFile = path.join(dataDir, 'tasks.json');
const activityFile = path.join(dataDir, 'activity.json');

if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify({ projects: [] }, null, 2));
}

if (!fs.existsSync(activityFile)) {
  fs.writeFileSync(activityFile, JSON.stringify({ activities: [] }, null, 2));
}

// Helper functions
function readTasksData() {
  try {
    return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  } catch {
    return { projects: [] };
  }
}

function writeTasksData(data) {
  fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2));
}

function readActivityData() {
  try {
    return JSON.parse(fs.readFileSync(activityFile, 'utf8'));
  } catch {
    return { activities: [] };
  }
}

function writeActivityData(data) {
  fs.writeFileSync(activityFile, JSON.stringify(data, null, 2));
}

function addActivity(action, title, description, metadata = {}) {
  const data = readActivityData();
  data.activities.unshift({
    id: `act-${uuidv4()}`,
    timestamp: new Date().toISOString(),
    action,
    title,
    description,
    metadata,
    status: 'completed',
  });
  writeActivityData(data);
}

// ── API Routes ──

// Get all projects
app.get('/api/projects', (_req, res) => {
  res.json(readTasksData());
});

// Create new project
app.post('/api/projects', (req, res) => {
  const { name, description, docs } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Project name is required' });
  }

  const data = readTasksData();
  const newProject = {
    id: `proj-${uuidv4().slice(0, 8)}`,
    name,
    description: description || '',
    docs: docs || '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    tasks: [],
    createdAt: new Date().toISOString(),
  };

  data.projects.push(newProject);
  writeTasksData(data);

  addActivity('project_created', 'Project created', `${name} was created`, {
    projectId: newProject.id,
    projectName: name,
  });

  res.status(201).json(newProject);
});

// Get single project
app.get('/api/projects/:projectId', (req, res) => {
  const data = readTasksData();
  const project = data.projects.find((p) => p.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json(project);
});

// Add task to project
app.post('/api/projects/:projectId/tasks', (req, res) => {
  const { title, description, status, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const data = readTasksData();
  const project = data.projects.find((p) => p.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const newTask = {
    id: `task-${uuidv4().slice(0, 8)}`,
    title,
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  project.tasks.push(newTask);
  writeTasksData(data);

  addActivity('task_created', 'Task created', `"${title}" added to ${project.name}`, {
    projectId: project.id,
    projectName: project.name,
    taskId: newTask.id,
  });

  res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:taskId', (req, res) => {
  const data = readTasksData();

  for (const project of data.projects) {
    const taskIndex = project.tasks.findIndex((t) => t.id === req.params.taskId);
    if (taskIndex !== -1) {
      project.tasks[taskIndex] = { ...project.tasks[taskIndex], ...req.body };
      writeTasksData(data);

      if (req.body.status) {
        addActivity(
          'task_updated',
          'Task moved',
          `"${project.tasks[taskIndex].title}" → ${req.body.status}`,
          {
            projectId: project.id,
            projectName: project.name,
            taskId: req.params.taskId,
            newStatus: req.body.status,
          }
        );
      }

      return res.json(project.tasks[taskIndex]);
    }
  }

  res.status(404).json({ error: 'Task not found' });
});

// Get activities
app.get('/api/activity', (req, res) => {
  const data = readActivityData();
  const limit = parseInt(req.query.limit) || 50;

  res.json({ activities: data.activities.slice(0, limit) });
});

// Agent status
app.get('/api/agent-status', (_req, res) => {
  const data = readTasksData();
  let busyTasks = 0;

  data.projects.forEach((project) => {
    busyTasks += project.tasks.filter((t) => t.status === 'in-progress').length;
  });

  if (busyTasks > 0) {
    res.json({
      status: 'busy',
      text: `Busy (${busyTasks} task${busyTasks !== 1 ? 's' : ''})`,
    });
  } else {
    res.json({ status: 'available', text: 'Available' });
  }
});

// Context files
app.get('/api/context-files', (_req, res) => {
  const contextFiles = [
    { name: 'MEMORY.md', description: 'Langzeit-Gedächtnis & Notizen' },
    { name: 'AGENTS.md', description: 'Agent-Verhaltensregeln' },
    { name: 'SOUL.md', description: 'Persönlichkeit & Werte' },
    { name: 'USER.md', description: 'Infos über den User' },
    { name: 'TOOLS.md', description: 'Tool-Konfiguration & Notizen' },
    { name: 'IDENTITY.md', description: 'Name, Vibe, Avatar' },
    { name: 'HEARTBEAT.md', description: 'Periodische Aufgaben' },
  ];

  const files = contextFiles.map((file) => {
    const filePath = path.join(workspaceDir, file.name);
    try {
      const stats = fs.statSync(filePath);
      return { ...file, exists: true, size: stats.size };
    } catch {
      return { ...file, exists: false, size: 0 };
    }
  });

  res.json({ files });
});

// Get context file content
app.get('/api/context-files/:filename', (req, res) => {
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(workspaceDir, safeName);

  // Security check — ensure we stay in the workspace directory
  if (path.relative(workspaceDir, filePath).startsWith('..')) {
    return res.status(403).send('Access denied');
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.type('text/plain').send(content);
  } catch {
    res.status(404).send('File not found');
  }
});

// Update context file
app.put('/api/context-files/:filename', (req, res) => {
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(workspaceDir, safeName);

  // Security check — ensure we stay in the workspace directory
  if (path.relative(workspaceDir, filePath).startsWith('..')) {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    fs.writeFileSync(filePath, req.body);
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to save file' });
  }
});

app.listen(PORT, () => {
  console.log(`OpenClaw Kanban API running on port ${PORT}`);
});
