/**
 * DriveScope vehicle spec catalog — Indian-market powertrains (June 2026).
 * Used to correct placeholder bulk-import specs (88PS/1197cc, wrong EV PS, wrong transmissions).
 *
 * @see scripts/sync-missing-cars-from-xlsx.mjs
 */

// ---------------------------------------------------------------------------
// POWERTRAINS — shared engine / motor definitions
// ---------------------------------------------------------------------------

export const POWERTRAINS = {
  // ── Audi ──────────────────────────────────────────────────────────────────
  AUDI_2TFSI_190: {
    engine: { cc: 1984, ps: 190, nm: 320, cylinders: 4, turbo: true },
    claimedFE: 14.2,
    realWorldFE: 10.2,
    kerbWeight: 1615,
  },
  AUDI_2TFSI_245: {
    engine: { cc: 1984, ps: 245, nm: 370, cylinders: 4, turbo: true },
    claimedFE: 13.5,
    realWorldFE: 9.7,
    kerbWeight: 1815,
  },
  AUDI_3TFSI_340: {
    engine: { cc: 2995, ps: 340, nm: 500, cylinders: 6, turbo: true },
    claimedFE: 11.8,
    realWorldFE: 8.5,
    kerbWeight: 2145,
  },
  AUDI_3TFSI_354: {
    engine: { cc: 2995, ps: 354, nm: 500, cylinders: 6, turbo: true },
    claimedFE: 11.5,
    realWorldFE: 8.3,
    kerbWeight: 1840,
  },
  AUDI_4TFSI_600: {
    engine: { cc: 3996, ps: 600, nm: 800, cylinders: 8, turbo: true },
    claimedFE: 8.5,
    realWorldFE: 6.1,
    kerbWeight: 2395,
  },
  AUDI_ETRON_GT: {
    engine: { cc: 0, ps: 530, nm: 640, cylinders: 0, turbo: false },
    claimedFE: 5.8,
    realWorldFE: 4.2,
    kerbWeight: 2345,
  },
  AUDI_RS_ETRON_GT: {
    engine: { cc: 0, ps: 646, nm: 830, cylinders: 0, turbo: false },
    claimedFE: 5.4,
    realWorldFE: 3.9,
    kerbWeight: 2425,
  },

  // ── BYD ───────────────────────────────────────────────────────────────────
  BYD_ATTO3_50: {
    engine: { cc: 0, ps: 204, nm: 310, cylinders: 0, turbo: false },
    claimedFE: 8.5,
    realWorldFE: 6.1,
    kerbWeight: 1750,
  },
  BYD_ATTO3_60: {
    engine: { cc: 0, ps: 204, nm: 310, cylinders: 0, turbo: false },
    claimedFE: 8.8,
    realWorldFE: 6.3,
    kerbWeight: 1805,
  },
  BYD_EMAX7: {
    engine: { cc: 0, ps: 218, nm: 310, cylinders: 0, turbo: false },
    claimedFE: 8.2,
    realWorldFE: 5.9,
    kerbWeight: 1920,
  },
  BYD_SEALION7_RWD: {
    engine: { cc: 0, ps: 313, nm: 360, cylinders: 0, turbo: false },
    claimedFE: 7.8,
    realWorldFE: 5.6,
    kerbWeight: 2150,
  },
  BYD_SEALION7_AWD: {
    engine: { cc: 0, ps: 530, nm: 670, cylinders: 0, turbo: false },
    claimedFE: 7.2,
    realWorldFE: 5.2,
    kerbWeight: 2280,
  },
  BYD_SEAL_RWD: {
    engine: { cc: 0, ps: 313, nm: 360, cylinders: 0, turbo: false },
    claimedFE: 8.2,
    realWorldFE: 5.9,
    kerbWeight: 2050,
  },
  BYD_SEAL_AWD: {
    engine: { cc: 0, ps: 530, nm: 670, cylinders: 0, turbo: false },
    claimedFE: 7.8,
    realWorldFE: 5.6,
    kerbWeight: 2180,
  },

  // ── Honda ─────────────────────────────────────────────────────────────────
  HONDA_CITY_EHEV: {
    engine: { cc: 1498, ps: 126, nm: 253, cylinders: 4, turbo: false },
    claimedFE: 26.5,
    realWorldFE: 19.0,
    kerbWeight: 1270,
  },

  // ── Hyundai ───────────────────────────────────────────────────────────────
  HYUNDAI_1_2_KAPPA: {
    engine: { cc: 1197, ps: 83, nm: 114, cylinders: 4, turbo: false },
    claimedFE: 20.5,
    realWorldFE: 14.7,
    kerbWeight: 990,
  },
  HYUNDAI_1_2_KAPPA_CNG: {
    engine: { cc: 1197, ps: 70, nm: 95, cylinders: 4, turbo: false },
    claimedFE: 28.4,
    realWorldFE: 20.3,
    kerbWeight: 1045,
  },
  HYUNDAI_1_0_TGDI: {
    engine: { cc: 998, ps: 120, nm: 172, cylinders: 3, turbo: true },
    claimedFE: 18.4,
    realWorldFE: 13.2,
    kerbWeight: 1085,
  },
  HYUNDAI_1_5_TGDI: {
    engine: { cc: 1482, ps: 160, nm: 253, cylinders: 4, turbo: true },
    claimedFE: 18.4,
    realWorldFE: 13.2,
    kerbWeight: 1350,
  },
  HYUNDAI_CRETA_EV_42: {
    engine: { cc: 0, ps: 138, nm: 255, cylinders: 0, turbo: false },
    claimedFE: 9.3,
    realWorldFE: 6.7,
    kerbWeight: 1580,
  },
  HYUNDAI_CRETA_EV_51: {
    engine: { cc: 0, ps: 172, nm: 255, cylinders: 0, turbo: false },
    claimedFE: 9.2,
    realWorldFE: 6.6,
    kerbWeight: 1650,
  },

  // ── Jeep ────────────────────────────────────────────────────────────────────
  JEEP_3_6_V6: {
    engine: { cc: 3604, ps: 286, nm: 344, cylinders: 6, turbo: false },
    claimedFE: 8.5,
    realWorldFE: 6.1,
    kerbWeight: 2145,
  },
  JEEP_2_0_MULTIJET: {
    engine: { cc: 1956, ps: 170, nm: 350, cylinders: 4, turbo: true },
    claimedFE: 16.5,
    realWorldFE: 11.8,
    kerbWeight: 1785,
  },
  JEEP_2_0_TURBO: {
    engine: { cc: 1995, ps: 272, nm: 400, cylinders: 4, turbo: true },
    claimedFE: 11.0,
    realWorldFE: 7.9,
    kerbWeight: 1965,
  },

  // ── Kia ───────────────────────────────────────────────────────────────────
  KIA_1_5_MPI: {
    engine: { cc: 1497, ps: 115, nm: 144, cylinders: 4, turbo: false },
    claimedFE: 17.4,
    realWorldFE: 12.5,
    kerbWeight: 1285,
  },
  KIA_1_0_TGDI: {
    engine: { cc: 998, ps: 120, nm: 172, cylinders: 3, turbo: true },
    claimedFE: 18.2,
    realWorldFE: 13.0,
    kerbWeight: 1250,
  },
  KIA_1_5_CRDI: {
    engine: { cc: 1493, ps: 116, nm: 250, cylinders: 4, turbo: true },
    claimedFE: 20.75,
    realWorldFE: 14.9,
    kerbWeight: 1350,
  },
  KIA_2_2_CRDI: {
    engine: { cc: 2151, ps: 202, nm: 440, cylinders: 4, turbo: true },
    claimedFE: 14.3,
    realWorldFE: 10.3,
    kerbWeight: 2095,
  },
  KIA_CLAVIS_EV: {
    engine: { cc: 0, ps: 172, nm: 284, cylinders: 0, turbo: false },
    claimedFE: 9.0,
    realWorldFE: 6.5,
    kerbWeight: 1685,
  },
  KIA_EV6_RWD: {
    engine: { cc: 0, ps: 229, nm: 350, cylinders: 0, turbo: false },
    claimedFE: 7.5,
    realWorldFE: 5.4,
    kerbWeight: 1985,
  },
  KIA_EV6_AWD: {
    engine: { cc: 0, ps: 325, nm: 605, cylinders: 0, turbo: false },
    claimedFE: 7.0,
    realWorldFE: 5.0,
    kerbWeight: 2105,
  },
  KIA_EV9_AWD: {
    engine: { cc: 0, ps: 384, nm: 700, cylinders: 0, turbo: false },
    claimedFE: 6.5,
    realWorldFE: 4.7,
    kerbWeight: 2585,
  },

  // ── Mahindra ──────────────────────────────────────────────────────────────
  M_MHAWK_100: {
    engine: { cc: 1493, ps: 100, nm: 260, cylinders: 4, turbo: true },
    claimedFE: 17.8,
    realWorldFE: 12.8,
    kerbWeight: 1185,
  },
  M_MHAWK_118: {
    engine: { cc: 1493, ps: 118, nm: 300, cylinders: 4, turbo: true },
    claimedFE: 17.2,
    realWorldFE: 12.3,
    kerbWeight: 1520,
  },
  M_MHAWK_123: {
    engine: { cc: 1493, ps: 123, nm: 300, cylinders: 4, turbo: true },
    claimedFE: 17.3,
    realWorldFE: 12.4,
    kerbWeight: 1485,
  },
  M_MHAWK_130: {
    engine: { cc: 2179, ps: 130, nm: 300, cylinders: 4, turbo: true },
    claimedFE: 16.0,
    realWorldFE: 11.5,
    kerbWeight: 1825,
  },
  M_MSTALLION_203: {
    engine: { cc: 1997, ps: 203, nm: 380, cylinders: 4, turbo: true },
    claimedFE: 15.5,
    realWorldFE: 11.1,
    kerbWeight: 1720,
  },
  M_MHAWK_185: {
    engine: { cc: 2184, ps: 185, nm: 450, cylinders: 4, turbo: true },
    claimedFE: 16.8,
    realWorldFE: 12.0,
    kerbWeight: 1850,
  },
  M_BE6_PACK1: {
    engine: { cc: 0, ps: 171, nm: 315, cylinders: 0, turbo: false },
    claimedFE: 8.8,
    realWorldFE: 6.3,
    kerbWeight: 1780,
  },
  M_BE6_PACK23: {
    engine: { cc: 0, ps: 231, nm: 380, cylinders: 0, turbo: false },
    claimedFE: 8.5,
    realWorldFE: 6.1,
    kerbWeight: 1920,
  },
  M_BE6_PACK3_SELECT: {
    engine: { cc: 0, ps: 286, nm: 380, cylinders: 0, turbo: false },
    claimedFE: 8.2,
    realWorldFE: 5.9,
    kerbWeight: 1985,
  },
  M_XEV9E_BASE: {
    engine: { cc: 0, ps: 170, nm: 315, cylinders: 0, turbo: false },
    claimedFE: 8.6,
    realWorldFE: 6.2,
    kerbWeight: 2100,
  },
  M_XEV9E_MID: {
    engine: { cc: 0, ps: 231, nm: 380, cylinders: 0, turbo: false },
    claimedFE: 8.3,
    realWorldFE: 6.0,
    kerbWeight: 2240,
  },
  M_XEV9E_TOP: {
    engine: { cc: 0, ps: 286, nm: 380, cylinders: 0, turbo: false },
    claimedFE: 8.0,
    realWorldFE: 5.8,
    kerbWeight: 2310,
  },
  M_XEV9S_BASE: {
    engine: { cc: 0, ps: 108, nm: 190, cylinders: 0, turbo: false },
    claimedFE: 9.5,
    realWorldFE: 6.8,
    kerbWeight: 1850,
  },
  M_XEV9S_MID: {
    engine: { cc: 0, ps: 170, nm: 315, cylinders: 0, turbo: false },
    claimedFE: 8.8,
    realWorldFE: 6.3,
    kerbWeight: 2050,
  },
  M_XEV9S_TOP: {
    engine: { cc: 0, ps: 231, nm: 380, cylinders: 0, turbo: false },
    claimedFE: 8.4,
    realWorldFE: 6.0,
    kerbWeight: 2180,
  },
  M_XUV3XO_EV_BASE: {
    engine: { cc: 0, ps: 110, nm: 190, cylinders: 0, turbo: false },
    claimedFE: 10.2,
    realWorldFE: 7.3,
    kerbWeight: 1540,
  },
  M_XUV3XO_EV_PRO: {
    engine: { cc: 0, ps: 142, nm: 310, cylinders: 0, turbo: false },
    claimedFE: 9.8,
    realWorldFE: 7.0,
    kerbWeight: 1620,
  },
  M_XUV400_BASE: {
    engine: { cc: 0, ps: 110, nm: 190, cylinders: 0, turbo: false },
    claimedFE: 10.0,
    realWorldFE: 7.2,
    kerbWeight: 1580,
  },
  M_XUV400_PRO: {
    engine: { cc: 0, ps: 143, nm: 310, cylinders: 0, turbo: false },
    claimedFE: 9.6,
    realWorldFE: 6.9,
    kerbWeight: 1645,
  },

  // ── Maruti Suzuki ─────────────────────────────────────────────────────────
  MS_K10_PETROL: {
    engine: { cc: 998, ps: 67, nm: 89, cylinders: 3, turbo: false },
    claimedFE: 24.4,
    realWorldFE: 17.5,
    kerbWeight: 740,
  },
  MS_K10_CNG: {
    engine: { cc: 998, ps: 56, nm: 82, cylinders: 3, turbo: false },
    claimedFE: 33.3,
    realWorldFE: 23.8,
    kerbWeight: 805,
  },
  MS_K12_PETROL: {
    engine: { cc: 1197, ps: 83, nm: 113, cylinders: 4, turbo: false },
    claimedFE: 20.9,
    realWorldFE: 15.0,
    kerbWeight: 865,
  },
  MS_K15C_MHEV: {
    engine: { cc: 1462, ps: 103, nm: 139, cylinders: 4, turbo: false },
    claimedFE: 21.2,
    realWorldFE: 15.2,
    kerbWeight: 1185,
  },
  MS_K15C_CNG: {
    engine: { cc: 1462, ps: 87, nm: 121, cylinders: 4, turbo: false },
    claimedFE: 27.0,
    realWorldFE: 19.3,
    kerbWeight: 1245,
  },
  MS_K15C_STRONG_HYBRID: {
    engine: { cc: 1462, ps: 116, nm: 141, cylinders: 4, turbo: false },
    claimedFE: 28.7,
    realWorldFE: 20.5,
    kerbWeight: 1280,
  },
  MS_EECO_PETROL: {
    engine: { cc: 1197, ps: 73, nm: 101, cylinders: 4, turbo: false },
    claimedFE: 19.7,
    realWorldFE: 14.1,
    kerbWeight: 960,
  },
  MS_EECO_CNG: {
    engine: { cc: 1197, ps: 63, nm: 85, cylinders: 4, turbo: false },
    claimedFE: 26.8,
    realWorldFE: 19.2,
    kerbWeight: 1020,
  },
  MS_K15B_JIMNY: {
    engine: { cc: 1462, ps: 103, nm: 134, cylinders: 4, turbo: false },
    claimedFE: 16.9,
    realWorldFE: 12.1,
    kerbWeight: 1195,
  },
  MS_INVICTO_HYBRID: {
    engine: { cc: 1987, ps: 186, nm: 206, cylinders: 4, turbo: false },
    claimedFE: 21.1,
    realWorldFE: 15.1,
    kerbWeight: 1925,
  },
  MS_EVITARA_49: {
    engine: { cc: 0, ps: 142, nm: 189, cylinders: 0, turbo: false },
    claimedFE: 9.5,
    realWorldFE: 6.8,
    kerbWeight: 1620,
  },
  MS_EVITARA_61: {
    engine: { cc: 0, ps: 174, nm: 275, cylinders: 0, turbo: false },
    claimedFE: 9.2,
    realWorldFE: 6.6,
    kerbWeight: 1720,
  },

  // ── MG ────────────────────────────────────────────────────────────────────
  MG_1_5_TURBO: {
    engine: { cc: 1451, ps: 170, nm: 280, cylinders: 4, turbo: true },
    claimedFE: 14.0,
    realWorldFE: 10.0,
    kerbWeight: 1585,
  },
  MG_2_0_DIESEL: {
    engine: { cc: 1996, ps: 218, nm: 480, cylinders: 4, turbo: true },
    claimedFE: 14.5,
    realWorldFE: 10.4,
    kerbWeight: 2185,
  },
  MG_COMET_EV: {
    engine: { cc: 0, ps: 42, nm: 110, cylinders: 0, turbo: false },
    claimedFE: 11.5,
    realWorldFE: 8.3,
    kerbWeight: 815,
  },
  MG_CYBERSTER: {
    engine: { cc: 0, ps: 544, nm: 725, cylinders: 0, turbo: false },
    claimedFE: 5.5,
    realWorldFE: 4.0,
    kerbWeight: 1985,
  },
  MG_M9_EV: {
    engine: { cc: 0, ps: 340, nm: 520, cylinders: 0, turbo: false },
    claimedFE: 7.0,
    realWorldFE: 5.0,
    kerbWeight: 2750,
  },
  MG_MAJESTOR_DIESEL: {
    engine: { cc: 1996, ps: 218, nm: 480, cylinders: 4, turbo: true },
    claimedFE: 13.8,
    realWorldFE: 9.9,
    kerbWeight: 2285,
  },

  // ── Nissan ────────────────────────────────────────────────────────────────
  NISSAN_1_0_TURBO: {
    engine: { cc: 999, ps: 100, nm: 160, cylinders: 3, turbo: true },
    claimedFE: 18.5,
    realWorldFE: 13.3,
    kerbWeight: 1185,
  },
  NISSAN_XTRAIL_EPOWER: {
    engine: { cc: 1497, ps: 204, nm: 330, cylinders: 3, turbo: false },
    claimedFE: 23.7,
    realWorldFE: 17.0,
    kerbWeight: 1685,
  },

  // ── Renault ───────────────────────────────────────────────────────────────
  RENAULT_1_0_SCe: {
    engine: { cc: 999, ps: 68, nm: 91, cylinders: 3, turbo: false },
    claimedFE: 22.0,
    realWorldFE: 15.8,
    kerbWeight: 830,
  },
  RENAULT_1_0_TURBO: {
    engine: { cc: 999, ps: 72, nm: 96, cylinders: 3, turbo: false },
    claimedFE: 19.0,
    realWorldFE: 13.6,
    kerbWeight: 1045,
  },
  RENAULT_1_5_TURBO: {
    engine: { cc: 1498, ps: 160, nm: 260, cylinders: 4, turbo: true },
    claimedFE: 18.5,
    realWorldFE: 13.3,
    kerbWeight: 1385,
  },

  // ── Skoda ─────────────────────────────────────────────────────────────────
  SKODA_2TSI_190: {
    engine: { cc: 1984, ps: 190, nm: 320, cylinders: 4, turbo: true },
    claimedFE: 14.7,
    realWorldFE: 10.5,
    kerbWeight: 1585,
  },
  SKODA_2TSI_265: {
    engine: { cc: 1984, ps: 265, nm: 350, cylinders: 4, turbo: true },
    claimedFE: 13.2,
    realWorldFE: 9.5,
    kerbWeight: 1485,
  },

  // ── Tata ──────────────────────────────────────────────────────────────────
  TATA_1_2_REVOTRON: {
    engine: { cc: 1199, ps: 86, nm: 113, cylinders: 3, turbo: false },
    claimedFE: 19.2,
    realWorldFE: 13.8,
    kerbWeight: 1025,
  },
  TATA_1_2_REVOTRON_CNG: {
    engine: { cc: 1199, ps: 73, nm: 95, cylinders: 3, turbo: false },
    claimedFE: 26.5,
    realWorldFE: 19.0,
    kerbWeight: 1085,
  },
  TATA_1_5_NA: {
    engine: { cc: 1498, ps: 106, nm: 145, cylinders: 4, turbo: false },
    claimedFE: 17.4,
    realWorldFE: 12.5,
    kerbWeight: 1420,
  },
  TATA_1_5_TGDI: {
    engine: { cc: 1498, ps: 160, nm: 255, cylinders: 4, turbo: true },
    claimedFE: 15.3,
    realWorldFE: 11.0,
    kerbWeight: 1525,
  },
  TATA_1_5_DIESEL: {
    engine: { cc: 1498, ps: 118, nm: 280, cylinders: 4, turbo: true },
    claimedFE: 21.3,
    realWorldFE: 15.3,
    kerbWeight: 1585,
  },
  TATA_CURVV_EV_45: {
    engine: { cc: 0, ps: 150, nm: 215, cylinders: 0, turbo: false },
    claimedFE: 9.0,
    realWorldFE: 6.5,
    kerbWeight: 1620,
  },
  TATA_CURVV_EV_55: {
    engine: { cc: 0, ps: 167, nm: 215, cylinders: 0, turbo: false },
    claimedFE: 9.1,
    realWorldFE: 6.6,
    kerbWeight: 1690,
  },
  TATA_HARRIER_EV_RWD: {
    engine: { cc: 0, ps: 238, nm: 315, cylinders: 0, turbo: false },
    claimedFE: 7.8,
    realWorldFE: 5.6,
    kerbWeight: 2180,
  },
  TATA_HARRIER_EV_AWD: {
    engine: { cc: 0, ps: 293, nm: 504, cylinders: 0, turbo: false },
    claimedFE: 7.2,
    realWorldFE: 5.2,
    kerbWeight: 2350,
  },
  TATA_NEXON_EV_30: {
    engine: { cc: 0, ps: 129, nm: 215, cylinders: 0, turbo: false },
    claimedFE: 10.8,
    realWorldFE: 7.8,
    kerbWeight: 1400,
  },
  TATA_NEXON_EV_45: {
    engine: { cc: 0, ps: 142, nm: 215, cylinders: 0, turbo: false },
    claimedFE: 10.9,
    realWorldFE: 7.8,
    kerbWeight: 1480,
  },
  TATA_NEXON_EV_45_DARK: {
    engine: { cc: 0, ps: 143, nm: 250, cylinders: 0, turbo: false },
    claimedFE: 10.5,
    realWorldFE: 7.5,
    kerbWeight: 1510,
  },
  TATA_PUNCH_EV_MR: {
    engine: { cc: 0, ps: 82, nm: 114, cylinders: 0, turbo: false },
    claimedFE: 10.5,
    realWorldFE: 7.6,
    kerbWeight: 1220,
  },
  TATA_PUNCH_EV_LR: {
    engine: { cc: 0, ps: 122, nm: 190, cylinders: 0, turbo: false },
    claimedFE: 10.5,
    realWorldFE: 7.6,
    kerbWeight: 1340,
  },
  TATA_TIAGO_EV_MR: {
    engine: { cc: 0, ps: 74, nm: 114, cylinders: 0, turbo: false },
    claimedFE: 11.2,
    realWorldFE: 8.0,
    kerbWeight: 1085,
  },
  TATA_TIAGO_EV_LR: {
    engine: { cc: 0, ps: 114, nm: 177, cylinders: 0, turbo: false },
    claimedFE: 11.0,
    realWorldFE: 7.9,
    kerbWeight: 1155,
  },
  TATA_TIGOR_EV_MR: {
    engine: { cc: 0, ps: 74, nm: 114, cylinders: 0, turbo: false },
    claimedFE: 11.0,
    realWorldFE: 7.9,
    kerbWeight: 1120,
  },
  TATA_TIGOR_EV_LR: {
    engine: { cc: 0, ps: 114, nm: 177, cylinders: 0, turbo: false },
    claimedFE: 10.8,
    realWorldFE: 7.7,
    kerbWeight: 1190,
  },

  // ── Toyota ────────────────────────────────────────────────────────────────
  TOYOTA_1_2_K_SERIES: {
    engine: { cc: 1197, ps: 82, nm: 113, cylinders: 4, turbo: false },
    claimedFE: 22.4,
    realWorldFE: 16.1,
    kerbWeight: 920,
  },
  TOYOTA_1_2_K_CNG: {
    engine: { cc: 1197, ps: 69, nm: 95, cylinders: 4, turbo: false },
    claimedFE: 30.5,
    realWorldFE: 21.9,
    kerbWeight: 985,
  },
  TOYOTA_K15C_MHEV: {
    engine: { cc: 1462, ps: 103, nm: 139, cylinders: 4, turbo: false },
    claimedFE: 20.5,
    realWorldFE: 14.7,
    kerbWeight: 1145,
  },
  TOYOTA_K15C_CNG: {
    engine: { cc: 1462, ps: 88, nm: 121, cylinders: 4, turbo: false },
    claimedFE: 26.6,
    realWorldFE: 19.1,
    kerbWeight: 1205,
  },
  TOYOTA_2_5_CAMRY_HYBRID: {
    engine: { cc: 2487, ps: 230, nm: 221, cylinders: 4, turbo: false },
    claimedFE: 25.5,
    realWorldFE: 18.3,
    kerbWeight: 1625,
  },
  TOYOTA_2_8_DIESEL: {
    engine: { cc: 2755, ps: 204, nm: 500, cylinders: 4, turbo: true },
    claimedFE: 12.8,
    realWorldFE: 9.2,
    kerbWeight: 2105,
  },
  TOYOTA_2_0_NA: {
    engine: { cc: 1987, ps: 174, nm: 205, cylinders: 4, turbo: false },
    claimedFE: 16.1,
    realWorldFE: 11.5,
    kerbWeight: 1745,
  },
  TOYOTA_2_0_STRONG_HYBRID: {
    engine: { cc: 1987, ps: 186, nm: 206, cylinders: 4, turbo: false },
    claimedFE: 21.1,
    realWorldFE: 15.1,
    kerbWeight: 1925,
  },
  TOYOTA_K15C_STRONG_HYBRID: {
    engine: { cc: 1462, ps: 116, nm: 141, cylinders: 4, turbo: false },
    claimedFE: 28.5,
    realWorldFE: 20.4,
    kerbWeight: 1285,
  },
  TOYOTA_3_3_DIESEL: {
    engine: { cc: 3346, ps: 309, nm: 700, cylinders: 6, turbo: true },
    claimedFE: 10.2,
    realWorldFE: 7.3,
    kerbWeight: 2585,
  },
  TOYOTA_VELLFIRE_HYBRID: {
    engine: { cc: 2487, ps: 180, nm: 235, cylinders: 4, turbo: false },
    claimedFE: 17.5,
    realWorldFE: 12.5,
    kerbWeight: 2275,
  },

  // ── Volkswagen ────────────────────────────────────────────────────────────
  VW_2TSI_190: {
    engine: { cc: 1984, ps: 190, nm: 320, cylinders: 4, turbo: true },
    claimedFE: 13.5,
    realWorldFE: 9.7,
    kerbWeight: 1645,
  },
  VW_2TSI_245: {
    engine: { cc: 1984, ps: 245, nm: 370, cylinders: 4, turbo: true },
    claimedFE: 12.5,
    realWorldFE: 9.0,
    kerbWeight: 1425,
  },
};

