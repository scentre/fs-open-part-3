const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ebuka:${password}@cluster0.7ui4ayg.mongodb.net/phoneBook`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

////

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNo: String,
});

const PhoneBook = mongoose.model("phoneBook", phoneBookSchema);

if (process.argv.length == 3) {
  PhoneBook.find({}).then((result) => {
    result.forEach((phoneBook) => {
      console.log(phoneBook);
    });
    mongoose.connection.close();
  });
} else {
  const phoneBook = new PhoneBook({
    name: process.argv[3],
    phoneNo: process.argv[4],
  });

  phoneBook.save().then((result) => {
    console.log(
      `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
    );
    mongoose.connection.close();
  });
}
