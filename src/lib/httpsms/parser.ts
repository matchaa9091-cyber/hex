/**
 * Mobile Money SMS Parser for Uganda (MTN MoMo & Airtel Money)
 * Integrates with httpSMS Android Gateway
 */

export interface ParsedPayment {
  isPayment: boolean;
  amount: number;
  currency: string;
  transactionId: string | null;
  senderPhone: string | null;
  normalizedPhone: string | null;
  senderName: string | null;
  provider: 'mtn' | 'airtel' | 'unknown';
  rawText: string;
}

export function normalizeUgandanPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return null;
  // Last 9 digits, e.g. 772123456
  return digits.slice(-9);
}

export function parseMobileMoneySms(text: string): ParsedPayment {
  const result: ParsedPayment = {
    isPayment: false,
    amount: 0,
    currency: 'UGX',
    transactionId: null,
    senderPhone: null,
    normalizedPhone: null,
    senderName: null,
    provider: 'unknown',
    rawText: text,
  };

  if (!text || typeof text !== 'string') return result;

  const lower = text.toLowerCase();

  // Ensure it is an incoming payment, not outgoing
  const isOutgoing =
    lower.includes('you have sent') ||
    lower.includes('transferred to') ||
    lower.includes('payment made to') ||
    lower.includes('airtime purchased') ||
    lower.includes('you have paid') ||
    lower.includes('cash out of') ||
    lower.includes('withdrawn');

  const isIncoming =
    lower.includes('you have received') ||
    lower.includes('received from') ||
    lower.includes('has sent you') ||
    lower.includes('cash in') ||
    lower.includes('credited with') ||
    lower.includes('deposit of') ||
    (lower.includes('received') && (lower.includes('ugx') || lower.includes('shs')));

  if (isOutgoing || !isIncoming) {
    return result;
  }

  // Extract Amount: look for UGX 20,000 or 20,000 UGX or shs 20,000 or UGX 60000
  // Note: match the full number with or without commas
  const amountPatterns = [
    /(?:received|deposit of|credited with|amount:?)\s*(?:ugx|shs|shillings)?\s*([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{4,9}\b)/i,
    /(?:ugx|shs|shillings)\.?\s*([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{4,9}\b)/i,
    /([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{4,9}\b)\s*(?:ugx|shs|shillings)/i,
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const cleaned = match[1].replace(/,/g, '');
      const parsedAmount = parseInt(cleaned, 10);
      if (!isNaN(parsedAmount) && parsedAmount > 0) {
        result.amount = parsedAmount;
        break;
      }
    }
  }

  // Extract Transaction ID
  const txPatterns = [
    /Financial Transaction Id:\s*([A-Za-z0-9]+)/i,
    /(?:Trans\.?\s*ID|Transaction\s*ID|TxnId|Txn\s*ID)[:\s]+([A-Za-z0-9]+)/i,
    /(?:Reference|Ref\.?|ID)[:\s]+([A-Za-z0-9]{6,})/i,
  ];

  for (const pattern of txPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.transactionId = match[1].trim().toUpperCase();
      break;
    }
  }

  // Extract Sender Phone Number from text
  // e.g. "from KASULE JOHN (256770123456)" or "from 256750123456, NAMUGGA" or "from 0770123456"
  const phonePatterns = [
    /from\s+[^0-9\n\r]*?\(?\+?(256\d{9}|0\d{9})\)?/i,
    /(?:from|sender)[:\s]+[^0-9\n\r]*?\(?\+?(256\d{9}|0\d{9})\)?/i,
    /\(?\+?(256[7|3]\d{8}|0[7|3]\d{8})\)?/,
  ];

  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.senderPhone = match[1];
      result.normalizedPhone = normalizeUgandanPhone(match[1]);
      break;
    }
  }

  // Extract Sender Name (if available)
  // e.g. "from KASULE JOHN (" or "from 256750123456, NAMUGGA SARAH." or "from JOHN DOE on"
  const namePatterns = [
    /from\s+([A-Z\s]{3,30}?)(?:\s*\(|\s+on\s+|\s*,|\s*\d|\.)/,
    /from\s+\d{9,12}\s*,\s*([A-Za-z\s]{3,30}?)(?:\.|\s+Date|\s+Trans|\s+Txn|\s+New)/i
  ];

  for (const np of namePatterns) {
    const nameMatch = text.match(np);
    if (nameMatch && nameMatch[1]) {
      const cleanName = nameMatch[1].trim();
      if (cleanName.length >= 2 && !/^\d+$/.test(cleanName)) {
        result.senderName = cleanName;
        break;
      }
    }
  }

  // Detect provider
  if (lower.includes('y\'ello') || lower.includes('mtn') || lower.includes('financial transaction id')) {
    result.provider = 'mtn';
  } else if (lower.includes('airtel') || lower.includes('txnid') || lower.includes('airtelmoney') || lower.includes('trans id')) {
    result.provider = 'airtel';
  } else if (result.normalizedPhone) {
    const p = result.normalizedPhone;
    if (p.startsWith('77') || p.startsWith('78') || p.startsWith('76')) {
      result.provider = 'mtn';
    } else if (p.startsWith('70') || p.startsWith('74') || p.startsWith('75')) {
      result.provider = 'airtel';
    }
  }

  // Payment is considered valid if it's incoming and amount > 0
  if (result.amount > 0) {
    result.isPayment = true;
  }

  return result;
}
