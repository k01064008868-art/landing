import { NextResponse } from "next/server";

const GOOGLE_SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbzcJBozhrhlT0L-3H9jItxVr35kqIusAywaP53e3WIMBcprksAGm2EzewYKbic1Ffk7/exec";

type LeadPayload = {
  name?: string;
  phone?: string;
  interestType?: string;
  preferredTime?: string;
  privacyConsent?: boolean;
  marketingConsent?: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  pageUrl?: string;
};

function cleanCell(value: unknown, max = 200) {
  const text = String(value ?? "").trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as LeadPayload;
    const name = cleanCell(body.name, 30);
    const phone = String(body.phone ?? "").replace(/\D/g, "");
    if (name.length < 2 || !/^01[016789]\d{7,8}$/.test(phone) || body.privacyConsent !== true) {
      return NextResponse.json({ ok: false, code: "INVALID_INPUT", message: "입력 정보를 확인해 주세요." }, { status: 400 });
    }

    const receiptId = `MSP-${Date.now()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const lead = {
      receiptId,
      submittedAt: new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false,
      }).format(new Date()),
      name,
      phone,
      displayPhone: phone.replace(/(\d{3})(\d{3,4})(\d{4})/, "$1-$2-$3"),
      managerName: "김상순",
      interestType: cleanCell(body.interestType || "미정", 20),
      preferredTime: cleanCell(body.preferredTime, 30),
      privacyConsent: true,
      marketingConsent: Boolean(body.marketingConsent),
      referrer: cleanCell(body.referrer, 500),
      pageUrl: cleanCell(body.pageUrl, 500),
      utmSource: cleanCell(body.utmSource, 100),
      utmMedium: cleanCell(body.utmMedium, 100),
      utmCampaign: cleanCell(body.utmCampaign, 100),
      status: "신규",
    };

    const sheetResponse = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(lead),
      redirect: "follow",
    });
    if (!sheetResponse.ok) throw new Error("Google Sheet write failed");
    const sheetResult = await sheetResponse.json().catch(() => ({ ok: true }));
    if (sheetResult.ok === false) throw new Error("Google Sheet rejected lead");
    return NextResponse.json({ ok: true, receiptId });
  } catch {
    return NextResponse.json({ ok: false, code: "SERVER_ERROR", message: "접수 중 오류가 발생했습니다." }, { status: 500 });
  }
}
