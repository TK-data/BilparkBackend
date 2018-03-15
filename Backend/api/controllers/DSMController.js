module.exports = {
  getCar: function (req, res) {
    const request = require('request');

    const soapReq = '<?xml version="1.0" encoding="UTF-8"?>'
      + '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" '
      + 'xmlns:brukersesjon="http://ws.infotorg.no/xml/Admin/Brukersesjon/2006-07-07/Brukersesjon.xsd" '
      + 'xmlns:transaksjon="http://ws.infotorg.no/xml/Admin/Transaksjon/2006-07-07/Transaksjon.xsd" '
      + 'xmlns:dsm="http://ws.infotorg.no/xml/SVV/DetSentraleMotorvognregisteret/2016-12-01/DetSentraleMotorvognregisteret.xsd">'
      + '<soap:Header>'
      + '<brukersesjon:Brukersesjon>'
      + '<distribusjonskanal>PTP</distribusjonskanal>'
      + '<systemnavn>NTNU_PRJ</systemnavn>'
      + '<brukernavn>SB1BILPT</brukernavn>'
      + '<passord>BIL8TEST</passord>'
      + '</brukersesjon:Brukersesjon>'
      + '</soap:Header>'
      + '<soap:Body>'
      + '<dsm:hentRegnrsoek>'
      + '<regnr>'
      + req.query.regnr
      + '</regnr>'
      + '</dsm:hentRegnrsoek>'
      + '</soap:Body>'
      + '</soap:Envelope>';

    request({
      url: 'https://ws-test.infotorg.no/ws/SVV/DetSentraleMotorvognregisteret.pl',
      method: 'POST',
      headers: {
        'content-type': 'text/xml',
      },
      body: soapReq
    }, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        const parser = require('xml2json');
        const json = parser.toJson(body);
        const parsedJson = JSON.parse(json);

        const soek = parsedJson['soap:Envelope']['soap:Body']['dsm:Regnrsoek'];

        if (soek.statuskode === '000') {
          res.ok(soek['detalj']);
        }
        else {
          res.notFound(soek.statustekst);
        }
      }
    });
  }
};
