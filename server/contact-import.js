const fs = require("fs");
const csv = require("csv-parser");
const GLHContract = require("./models/glhcontact");
const mongoose = require("mongoose"),
  config = require("./config/main");

// Database Setup
mongoose.connect(config.database, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let rows = [];

fs.createReadStream("./contacts.csv")
  .pipe(csv())
  .on("data", (row) => {
    rows.push(row);
  })
  .on("end", async () => {
    console.log("CSV org file has been successfully imported");
    for (let row of rows) {
      await importContacts(row);
    }
    console.log("Finished importing!");
  });

async function importContacts(row) {
  try {
    const first_name = row["First name"];
    const last_name = row["Last name"];
    const email = row["Email"];
    let contact = await GLHContract.findOne({ email });
    if (!contact) {
      const newContact = new GLHContract({
        first_name,
        last_name,
        email,
      });
      await newContact.save();
    }
  } catch (err) {
    console.log(err);
  }
}
