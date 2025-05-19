import express from 'express';
import {getAllCourses, getCourseById} from "./get-courses.route";
import {createCourse} from "./create-course.route";
import {searchLessons} from "./search-lessons.route";

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const bodyParser = require('body-parser');

const app = express();

//app.use(bodyParser.json());

//const cors = require('cors');

//app.use(cors({origin: true}));

/*app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});*/

app.get('/:name/:profile', (req, res) => {
  const { name, profile } = req.params;
  console.info(name, profile);
  res.json({
    name: name,
    profiles: [profile],
    label: null,
    version: "1.0",
    propertySources: [{
      name: 'config',
      source: {
        // Replace with your configuration properties
        'myapp.message': 'Hello from Express Config Server'
      }
    }]
  });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.route('/api/courses').get(getAllCourses);

app.route('/api/courses/:id').get(getCourseById);

app.route('/api/courses').post(createCourse);

app.route('/api/search-lessons').get(searchLessons);
