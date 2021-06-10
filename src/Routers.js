const Routes = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const Swal = require("sweetalert2");
const { body, validationResult, check } = require("express-validator");
const {
  loadContact,
  findContact,
  addContact,
  dataCopy,
  deleteContact,
  updateContacts,
} = require("../util/contacts");

const route = new Routes();

// Use
route.set("view engine", "ejs");
route.use(expressLayouts);
route.use(Routes.static("public"));
route.use(Routes.urlencoded({ extended: true }));
route.use(cookieParser("secret"));
route.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
route.use(flash());

//routing

// Home
route.get("/", (req, res) => {
  res.render("index", {
    title: "Home Page",
    layout: "template/main-layout",
  });
});

// Contact
route.get("/Contact", (req, res) => {
  const contacts = loadContact();
  res.render("contact", {
    title: "Contact Page",
    layout: "template/main-layout",
    cont: contacts,
    err: req.flash("err"),
    del: req.flash("del"),
    add: req.flash("add"),
  });
});

// Add Contact
route.post(
  "/Contact",
  [
    body("num").custom((value) => {
      const copy = dataCopy(value);
      if (copy) {
        throw new Error("Nomor Hp Sudah Ada !");
      }
      return true;
    }),
    check("email", "Email Tidak Valid !!").isEmail(),
    check(
      "num",
      "Nomor Tidak Valid !!, (Nomor Hp Harus Berformat Negara Indonesia)"
    ).isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("err", errors.array());
      res.redirect("/Contact");
    } else {
      addContact(req.body);
      req.flash(
        "add",
        `<div
            class="alert alert-success shadow alert-dismissible fade show"
            role="alert"
          >
            <strong>Data Berhasil di Tambahkan !!</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>`
      );
      res.redirect("/Contact");
    }
  }
);

// Update Contact
route.post(
  "/Contact/update",
  [
    body("num").custom((value, { req }) => {
      const copy = dataCopy(value);
      if (value !== req.body.oldNum && copy) {
        throw new Error("Nomor Hp Sudah Terdaftar !");
      }
      return true;
    }),
    check("email", "Email Tidak Valid !!").isEmail(),
    check(
      "num",
      "Nomor Tidak Valid !!, (Nomor Hp Harus Berformat Negara Indonesia)"
    ).isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("err", errors.array());
      res.redirect("/Contact/" + req.body.oldNum);
    } else {
      updateContacts(req.body);
      req.flash(
        "add",
        `<div
            class="alert alert-success shadow alert-dismissible fade show"
            role="alert"
          >
            <strong>Data Berhasil di Ubah !!</strong>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>`
      );
      res.redirect("/Contact");
    }
  }
);

// Delete Contact
route.get("/Contact/del/:num", (req, res) => {
  const contact = findContact(req.params.num);
  if (!contact) {
    res.status(404);
  } else {
    deleteContact(req.params.num);
    req.flash(
      "del",
      `<div
          class="alert alert-success shadow alert-dismissible fade show"
          role="alert"
        >
          <strong>Data Berhasil di Hapus !!</strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>`
    );
    res.redirect("/Contact");
  }
});

// Detail Contact
route.get("/Contact/:num", (req, res) => {
  const contact = findContact(req.params.num);
  res.render("detail", {
    title: "Detail Contact Page",
    layout: "template/main-layout",
    cont: contact,
    err: req.flash("err"),
  });
});

// Page Not Found
route.get("*", (req, res) => {
  res.json({
    Error: 404,
    message: "Error Page Not Found !",
  });
});

module.exports = route;
