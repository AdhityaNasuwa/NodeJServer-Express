const fs = require("fs");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);
  return contacts;
};

const findContact = (num) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.num === num);
  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
};

const dataCopy = (num) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.num === num);
};

const deleteContact = (num) => {
  const contacts = loadContact();
  const filteredContact = contacts.filter((contact) => contact.num !== num);
  saveContacts(filteredContact);
};

const updateContacts = (contactBaru) => {
  const contacts = loadContact();
  const filteredContact = contacts.filter(
    (contact) => contact.num !== contactBaru.oldNum
  );
  delete contactBaru.oldNum;
  filteredContact.push(contactBaru);
  saveContacts(filteredContact);
};

module.exports = {
  loadContact,
  findContact,
  addContact,
  dataCopy,
  deleteContact,
  updateContacts,
};
