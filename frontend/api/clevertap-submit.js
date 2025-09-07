const express = require('express');

const axios =require('axios');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.post('/api/clevertap-submit', async (req, res) => {
  try {


    const { accountId, passcode, region, apiType, data, identityField, identityValueInput } = JSON.parse(req.body.body);

    const identityValue = identityValueInput || "25b08803c1af4e00839f530264dac6f8";

    let payload = {};

    if (apiType === "profile") {
      payload = {
        d: [
          {
            [identityField || "objectId"]: identityValue,
            type: "profile",
            profileData: data.profileData || data
          }
        ]
      };
    } else if (apiType === "event") {
      payload = {
        d: [
          {
            [identityField || "objectId"]: identityValue,
            type: "event",
            evtName: data.event,
            evtData: data
          }
        ]
      };
    } else {
      return res.status(400).json({ success: false, message: "Invalid API type" });
    }

    const url = `https://${region}.api.clevertap.com/1/upload`;
    payload=JSON.stringify(payload);
   

    const response = await axios.post(url,payload, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-CleverTap-Account-Id": accountId,
        "X-CleverTap-Passcode": passcode
      }
    });

    const result = await response.data;

    if (result.status === 'success') {
      res.json({ success: true, message: "Request successful", data: result });
      
    }else{
      return res.status(response.status).json({ success: false, message: result });
    }

    

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});
