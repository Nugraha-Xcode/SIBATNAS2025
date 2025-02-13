const { ca } = require("date-fns/locale");
const fs = require("node:fs");

var args1 = process.argv.slice(2);
//var args2 = process.argv.slice(3);
//var args3 = process.argv.slice(4);
function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

fs.readFile("template_types.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const content = data.replace(/{BESAR}/g, args1.toString().toUpperCase());

  fs.appendFile("../src/redux/actions/types.js", content, function (err) {
    if (err) throw err;
    console.log("Successfully appended");
  });
});
fs.readFile("template_action.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data
    .replace(/{BESAR}/g, args1.toString().toUpperCase())
    .replace(/{kecil}/g, args1.toString())
    .replace(/{create}/g, "nama_" + args1.toString());
  fs.writeFile(
    `../src/redux/actions/${args1.toString()}.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

fs.readFile("template_reducer.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data.replace(/{BESAR}/g, args1.toString().toUpperCase());
  fs.writeFile(
    `../src/redux/reducers/${args1.toString()}.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

fs.readFile("template_service.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data.replace(/{kecil}/g, args1.toString());
  fs.writeFile(
    `../src/services/${args1.toString()}.service.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

var capital = capitalize(args1.toString());
const folderName = `../src/pages/managements/${capital}`;
try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

fs.readFile("./Template/index.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data.replace(/{Kapital}/g, capital);
  fs.writeFile(
    `../src/pages/managements/${capital}/index.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

fs.readFile("./Template/PageHeader.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const content = data
    .replace(/{Kapital}/g, capital)
    .replace(/{kecil}/g, args1.toString());
  fs.writeFile(
    `../src/pages/managements/${capital}/PageHeader.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

fs.readFile("./Template/DaftarDialog.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data
    .replace(/{Kapital}/g, capital)
    .replace(/{kecil}/g, args1.toString());
  fs.writeFile(
    `../src/pages/managements/${capital}/DaftarDialog.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});

fs.readFile("./Template/DaftarTab.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  //console.log(data);

  const content = data
    .replace(/{Kapital}/g, capital)
    .replace(/{kecil}/g, args1.toString());
  fs.writeFile(
    `../src/pages/managements/${capital}/DaftarTab.js`,
    content,
    (err) => {
      if (err) {
        console.error(err);
      }
      console.log("redux action written successfully");
    }
  );
});
