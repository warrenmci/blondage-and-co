import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Redis } from "@upstash/redis";
import {
  BUSINESS_NAME,
  DECLARATION_AGREE_LABEL,
  DECLARATION_FOOTNOTE,
  DECLARATION_POINTS,
  DECLARATION_TITLE,
  DECLARATION_VERSION,
  SOCIAL_MEDIA_CONSENT_LABEL,
} from "@/lib/declaration";

const MAX_SIGNATURE_CHARS = 700_000; // ~500 KB PNG once base64-decoded
const RATE_LIMIT_MAX = 5; // submissions per IP...
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // ...per hour

function clean(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

// The page can send a copy to whatever email address is typed in, so cap how
// often one visitor can submit to stop it being used to spam other people.
async function isRateLimited(ip: string): Promise<boolean> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return false;
  try {
    const redis = new Redis({ url, token });
    const key = `blondage:declaration:ratelimit:${ip}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
    return count > RATE_LIMIT_MAX;
  } catch (error) {
    // Never block a genuine client because Redis is unavailable.
    console.error("Declaration rate limit check failed:", error);
    return false;
  }
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("Invalid request.");
  }

  // Honeypot field: real people never fill it in. Pretend it worked.
  if (clean(body.website, 200)) {
    return NextResponse.json({ success: true, reference: "BC-00000000-0000" });
  }

  const fullName = clean(body.fullName, 120).replace(/[\r\n]+/g, " ");
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 40);
  const service = clean(body.service, 200);
  const appointmentDate = clean(body.appointmentDate, 10);
  const hairHistory = clean(body.hairHistory, 2000);
  const signature = typeof body.signature === "string" ? body.signature : "";
  const agreed = body.agreed === true;
  const sendCopy = body.sendCopy === true;
  const socialMedia = body.socialMedia === true;

  if (!fullName || !phone || !hairHistory) {
    return badRequest("Please fill in all of your details.");
  }
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) {
    return badRequest("Please enter a valid email address.");
  }
  if (appointmentDate && !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
    return badRequest("Please enter a valid appointment date.");
  }
  if (!agreed) {
    return badRequest("Please tick the box to agree to the declaration.");
  }
  const signatureMatch = /^data:image\/png;base64,([A-Za-z0-9+/]+=*)$/.exec(
    signature
  );
  if (!signatureMatch || signature.length > MAX_SIGNATURE_CHARS) {
    return badRequest("Please sign in the signature box.");
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = clean(request.headers.get("user-agent"), 300) || "unknown";

  if (await isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  const now = new Date();
  const signedAt = new Intl.DateTimeFormat("en-NZ", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Pacific/Auckland",
  }).format(now);
  const reference = `BC-${now.toISOString().slice(0, 10).replace(/-/g, "")}-${randomBytes(2).toString("hex").toUpperCase()}`;
  const [year, month, day] = appointmentDate.split("-");
  const appointment = appointmentDate ? `${day}/${month}/${year}` : "";

  const details: [string, string][] = [
    ["Full name", fullName],
    ["Email", email],
    ["Mobile", phone],
    ["Service booked", service || "Not provided"],
    ["Appointment date", appointment || "Not provided"],
    ["Hair history", hairHistory],
    ["Copy emailed to client", sendCopy ? "Requested" : "Not requested"],
  ];

  // The record is built from the server's copy of the wording, never from
  // anything the browser sent, so it can't be tampered with.
  function buildHtml(includeAudit: boolean) {
    return `
<div style="font-family:Arial,Helvetica,sans-serif;color:#241a11;max-width:640px">
  <h2 style="margin-bottom:4px">${escapeHtml(BUSINESS_NAME)} - ${escapeHtml(DECLARATION_TITLE)}</h2>
  <p style="margin-top:0;color:#6f5a45">Reference ${reference} &middot; Signed ${escapeHtml(signedAt)}</p>

  <h3>Client details</h3>
  <table cellpadding="6" style="border-collapse:collapse">
    ${details
      .map(
        ([label, value]) =>
          `<tr><td valign="top" style="color:#6f5a45;white-space:nowrap"><strong>${label}</strong></td><td>${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`
      )
      .join("\n    ")}
  </table>

  <h3>Declaration</h3>
  <ul>
    ${DECLARATION_POINTS.map(
      (point) =>
        `<li style="margin-bottom:8px"><strong>${escapeHtml(point.title)}:</strong> ${escapeHtml(point.text)}</li>`
    ).join("\n    ")}
  </ul>
  <p><strong>&#9745; ${escapeHtml(DECLARATION_AGREE_LABEL)}</strong></p>
  <p>${socialMedia ? "&#9745;" : "&#9744;"} ${escapeHtml(SOCIAL_MEDIA_CONSENT_LABEL)} <strong>${socialMedia ? "Yes" : "No"}</strong></p>
  <p style="color:#6f5a45;font-size:13px">${escapeHtml(DECLARATION_FOOTNOTE)}</p>

  <h3>Signature</h3>
  <img src="cid:signature" alt="Signature of ${escapeHtml(fullName)}" style="max-width:420px;width:100%;border:1px solid #cab69c;border-radius:8px">
  <p>Signed by <strong>${escapeHtml(fullName)}</strong><br>${escapeHtml(signedAt)}</p>
  ${
    includeAudit
      ? `<h3>Signing record</h3>
  <p style="font-size:13px;color:#6f5a45">
    Reference: ${reference}<br>
    Signed (NZ time): ${escapeHtml(signedAt)}<br>
    Signed (UTC): ${now.toISOString()}<br>
    IP address: ${escapeHtml(ip)}<br>
    Device: ${escapeHtml(userAgent)}<br>
    Declaration wording version: ${DECLARATION_VERSION}
  </p>`
      : ""
  }
</div>`;
  }

  function buildText(includeAudit: boolean) {
    return [
      `${BUSINESS_NAME} - ${DECLARATION_TITLE}`,
      `Reference ${reference} - Signed ${signedAt}`,
      "",
      "CLIENT DETAILS",
      ...details.map(([label, value]) => `${label}: ${value}`),
      "",
      "DECLARATION",
      ...DECLARATION_POINTS.map((point) => `- ${point.title}: ${point.text}`),
      "",
      `[x] ${DECLARATION_AGREE_LABEL}`,
      `[${socialMedia ? "x" : " "}] ${SOCIAL_MEDIA_CONSENT_LABEL}`,
      "",
      DECLARATION_FOOTNOTE,
      "",
      `Signed by ${fullName} (signature image attached)`,
      ...(includeAudit
        ? [
            "",
            "SIGNING RECORD",
            `Signed (UTC): ${now.toISOString()}`,
            `IP address: ${ip}`,
            `Device: ${userAgent}`,
            `Declaration wording version: ${DECLARATION_VERSION}`,
          ]
        : []),
    ].join("\n");
  }

  const signatureAttachment = {
    filename: `signature-${reference}.png`,
    content: Buffer.from(signatureMatch[1], "base64"),
    contentType: "image/png",
    cid: "signature",
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const from = { name: BUSINESS_NAME, address: process.env.GMAIL_EMAIL! };

  // 1. The salon's record. If this fails, the client is told to try again.
  try {
    await transporter.sendMail({
      from,
      to: process.env.GMAIL_EMAIL,
      replyTo: email,
      subject: `Signed declaration: ${fullName} (${reference})`,
      text: buildText(true),
      html: buildHtml(true),
      attachments: [signatureAttachment],
    });
  } catch (error) {
    console.error("Error sending signed declaration:", error);
    return NextResponse.json(
      {
        error:
          "Sorry, we couldn't submit your declaration. Please try again in a moment.",
      },
      { status: 500 }
    );
  }

  // 2. The client's copy, only if they asked for one. A typo in their address
  // shouldn't undo the signing.
  let copySent = false;
  if (sendCopy) {
    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: `Your signed ${DECLARATION_TITLE} - ${BUSINESS_NAME} (${reference})`,
        text: buildText(false),
        html: buildHtml(false),
        attachments: [signatureAttachment],
      });
      copySent = true;
    } catch (error) {
      console.error("Error sending client copy of declaration:", error);
    }
  }

  return NextResponse.json({ success: true, reference, copySent });
}
