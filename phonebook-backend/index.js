require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static("dist"));

const PhoneBook = require("./models/phoneBook");

// Use the 'combined' format for morgan to include request bodies
morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(
    ":method :url :status :res[content-length] :response-time ms - :body - :req[content-length]"
  )
);

app.get("/api/person", function (req, res) {
  PhoneBook.find({}).then((phoneBook) => {
    res.json(phoneBook);
  });
});

app.get("/api/person/:id", function (req, res) {
  const id = Number(req.params.id);

  PhoneBook.findById(id).then((phoneBook) => {
    res.json(phoneBook);
  });
});

app.delete("/api/person/:id", (request, response) => {
  const id = Number(request.params.id);

  PhoneBook.deleteOne({ id: id }).then((result) => {
    console.log(result);

    response.status(204).end();
  });
});
//

app.post("/api/persons", (req, res) => {
  const { name, phoneNo } = req.body;

  if (!name || !phoneNo) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const phone = new PhoneBook({
    name,
    phoneNo,
  });

  phone.save().then((savedPhone) => {
    res.json(savedPhone);
  });
});

// app.get("/info", function (req, res) {
//   let responseData = `<p>

//   phonebook has info for
//    ${data.length} people
//   <br/>
//   ${new Date()}
//     </p>`;

//   res.send(responseData);
// });

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listensing on port ${PORT}`);
});