// ---------------------------------------------------------------------------
// MODEL_RULES — first match wins per variant
// ---------------------------------------------------------------------------

export const MODEL_RULES = {
  // ── Audi ──────────────────────────────────────────────────────────────────
  "audi-a4": [
    { match: { fuel: "petrol" }, pt: "AUDI_2TFSI_190", transmission: "DCT" },
  ],
  "audi-a6": [
    { match: { fuel: "petrol" }, pt: "AUDI_2TFSI_245", transmission: "DCT" },
  ],
  "audi-e-tron-gt": [
    { match: { fuel: "ev" }, pt: "AUDI_ETRON_GT", transmission: "AT" },
  ],
  "audi-q3-sportback": [
    { match: { fuel: "petrol" }, pt: "AUDI_2TFSI_190", transmission: "DCT" },
  ],
  "audi-q7": [
    { match: { fuel: "petrol" }, pt: "AUDI_3TFSI_340", transmission: "AT" },
  ],
  "audi-q8": [
    { match: { fuel: "petrol" }, pt: "AUDI_3TFSI_340", transmission: "AT" },
  ],
  "audi-rs-e-tron-gt": [
    { match: { fuel: "ev" }, pt: "AUDI_RS_ETRON_GT", transmission: "AT" },
  ],
  "audi-rs-q8": [
    { match: { name: /performance/i }, pt: "AUDI_4TFSI_600", transmission: "AT" },
    { match: { fuel: "petrol" }, pt: "AUDI_4TFSI_600", transmission: "AT" },
  ],
  "audi-s5-sportback": [
    { match: { fuel: "petrol" }, pt: "AUDI_3TFSI_354", transmission: "AT" },
  ],

  // ── BYD ───────────────────────────────────────────────────────────────────
  "byd-atto3": [
    { match: { name: /50/i }, pt: "BYD_ATTO3_50", transmission: "AT" },
    { match: { name: /60/i }, pt: "BYD_ATTO3_60", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "BYD_ATTO3_50", transmission: "AT" },
  ],
  "byd-emax-7": [
    { match: { fuel: "ev" }, pt: "BYD_EMAX7", transmission: "AT" },
  ],
  "byd-sealion-7": [
    { match: { name: /performance/i }, pt: "BYD_SEALION7_AWD", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "BYD_SEALION7_RWD", transmission: "AT" },
  ],
  "byd-seal": [
    { match: { name: /performance|awd|82/i }, pt: "BYD_SEAL_AWD", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "BYD_SEAL_RWD", transmission: "AT" },
  ],

  // ── Honda ─────────────────────────────────────────────────────────────────
  "honda-city-e-hev": [
    {
      match: { fuel: "petrol" },
      pt: "HONDA_CITY_EHEV",
      transmission: "AT",
      hybrid: "strong",
    },
  ],

  // ── Hyundai ───────────────────────────────────────────────────────────────
  "hyundai-alcazar": [
    { match: { name: /at/i }, pt: "HYUNDAI_1_5_TGDI", transmission: "DCT" },
    { match: { name: /knight/i }, pt: "HYUNDAI_1_5_TGDI", transmission: "MT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_5_TGDI", transmission: "MT" },
  ],
  "hyundai-aura": [
    { match: { fuel: "cng" }, pt: "HYUNDAI_1_2_KAPPA_CNG", transmission: "MT" },
    { match: { name: /amt/i }, pt: "HYUNDAI_1_2_KAPPA", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_2_KAPPA", transmission: "MT" },
  ],
  "hyundai-creta-electric": [
    { match: { name: /51|51\.4/i }, pt: "HYUNDAI_CRETA_EV_51", transmission: "AT" },
    { match: { name: /42/i }, pt: "HYUNDAI_CRETA_EV_42", transmission: "AT" },
    { match: { name: /premium/i }, pt: "HYUNDAI_CRETA_EV_51", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "HYUNDAI_CRETA_EV_42", transmission: "AT" },
  ],
  "hyundai-creta-n-line": [
    { match: { name: /dct/i }, pt: "HYUNDAI_1_5_TGDI", transmission: "DCT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_5_TGDI", transmission: "MT" },
  ],
  "hyundai-grand-i10-nios": [
    { match: { fuel: "cng" }, pt: "HYUNDAI_1_2_KAPPA_CNG", transmission: "MT" },
    { match: { name: /amt/i }, pt: "HYUNDAI_1_2_KAPPA", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_2_KAPPA", transmission: "MT" },
  ],
  "hyundai-i20": [
    { match: { name: /ivt|cvt/i }, pt: "HYUNDAI_1_2_KAPPA", transmission: "CVT" },
    { match: { name: /amt/i }, pt: "HYUNDAI_1_2_KAPPA", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_2_KAPPA", transmission: "MT" },
  ],
  "hyundai-i20-n-line": [
    { match: { name: /dct/i }, pt: "HYUNDAI_1_0_TGDI", transmission: "DCT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_0_TGDI", transmission: "MT" },
  ],
  "hyundai-venue-n-line": [
    { match: { name: /dct/i }, pt: "HYUNDAI_1_0_TGDI", transmission: "DCT" },
    { match: { fuel: "petrol" }, pt: "HYUNDAI_1_0_TGDI", transmission: "MT" },
  ],

  // ── Jeep ──────────────────────────────────────────────────────────────────
  "jeep-grand-cherokee": [
    { match: { fuel: "petrol" }, pt: "JEEP_3_6_V6", transmission: "AT" },
  ],
  "jeep-meridian": [
    { match: { name: /at/i }, pt: "JEEP_2_0_MULTIJET", transmission: "AT" },
    { match: { name: /4x4/i }, pt: "JEEP_2_0_MULTIJET", transmission: "MT" },
    { match: { fuel: "diesel" }, pt: "JEEP_2_0_MULTIJET", transmission: "MT" },
  ],
  "jeep-wrangler": [
    { match: { fuel: "petrol" }, pt: "JEEP_2_0_TURBO", transmission: "AT" },
  ],

  // ── Kia ───────────────────────────────────────────────────────────────────
  "kia-carens-clavis": [
    { match: { fuel: "petrol" }, pt: "KIA_1_5_MPI", transmission: "MT" },
  ],
  "kia-carens-clavis-ev": [
    { match: { fuel: "ev" }, pt: "KIA_CLAVIS_EV", transmission: "AT" },
  ],
  "kia-carnival": [
    { match: { fuel: "diesel" }, pt: "KIA_2_2_CRDI", transmission: "AT" },
  ],
  "kia-ev6": [
    { match: { name: /awd/i }, pt: "KIA_EV6_AWD", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "KIA_EV6_RWD", transmission: "AT" },
  ],
  "kia-ev9": [
    { match: { fuel: "ev" }, pt: "KIA_EV9_AWD", transmission: "AT" },
  ],
  "kia-syros": [
    { match: { name: /gtx/i }, pt: "KIA_1_0_TGDI", transmission: "DCT" },
    { match: { name: /htx/i }, pt: "KIA_1_0_TGDI", transmission: "DCT" },
    { match: { fuel: "petrol" }, pt: "KIA_1_0_TGDI", transmission: "MT" },
  ],

  // ── Mahindra ──────────────────────────────────────────────────────────────
  "mahindra-be-6": [
    { match: { name: /pack three select/i }, pt: "M_BE6_PACK3_SELECT", transmission: "AT" },
    { match: { name: /pack three/i }, pt: "M_BE6_PACK23", transmission: "AT" },
    { match: { name: /pack two/i }, pt: "M_BE6_PACK23", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "M_BE6_PACK1", transmission: "AT" },
  ],
  "mahindra-be-6-fe": [
    { match: { fuel: "ev" }, pt: "M_BE6_PACK3_SELECT", transmission: "AT" },
  ],
  "mahindra-bolero-neo": [
    { match: { fuel: "diesel" }, pt: "M_MHAWK_100", transmission: "MT" },
  ],
  "mahindra-bolero-neo-plus": [
    { match: { fuel: "diesel" }, pt: "M_MHAWK_118", transmission: "MT" },
  ],
  "mahindra-marazzo": [
    { match: { fuel: "diesel" }, pt: "M_MHAWK_123", transmission: "MT" },
  ],
  "mahindra-scorpio": [
    { match: { fuel: "diesel" }, pt: "M_MHAWK_130", transmission: "MT" },
  ],
  "mahindra-xev-9e": [
    { match: { name: /pack three/i }, pt: "M_XEV9E_TOP", transmission: "AT" },
    { match: { name: /pack two/i }, pt: "M_XEV9E_MID", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "M_XEV9E_BASE", transmission: "AT" },
  ],
  "mahindra-xev-9s": [
    { match: { name: /pack three/i }, pt: "M_XEV9S_TOP", transmission: "AT" },
    { match: { name: /pack two/i }, pt: "M_XEV9S_MID", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "M_XEV9S_BASE", transmission: "AT" },
  ],
  "mahindra-xuv-3xo-ev": [
    { match: { name: /el pro|el$/i }, pt: "M_XUV3XO_EV_PRO", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "M_XUV3XO_EV_BASE", transmission: "AT" },
  ],
  "mahindra-xuv-7xo": [
    { match: { name: /ax7/i }, pt: "M_MSTALLION_203", transmission: "MT" },
    { match: { fuel: "petrol" }, pt: "M_MSTALLION_203", transmission: "MT" },
  ],
  "mahindra-xuv400": [
    { match: { name: /el pro/i }, pt: "M_XUV400_PRO", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "M_XUV400_BASE", transmission: "AT" },
  ],

  // ── Maruti Suzuki ─────────────────────────────────────────────────────────
  "maruti-alto-k10": [
    { match: { fuel: "cng" }, pt: "MS_K10_CNG", transmission: "MT" },
    { match: { name: /ags|amt/i }, pt: "MS_K10_PETROL", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "MS_K10_PETROL", transmission: "MT" },
  ],
  "maruti-celerio": [
    { match: { fuel: "cng" }, pt: "MS_K10_CNG", transmission: "MT" },
    { match: { name: /amt/i }, pt: "MS_K10_PETROL", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "MS_K10_PETROL", transmission: "MT" },
  ],
  "maruti-e-vitara": [
    { match: { name: /61/i }, pt: "MS_EVITARA_61", transmission: "AT" },
    { match: { name: /alpha/i }, pt: "MS_EVITARA_61", transmission: "AT" },
    { match: { name: /49/i }, pt: "MS_EVITARA_49", transmission: "AT" },
    { match: { name: /delta/i }, pt: "MS_EVITARA_49", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "MS_EVITARA_49", transmission: "AT" },
  ],
  "maruti-eeco": [
    { match: { fuel: "cng" }, pt: "MS_EECO_CNG", transmission: "MT" },
    { match: { fuel: "petrol" }, pt: "MS_EECO_PETROL", transmission: "MT" },
  ],
  "maruti-ignis": [
    { match: { name: /amt/i }, pt: "MS_K12_PETROL", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "MS_K12_PETROL", transmission: "MT" },
  ],
  "maruti-invicto": [
    {
      match: { fuel: "petrol" },
      pt: "MS_INVICTO_HYBRID",
      transmission: "AT",
      hybrid: "strong",
    },
  ],
  "maruti-jimny": [
    { match: { name: /at/i }, pt: "MS_K15B_JIMNY", transmission: "AT" },
    { match: { fuel: "petrol" }, pt: "MS_K15B_JIMNY", transmission: "MT" },
  ],
  "maruti-s-presso": [
    { match: { fuel: "cng" }, pt: "MS_K10_CNG", transmission: "MT" },
    { match: { name: /ags|amt/i }, pt: "MS_K10_PETROL", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "MS_K10_PETROL", transmission: "MT" },
  ],
  "maruti-victoris": [
    { match: { fuel: "cng" }, pt: "MS_K15C_CNG", transmission: "MT" },
    { match: { name: /awd/i }, pt: "MS_K15C_MHEV", transmission: "AT" },
    { match: { name: /ecvt|hybrid/i }, pt: "MS_K15C_STRONG_HYBRID", transmission: "AT", hybrid: "strong" },
    { match: { fuel: "petrol" }, pt: "MS_K15C_MHEV", transmission: "MT", hybrid: "mild" },
  ],
  "maruti-wagon-r": [
    { match: { fuel: "cng" }, pt: "MS_K10_CNG", transmission: "MT" },
    { match: { name: /ags|amt/i }, pt: "MS_K10_PETROL", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "MS_K10_PETROL", transmission: "MT" },
  ],
  "maruti-xl6": [
    { match: { fuel: "cng" }, pt: "MS_K15C_CNG", transmission: "MT" },
    { match: { name: /at/i }, pt: "MS_K15C_MHEV", transmission: "AT", hybrid: "mild" },
    { match: { fuel: "petrol" }, pt: "MS_K15C_MHEV", transmission: "MT", hybrid: "mild" },
  ],

  // ── MG ────────────────────────────────────────────────────────────────────
  "mg-comet-ev": [
    { match: { fuel: "ev" }, pt: "MG_COMET_EV", transmission: "AT" },
  ],
  "mg-cyberster": [
    { match: { fuel: "ev" }, pt: "MG_CYBERSTER", transmission: "AT" },
  ],
  "mg-gloster": [
    { match: { fuel: "diesel" }, pt: "MG_2_0_DIESEL", transmission: "AT" },
  ],
  "mg-hector-plus": [
    { match: { fuel: "petrol" }, pt: "MG_1_5_TURBO", transmission: "MT" },
  ],
  "mg-m9": [
    { match: { fuel: "ev" }, pt: "MG_M9_EV", transmission: "AT" },
  ],
  "mg-majestor": [
    { match: { fuel: "diesel" }, pt: "MG_MAJESTOR_DIESEL", transmission: "AT" },
  ],

  // ── Nissan ────────────────────────────────────────────────────────────────
  "nissan-tekton": [
    { match: { fuel: "petrol" }, pt: "NISSAN_1_0_TURBO", transmission: "MT" },
  ],
  "nissan-x-trail": [
    {
      match: { fuel: "petrol" },
      pt: "NISSAN_XTRAIL_EPOWER",
      transmission: "AT",
      hybrid: "strong",
    },
  ],

  // ── Renault ───────────────────────────────────────────────────────────────
  "renault-duster": [
    { match: { fuel: "petrol" }, pt: "RENAULT_1_5_TURBO", transmission: "MT" },
  ],
  "renault-kwid": [
    { match: { name: /amt/i }, pt: "RENAULT_1_0_SCe", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "RENAULT_1_0_SCe", transmission: "MT" },
  ],
  "renault-triber": [
    { match: { name: /amt/i }, pt: "RENAULT_1_0_TURBO", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "RENAULT_1_0_TURBO", transmission: "MT" },
  ],

  // ── Skoda ─────────────────────────────────────────────────────────────────
  "skoda-octavia-rs": [
    { match: { fuel: "petrol" }, pt: "SKODA_2TSI_265", transmission: "DCT" },
  ],
  "skoda-superb": [
    { match: { fuel: "petrol" }, pt: "SKODA_2TSI_190", transmission: "DCT" },
  ],

  // ── Tata ──────────────────────────────────────────────────────────────────
  "tata-curvv-ev": [
    { match: { name: /55/i }, pt: "TATA_CURVV_EV_55", transmission: "AT" },
    { match: { name: /45|creative/i }, pt: "TATA_CURVV_EV_45", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_CURVV_EV_45", transmission: "AT" },
  ],
  "tata-harrier-ev": [
    { match: { name: /awd/i }, pt: "TATA_HARRIER_EV_AWD", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_HARRIER_EV_RWD", transmission: "AT" },
  ],
  "tata-nexon-ev": [
    { match: { name: /dark/i }, pt: "TATA_NEXON_EV_45_DARK", transmission: "AT" },
    { match: { name: /lr|empowered/i }, pt: "TATA_NEXON_EV_45", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_NEXON_EV_30", transmission: "AT" },
  ],
  "tata-punch-ev": [
    { match: { name: /mr|smart/i }, pt: "TATA_PUNCH_EV_MR", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_PUNCH_EV_LR", transmission: "AT" },
  ],
  "tata-sierra": [
    { match: { name: /persona|accomplished/i }, pt: "TATA_1_5_TGDI", transmission: "AT" },
    { match: { name: /adventure/i }, pt: "TATA_1_5_DIESEL", transmission: "MT" },
    { match: { fuel: "petrol" }, pt: "TATA_1_5_NA", transmission: "MT" },
  ],
  "tata-tiago": [
    { match: { fuel: "petrol" }, pt: "TATA_1_2_REVOTRON", transmission: "MT" },
  ],
  "tata-tiago-ev": [
    { match: { name: /xe/i }, pt: "TATA_TIAGO_EV_MR", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_TIAGO_EV_LR", transmission: "AT" },
  ],
  "tata-tigor": [
    { match: { fuel: "cng" }, pt: "TATA_1_2_REVOTRON_CNG", transmission: "MT" },
    { match: { name: /amt/i }, pt: "TATA_1_2_REVOTRON", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "TATA_1_2_REVOTRON", transmission: "MT" },
  ],
  "tata-tigor-ev": [
    { match: { name: /xe/i }, pt: "TATA_TIGOR_EV_MR", transmission: "AT" },
    { match: { fuel: "ev" }, pt: "TATA_TIGOR_EV_LR", transmission: "AT" },
  ],

  // ── Toyota ────────────────────────────────────────────────────────────────
  "toyota-camry": [
    {
      match: { fuel: "petrol" },
      pt: "TOYOTA_2_5_CAMRY_HYBRID",
      transmission: "AT",
      hybrid: "strong",
    },
  ],
  "toyota-glanza": [
    { match: { fuel: "cng" }, pt: "TOYOTA_1_2_K_CNG", transmission: "MT" },
    { match: { name: /amt/i }, pt: "TOYOTA_1_2_K_SERIES", transmission: "AMT" },
    { match: { fuel: "petrol" }, pt: "TOYOTA_1_2_K_SERIES", transmission: "MT" },
  ],
  "toyota-hilux": [
    { match: { name: /at/i }, pt: "TOYOTA_2_8_DIESEL", transmission: "AT" },
    { match: { fuel: "diesel" }, pt: "TOYOTA_2_8_DIESEL", transmission: "MT" },
  ],
  "toyota-innova-hycross": [
    {
      match: { name: /hybrid/i },
      pt: "TOYOTA_2_0_STRONG_HYBRID",
      transmission: "AT",
      hybrid: "strong",
    },
    { match: { fuel: "petrol" }, pt: "TOYOTA_2_0_NA", transmission: "MT" },
  ],
  "toyota-land-cruiser": [
    { match: { fuel: "diesel" }, pt: "TOYOTA_3_3_DIESEL", transmission: "AT" },
  ],
  "toyota-rumion": [
    { match: { fuel: "cng" }, pt: "TOYOTA_K15C_CNG", transmission: "MT" },
    { match: { name: /at/i }, pt: "TOYOTA_K15C_MHEV", transmission: "AT", hybrid: "mild" },
    { match: { fuel: "petrol" }, pt: "TOYOTA_K15C_MHEV", transmission: "MT", hybrid: "mild" },
  ],
  "toyota-urban-cruiser-ebella": [
    {
      match: { name: /strong hybrid/i },
      pt: "TOYOTA_K15C_STRONG_HYBRID",
      transmission: "AT",
      hybrid: "strong",
    },
    { match: { fuel: "petrol" }, pt: "TOYOTA_K15C_MHEV", transmission: "MT", hybrid: "mild" },
  ],
  "toyota-vellfire": [
    {
      match: { fuel: "petrol" },
      pt: "TOYOTA_VELLFIRE_HYBRID",
      transmission: "AT",
      hybrid: "strong",
    },
  ],

  // ── Volkswagen ──────────────────────────────────────────────────────────
  "volkswagen-golf-gti": [
    { match: { fuel: "petrol" }, pt: "VW_2TSI_245", transmission: "DCT" },
  ],
  "volkswagen-tiguan-r-line": [
    { match: { fuel: "petrol" }, pt: "VW_2TSI_190", transmission: "DCT" },
  ],
};

// ---------------------------------------------------------------------------
// PRICE_ANCHORS — ex-showroom [minLakhs, maxLakhs] for models with bad prices
// ---------------------------------------------------------------------------

export const PRICE_ANCHORS = {
  "byd-emax-7": [21.99, 27.99],
  "byd-sealion-7": [48.99, 58.99],
  "honda-city-e-hev": [18.89, 22.89],
  "hyundai-creta-n-line": [16.34, 20.79],
  "hyundai-i20-n-line": [9.99, 12.49],
  "hyundai-venue-n-line": [11.99, 15.99],
  "jeep-grand-cherokee": [75.00, 75.00],
  "jeep-wrangler": [67.65, 72.99],
  "kia-carens-clavis": [10.99, 18.49],
  "kia-carens-clavis-ev": [17.99, 24.99],
  "kia-ev9": [64.99, 69.99],
  "mahindra-be-6": [18.90, 26.90],
  "mahindra-be-6-fe": [21.90, 24.50],
  "mahindra-bolero-neo-plus": [9.99, 11.49],
  "mahindra-marazzo": [14.59, 16.99],
  "mahindra-scorpio": [13.99, 17.49],
  "mahindra-xev-9e": [21.90, 31.25],
  "mahindra-xev-9s": [18.99, 24.99],
  "mahindra-xuv-3xo-ev": [14.99, 19.99],
  "mahindra-xuv-7xo": [13.99, 26.90],
  "maruti-e-vitara": [17.49, 24.99],
  "maruti-eeco": [4.89, 6.79],
  "maruti-victoris": [10.50, 19.99],
  "mg-cyberster": [75.00, 75.00],
  "mg-majestor": [44.99, 54.99],
  "mg-m9": [55.00, 65.00],
  "nissan-x-trail": [49.99, 49.99],
  "skoda-octavia-rs": [45.99, 45.99],
  "skoda-superb": [46.49, 46.49],
  "tata-harrier-ev": [24.99, 32.99],
  "tata-sierra": [11.49, 21.29],
  "tata-tiago-ev": [7.99, 12.49],
  "tata-tigor-ev": [12.49, 14.99],
  "toyota-camry": [48.99, 52.99],
  "toyota-hilux": [30.49, 37.90],
  "toyota-land-cruiser": [225.00, 235.00],
  "toyota-urban-cruiser-ebella": [8.99, 19.99],
  "toyota-vellfire": [120.00, 135.00],
  "volkswagen-golf-gti": [42.99, 42.99],
  "volkswagen-tiguan-r-line": [43.99, 43.99],
};
