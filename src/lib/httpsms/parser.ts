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

  // Ensure it is not an outgoing payment from our gateway phone
  const isOutgoing =
    lower.includes('you have sent') ||
    lower.includes('transferred to') ||
    lower.includes('payment made to') ||
    lower.includes('airtime purchased') ||
    lower.includes('bundle purchase') ||
    lower.includes('has deducted') ||
    lower.includes('you have paid') ||
    lower.includes('cash out of') ||
    lower.includes('withdrawn') ||
    lower.includes('has collected') ||
    lower.includes('used to repay');

  const isIncoming =
    lower.includes('you have received') ||
    lower.includes('received from') ||
    lower.includes('received.') ||
    lower.includes('received ugx') ||
    lower.includes('has sent you') ||
    lower.includes('has sent') ||
    lower.includes('cash in') ||
    lower.includes('credited with') ||
    lower.includes('deposit of') ||
    lower.includes('deposited') ||
    lower.includes('you have deposited') ||
    (lower.includes('received') && (lower.includes('ugx') || lower.includes('shs')));

  if (isOutgoing || !isIncoming) {
    return result;
  }

  // Extract Amount: look for UGX 20,000 or 20,000 UGX or shs 20,000 or UGX 60000 or UGX 500
  const amountPatterns = [
    /(?:received|deposited|deposit of|credited with|amount:?)\s*(?:ugx|shs|shillings)?\.?\s*([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{3,9}\b)/i,
    /(?:ugx|shs|shillings)\.?\s*([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{3,9}\b)/i,
    /([0-9]{1,3}(?:,[0-9]{3})+|\b[0-9]{3,9}\b)\s*(?:ugx|shs|shillings)/i,
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
    /Financial Transaction Id:\s*([A-Za-z0-9._-]+)/i,
    /Transaction Id:\s*([A-Za-z0-9._-]+)/i,
    /(?:Trans\.?\s*ID|TxnId|Txn\s*ID)[:\s]+([A-Za-z0-9._-]+)/i,
    /\bTID\s+([A-Za-z0-9._-]+)/i,
    /\bID:\s*([0-9]{6,})/i,
    /(?:Reference|Ref\.?)[:\s]+([A-Za-z0-9]{6,})/i,
  ];

  for (const pattern of txPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.transactionId = match[1].trim().toUpperCase();
      break;
    }
  }

  // Extract Sender Phone Number
  // 1. Check inside "Reason: NAME , PHONE" (Airtel-to-MTN transfer)
  const reasonMatch = text.match(/Reason:\s*([^,]+?)\s*,\s*(\+?256\d{9}|0\d{9}|\d{9})/i);
  if (reasonMatch && reasonMatch[2]) {
    result.senderPhone = reasonMatch[2];
    result.normalizedPhone = normalizeUgandanPhone(reasonMatch[2]);
    if (!result.senderName && reasonMatch[1]) {
      result.senderName = reasonMatch[1].trim();
    }
  }

  // 2. Check "from NAME, PHONE on" (e.g., "from JULIANA ANGEL BUTUKIRIRE, 256777902260 on")
  if (!result.normalizedPhone) {
    const namePhoneMatch = text.match(/from\s+([A-Za-z\s]+?),\s*(\+?256\d{9}|0\d{9}|\b[7|3]\d{8}\b)/i);
    if (namePhoneMatch && namePhoneMatch[2]) {
      result.senderPhone = namePhoneMatch[2];
      result.normalizedPhone = normalizeUgandanPhone(namePhoneMatch[2]);
      if (!result.senderName && namePhoneMatch[1]) {
        result.senderName = namePhoneMatch[1].trim();
      }
    }
  }

  // 3. Check "from PHONE, NAME" (e.g. "from 709833263, TIMOTHY MUGISA")
  if (!result.normalizedPhone) {
    const phoneNameMatch = text.match(/from\s+(\+?256\d{9}|0\d{9}|\b[7|3]\d{8}\b),\s*([A-Za-z\s]+?)(?:\.|\s+Bal|\s+Date|\s+New)/i);
    if (phoneNameMatch && phoneNameMatch[1]) {
      result.senderPhone = phoneNameMatch[1];
      result.normalizedPhone = normalizeUgandanPhone(phoneNameMatch[1]);
      if (!result.senderName && phoneNameMatch[2]) {
        result.senderName = phoneNameMatch[2].trim();
      }
    }
  }

  // 4. Standard from phone patterns
  if (!result.normalizedPhone) {
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
  }

  // Extract Sender Name if not found yet
  if (!result.senderName) {
    const namePatterns = [
      /from\s+([A-Za-z\s]{3,35}?)(?:\s*\(|\s+on\s+|\s*,|\s*\d|\.|$)/i,
      /from\s+\d{9,12}\s*,\s*([A-Za-z\s]{3,35}?)(?:\.|\s+Bal|\s+Date|\s+Trans|\s+Txn|\s+New)/i
    ];
    for (const np of namePatterns) {
      const nameMatch = text.match(np);
      if (nameMatch && nameMatch[1]) {
        const cleanName = nameMatch[1].trim();
        if (cleanName.length >= 2 && !/^\d+$/.test(cleanName) && cleanName.toLowerCase() !== 'airtel money') {
          result.senderName = cleanName;
          break;
        }
      }
    }
  }

  // Detect provider
  if (lower.includes("y'ello") || lower.includes('mtn') || lower.includes('momo') || lower.includes('financial transaction id')) {
    result.provider = 'mtn';
  } else if (lower.includes('airtel') || lower.includes('txnid') || lower.includes('airtelmoney') || lower.includes('trans id') || lower.includes('tid ')) {
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
