const SHEET_NAME = "상담접수";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("상담접수 시트를 찾을 수 없습니다.");
    if (!data.receiptId || !data.name || !data.phone) throw new Error("필수값이 없습니다.");

    sheet.appendRow([
      safe(data.receiptId),
      safe(data.submittedAt),
      safe(data.name),
      safe(data.phone),
      safe(data.displayPhone),
      "김상순",
      safe(data.interestType || "미정"),
      safe(data.preferredTime || ""),
      data.privacyConsent ? "동의" : "미동의",
      data.marketingConsent ? "동의" : "미동의",
      safe(data.pageUrl || ""),
      safe(data.referrer || ""),
      safe(data.utmSource || ""),
      safe(data.utmMedium || ""),
      safe(data.utmCampaign || ""),
      "신규",
      ""
    ]);
    return json({ ok: true, receiptId: data.receiptId });
  } catch (error) {
    return json({ ok: false, message: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function safe(value) {
  const text = String(value == null ? "" : value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
