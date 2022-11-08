import { defineStore } from "pinia";
export const useLang = defineStore("lang", {
  state: () => ({
    languages: [
      { code: "th", codeTranslator: "th", name: "ไทย", use: true },
      { code: "en", codeTranslator: "en", name: "อังกฤษ", use: true },
      { code: "cn", codeTranslator: "zh-cn", name: "จีน", use: false },
      { code: "jp", codeTranslator: "th", name: "ญี่ปุ่น", use: false },
      { code: "kr", codeTranslator: "th", name: "เกาหลี", use: false },
      { code: "lo", codeTranslator: "lo", name: "ลาว", use: true },
      { code: "mr", codeTranslator: "th", name: "เมียนม่า", use: false },
      { code: "my", codeTranslator: "th", name: "มาเลเซีย", use: false },
      { code: "vi", codeTranslator: "th", name: "เวียดนาม", use: false },
      { code: "km", codeTranslator: "th", name: "เขมร", use: false },
    ],
    activeLang:'th'
  }),
  actions: {
 
  },
});
