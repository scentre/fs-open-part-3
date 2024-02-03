require("dotenv").config();
const express = require("express");
const morgan = require("morgan");

const app = express();

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use(express.static("dist"));

const PhoneBook = require("./models/phoneBook");

// Use the 'combined' format for morgan to include request bodies
morgan.token("body", (req) => JSON.stringify(req.body));
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

app.get("/api/person/:id", function (req, res, next) {
  const id = Number(req.params.id);

  PhoneBook.findById(id)
    .then((phoneBook) => {
      if (phoneBook) {
        res.json(phoneBook);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

app.delete("/api/person/:id", (request, response, next) => {
  const id = Number(request.params.id);

  PhoneBook.deleteOne({ id: id })
    .then((result) => {
      console.log(result);

      response.status(204).end();
    })
    .catch((error) => next(error));
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

  phone.validate((err) => {
    if (err) console.log(err);
    else console.log("validatin passed");
  });

  phone.save().then((savedPhone) => {
    res.json(savedPhone);
  });
});

app.put("/api/person/:id", (request, response, next) => {
  const { name, phoneNo } = request.body;

  PhoneBook.findByIdAndUpdate(
    request.params.id,
    { name, phoneNo },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatePhoneBook) => {
      response.json(updatePhoneBook);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response) => {
  PhoneBook.find({}).then((res) => {
    response.json({ length: res.length });
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);
// this has to be the last loaded middleware.
app.use(errorHandler);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`listensing on port ${PORT}`);
});
