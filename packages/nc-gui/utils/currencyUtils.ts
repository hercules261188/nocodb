import { all } from 'locale-codes'

export const currencyCodes = [
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AUD',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BOV',
  'BRL',
  'BSD',
  'BTN',
  'BWP',
  'BYR',
  'BZD',
  'CAD',
  'CDF',
  'CHE',
  'CHF',
  'CHW',
  'CLF',
  'CLP',
  'CNY',
  'COP',
  'COU',
  'CRC',
  'CUP',
  'CVE',
  'CYP',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EEK',
  'EGP',
  'ERN',
  'ETB',
  'EUR',
  'FJD',
  'FKP',
  'GBP',
  'GEL',
  'GHC',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HRK',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'IQD',
  'IRR',
  'ISK',
  'JMD',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KMF',
  'KPW',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LRD',
  'LSL',
  'LTL',
  'LVL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MRO',
  'MTL',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MXV',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'ROL',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SDD',
  'SEK',
  'SGD',
  'SHP',
  'SIT',
  'SKK',
  'SLL',
  'SOS',
  'SRD',
  'STD',
  'SYP',
  'SZL',
  'THB',
  'TJS',
  'TMM',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USD',
  'USN',
  'USS',
  'UYU',
  'UZS',
  'VEB',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XAG',
  'XAU',
  'XBA',
  'XBB',
  'XBC',
  'XBD',
  'XCD',
  'XDR',
  'XFO',
  'XFU',
  'XOF',
  'XPD',
  'XPF',
  'XPT',
  'XTS',
  'XXX',
  'YER',
  'ZAR',
  'ZMK',
  'ZWD',
]

export function validateCurrencyCode(v: string) {
  return currencyCodes.includes(v)
}

export function currencyLocales() {
  return all
    .filter((l) => validateCurrencyLocale(l.tag))
    .map((l) => {
      return {
        text: `${l.name} (${l.tag})`,
        value: l.tag,
      }
    })
}

export function validateCurrencyLocale(v: string) {
  try {
    return Intl.NumberFormat.supportedLocalesOf(v).length > 0
  } catch (e) {
    return false
  }
}
