
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "Only POST allowed" });
  }

  const { number, port = 1 } = req.body;
  if (!number) return res.status(400).json({ status: "Missing number" });

  const OPENVOX_IP = "192.168.10.201";
  const AUTH = Buffer.from("bachir:A2S@UCM25*").toString("base64");

  try {
    const response = await fetch(
      `http://${OPENVOX_IP}/cgi-bin/api_call.cgi?port=${port}&number=${number}`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${AUTH}`,
        },
      }
    );

    const result = await response.text();
    const success = result.includes("success") || result.includes("ok");

    return res.status(200).json({
      status: success ? "Call Successful" : "Call Failed",
      details: result,
    });
  } catch (err) {
    return res.status(500).json({ status: "Call Failed", error: err.message });
  }
}
