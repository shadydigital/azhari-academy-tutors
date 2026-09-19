import type { Locale } from "./i18n";

export type LocalizedOption = { value: string; en: string; ar: string };

export const COUNTRY_CODES = (
  "AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR CI HR CU CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW"
).split(" ");

export const EGYPT_GOVERNORATES: LocalizedOption[] = [
  ["cairo", "Cairo", "القاهرة"], ["giza", "Giza", "الجيزة"], ["alexandria", "Alexandria", "الإسكندرية"],
  ["dakahlia", "Dakahlia", "الدقهلية"], ["red-sea", "Red Sea", "البحر الأحمر"], ["beheira", "Beheira", "البحيرة"],
  ["fayoum", "Fayoum", "الفيوم"], ["gharbia", "Gharbia", "الغربية"], ["ismailia", "Ismailia", "الإسماعيلية"],
  ["menofia", "Menofia", "المنوفية"], ["minya", "Minya", "المنيا"], ["qaliubiya", "Qaliubiya", "القليوبية"],
  ["new-valley", "New Valley", "الوادي الجديد"], ["suez", "Suez", "السويس"], ["aswan", "Aswan", "أسوان"],
  ["assiut", "Assiut", "أسيوط"], ["beni-suef", "Beni Suef", "بني سويف"], ["port-said", "Port Said", "بورسعيد"],
  ["damietta", "Damietta", "دمياط"], ["sharkia", "Sharkia", "الشرقية"], ["south-sinai", "South Sinai", "جنوب سيناء"],
  ["kafr-el-sheikh", "Kafr El Sheikh", "كفر الشيخ"], ["matrouh", "Matrouh", "مطروح"], ["luxor", "Luxor", "الأقصر"],
  ["qena", "Qena", "قنا"], ["north-sinai", "North Sinai", "شمال سيناء"], ["sohag", "Sohag", "سوهاج"]
].map(([value, en, ar]) => ({ value, en, ar }));

const egyptUniversityNames = [
  "Al-Azhar University", "Cairo University", "Alexandria University", "Ain Shams University", "Assiut University",
  "Tanta University", "Mansoura University", "Zagazig University", "Capital University (formerly Helwan University)",
  "Minia University", "Menoufia University", "Suez Canal University", "Qena University (formerly South Valley University)",
  "Benha University", "Fayoum University", "Beni-Suef University", "Kafrelsheikh University", "Sohag University",
  "Port Said University", "Damanhour University", "Damietta University", "Aswan University", "Suez University",
  "University of Sadat City", "Arish University", "Matrouh University", "New Valley University", "Luxor University", "Hurghada University",
  "American University in Cairo", "Arab Academy for Science, Technology and Maritime Transport", "German University in Cairo",
  "British University in Egypt", "French University in Egypt", "Egypt-Japan University of Science and Technology",
  "Nile University", "Egyptian E-Learning University", "King Salman International University", "Alamein International University",
  "Galala University", "New Mansoura University", "Egypt University of Informatics", "Mansoura National University",
  "Helwan National University", "Benha National University", "Beni Suef National University", "South Valley National University",
  "Zagazig National University", "Minia National University", "Menoufia National University", "East Port Said National University",
  "Alexandria National University", "Assiut National University", "New Ismailia National University", "New Suez National University",
  "Damanhour National University", "Cairo National University", "Ain Shams National University", "Sohag National University",
  "Kafrelsheikh National University", "New Valley National University", "Fayoum National University", "Tanta National University",
  "Luxor National University", "Damietta National University", "Sadat City National University", "October 6 University",
  "Misr University for Science and Technology", "Misr International University", "Modern Sciences and Arts University",
  "Future University in Egypt", "Badr University in Cairo", "New Giza University", "Ahram Canadian University",
  "Canadian International College", "Egyptian Russian University", "Sinai University", "Pharos University in Alexandria",
  "Delta University for Science and Technology", "Horus University", "Nahda University", "Deraya University",
  "Heliopolis University for Sustainable Development", "Merit University", "Sphinx University", "May University in Cairo",
  "University of Hertfordshire hosted by Global Academic Foundation", "Coventry University hosted by The Knowledge Hub",
  "University of Prince Edward Island hosted by Universities of Canada in Egypt"
];

export const EGYPT_UNIVERSITIES = egyptUniversityNames.map((name) => ({ value: name, en: name, ar: name }));

export const TEACHING_LANGUAGES: LocalizedOption[] = [
  ["ar", "Arabic", "العربية"], ["en", "English", "الإنجليزية"], ["fr", "French", "الفرنسية"],
  ["de", "German", "الألمانية"], ["es", "Spanish", "الإسبانية"], ["tr", "Turkish", "التركية"],
  ["ur", "Urdu", "الأردية"], ["bn", "Bengali", "البنغالية"], ["id", "Indonesian", "الإندونيسية"],
  ["ms", "Malay", "الماليزية"], ["ru", "Russian", "الروسية"], ["sw", "Swahili", "السواحيلية"],
  ["ha", "Hausa", "الهوسا"], ["other", "Other", "أخرى"]
].map(([value, en, ar]) => ({ value, en, ar }));

export const LANGUAGE_LEVELS: LocalizedOption[] = [
  ["native", "Native", "لغة أم"], ["fluent", "Fluent", "طلاقة"], ["advanced", "Advanced", "متقدم"],
  ["intermediate", "Intermediate", "متوسط"], ["basic", "Basic", "أساسي"]
].map(([value, en, ar]) => ({ value, en, ar }));

export const WEEKDAYS: LocalizedOption[] = [
  ["sunday", "Sunday", "الأحد"], ["monday", "Monday", "الاثنين"], ["tuesday", "Tuesday", "الثلاثاء"],
  ["wednesday", "Wednesday", "الأربعاء"], ["thursday", "Thursday", "الخميس"], ["friday", "Friday", "الجمعة"],
  ["saturday", "Saturday", "السبت"]
].map(([value, en, ar]) => ({ value, en, ar }));

export function optionLabel(option: LocalizedOption, locale: Locale) {
  return option[locale];
}

export function countryOptions(locale: Locale) {
  const names = new Intl.DisplayNames([locale], { type: "region" });
  return COUNTRY_CODES.map((code) => ({ value: code, label: names.of(code) || code }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));
}

export function timeZoneOptions() {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
  const zones = intl.supportedValuesOf?.("timeZone") || ["Africa/Cairo", "Asia/Riyadh", "Asia/Dubai", "Europe/London", "America/New_York"];
  return zones.map((value) => ({ value, label: value.replaceAll("_", " ") }));
}
