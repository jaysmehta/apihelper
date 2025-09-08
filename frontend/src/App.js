import React, { useState } from "react";
import axios from 'axios';
import "./clever.css";

function CleverTapForm() {
  const [accountId, setAccountId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [region, setRegion] = useState("");
  const [apiType, setApiType] = useState("event");
  const [data, setData] = useState("{}");
  const [responseMsg, setResponseMsg] = useState("");
  const [loading, setLoading] = useState(false);

const [identityField, setIdentityField] = useState("objectId");
const [identityValueInput, setIdentityValueInput] = useState("");

const identityValue = identityValueInput || "25b08803c1af4e00839f530264dac6f8";


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setResponseMsg("");
  try {
    const parsedData = JSON.parse(data);
    const res = await axios.post('/api/clevertap-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId,
        passcode,
        region,
        apiType,
        data: parsedData,
        identityField,
        identityValueInput
      }),
    });
    const result = await res.data;

    if (result.success) {
      setResponseMsg("✅ " + result.message);
    } else {
      setResponseMsg("❌ " + (result.message || "Unknown error"));
    }
  } catch (err) {
    setResponseMsg("❌ " + err.message);
  }
  setLoading(false);
};




const eventSamples = [
  
  { label: "Product Viewed Event", value: JSON.stringify({ event: "Product Viewed", product_id: "12345", category: "Electronics", price: 1999 }, null, 2) },
  { label: "Charged Event", value: JSON.stringify({ event: "Charged", amount: 250, items: [{ id: "sku-1", name: "Shoes", qty: 1, price: 150 }, { id: "sku-2", name: "Socks", qty: 2, price: 50 }] }, null, 2) }
];

const profileSamples = [
  { label: "Profile Update (Name,Email,etc)", value: JSON.stringify({ profileData: { Name: "John Doe", Email: "john.doe@example.com" } }, null, 2) },
  { label: "MSG Flags Updation", value: JSON.stringify({ profileData: { "MSG-push": true, "MSG-email": true, "MSG-sms": true,"MSG-whatsapp": true } }, null, 2) }
];



  return (
    <div className="form-container">
    <img
  src="https://media.instahyre.com/images/profile/base/employer/14364/4c0616ce1e/CleverTap_Logo.webp"
  alt="CleverTap Logo"
  className="clevertap-logo"
/>
      <h2 className="form-title">CleverTap API Utility</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="accountId">Account ID</label>
          <input
            type="text"
            id="accountId"
            value={accountId}
            onChange={e => setAccountId(e.target.value)}
            required
            placeholder="Enter CleverTap Account ID"
          />
        </div>
        <div className="form-group">
          <label htmlFor="passcode">Passcode</label>
          <input
            type="password"
            id="passcode"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
            required
            placeholder="Enter Passcode"
          />
        </div>
        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            value={region}
            onChange={e => setRegion(e.target.value)}
            required
          >
            <option value="eu1">eu1</option>
            <option value="in1">in1</option>
            <option value="sg1">sg1</option>
            <option value="us1">us1</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="apiType">API Type</label>
          <select
            id="apiType"
            value={apiType}
            onChange={e => setApiType(e.target.value)}
            required
          >
            <option value="event">Ingest Event</option>
            <option value="profile">Profile Update</option>
          </select>
        </div>
        <div className="form-group">
  <label htmlFor="identityField">Identity Field</label>
  <select
    id="identityField"
    value={identityField}
    onChange={e => setIdentityField(e.target.value)}
    required
  >
    <option value="objectId">objectId</option>
    <option value="identity">identity</option>
  </select>
</div>
<div className="form-group">
  <label htmlFor="identityValue">Enter {identityField}</label>
  <input
    type="text"
    id="identityValue"
    value={identityValueInput}
    onChange={e => setIdentityValueInput(e.target.value)}
    placeholder={`Enter ${identityField} value`}
    required
  />
 </div>



<div className="form-group">
  <label htmlFor="sampleData">Sample Data</label>
  <select
    id="sampleData"
    onChange={e => setData(e.target.value)}
    defaultValue=""
  >
    <option value="" disabled>
      Select sample data
    </option>
    {(apiType === "event" ? eventSamples : profileSamples).map((opt, idx) => (
      <option key={idx} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
</div>

        <div className="form-group">
          <label htmlFor="data">Data (JSON)</label>
          <textarea
            id="data"
            value={data}
            onChange={e => setData(e.target.value)}
            rows={5}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
      {responseMsg && (
        <div
          className={`response-msg ${responseMsg.startsWith("❌") ? "error" : "success"}`}
        >
          {responseMsg}
        </div>
      )}
    </div>
  );
}

export default CleverTapForm;
