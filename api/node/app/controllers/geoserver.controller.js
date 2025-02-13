const config = require("../config/api.config");
const axios = require("axios");

exports.forwardRequest = async (req, res) => {
  //console.log(req);
  var id = req.query.layers;
  if (id) {
    console.log(id);
    try {
      const url = "http://geoserver:8080/geoserver/wms/reflect?layers=" + id;
      //const response = await axios.get(url);
      axios({
        method: "get",
        url: url,
        responseType: "stream",
      }).then(function (response) {
        response.data.pipe(res);
      });
    } catch (err) {
      return res.status(500).send({ message: err });
    }
  } else {
    res.status(400).send({
      message: "Cannot process request!",
    });
  }
  /*
  const arrayBuffer = await axios.get(url, {
    headers: { responseType: "arraybuffer" },
  });
  res.set({
    "Content-Type": "image/png",
    "Content-Length": arrayBuffer.data.length,
  });
  res.send(arrayBuffer.data);
  */
};
