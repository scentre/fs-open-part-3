const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static("dist"));

let data = [
  {
    id: 1,
    name: "Arto Hellas",
    phoneNo: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    phoneNo: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    phoneNo: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    phoneNo: "39-23-6423122",
  },
];

// Use the 'combined' format for morgan to include request bodies
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] :response-time ms - :body - :req[content-length]"
  )
);

//generate id
function generateId() {
  return Math.floor(Math.random() * 125);
}

app.get("/api/person", function (req, res) {
  res.json(data);
});

app.get("/api/person/:id", function (req, res) {
  const id = Number(req.params.id);

  let responseData = data.find((each) => each.id === id);

  if (responseData) {
    res.json(responseData);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/person/:id", (request, response) => {
  const id = Number(request.params.id);
  data = data.filter((each) => each.id !== id);

  response.status(204).end();
});

//

app.post("/api/persons", (req, res) => {
  const { name, phoneNo } = req.body;

  if (!name || !phoneNo) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  if (data.find((each) => each.name == name)) {
    return res.status(400).json({
      error: "duplicate name",
    });
  }

  const person = {
    id: generateId(),
    name,
    phoneNo,
  };

  data = data.concat(person);

  res.json(person);
});

app.get("/info", function (req, res) {
  let responseData = `<p>
  
  phonebook has info for  
   ${data.length} people
  <br/>
  ${new Date()}
    </p>`;

  res.send(responseData);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listensing on port ${PORT}`);
});
