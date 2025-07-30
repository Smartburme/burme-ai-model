# Burme AI - မြန်မာစကားပြော AI အကူအညီ

![Burme AI Logo](./assets/assets/images/logo.png)

မြန်မာဘာသာစကားဖြင့် အပြန်အလှန်ဆက်သွယ်နိုင်သော AI အကူအညီပေးစနစ်

## ✨ အထူးလုပ်ဆောင်ချက်များ

- မြန်မာဘာသာဖြင့် အပြန်အလှန်စကားပြောနိုင်ခြင်း
- ပုံများဖြင့် အပြန်အလှန်ဆက်သွယ်နိုင်ခြင်း
- စကားပြောမှတ်တမ်းသိမ်းဆည်းခြင်း
- အမှောင်နှင့်အလင်းအပြင်အဆင်မုဒ်များ
- အသံဖြင့်ရိုက်သွင်းနိုင်ခြင်း

## 🚀 အသုံးပြုနည်း

1. **လိုအပ်သော ဆော့ဖ်ဝဲများ တပ်ဆင်ပါ**
   ```bash
   npm install
   ```

2. **ပတ်ဝန်းကျင်အချက်အလက်များ ပြင်ဆင်ပါ**
   ```bash
   cp .env.example .env
   ```
   `.env` ဖိုင်တွင် သင့်၏ Gemini API Key ထည့်သွင်းပါ

3. **ဒေတာဘေ့စ်ပြင်ဆင်ပါ**
   ```bash
   npm run migrate
   ```

4. **အက်ပ်ကို အလုပ်လုပ်စေပါ**
   ```bash
   npm run dev
   ```

5. **ထုတ်လုပ်ရန်အတွက် တည်ဆောက်ပါ**
   ```bash
   npm run build
   ```

## 🌐 အွန်လိုင်းတွင် အသုံးပြုရန်

Cloudflare Workers တွင် တင်ပြီးအသုံးပြုနိုင်ပါသည်

```bash
npx wrangler deploy
```

## 📂 ဖိုင်ဖွဲ့စည်းပုံ

```
/burmeAI
├── src/                - အဓိက source code များ
│   ├── index.js        - Cloudflare Worker entry point
│   ├── gemini.js       - Gemini API handler
│   └── utils/         - အထောက်အကူ utility များ
├── public/             - Static files
├── assets/             - Images and icons
├── pages/              - Additional pages
├── wrangler.toml       - Cloudflare configuration
├── package.json
└── README.md
```

## 🤝 ပါဝင်ကူညီရန်

1. Repo ကို fork လုပ်ပါ
2. Feature branch တစ်ခုဖန်တီးပါ (`git checkout -b feature/AmazingFeature`)
3. သင့်ပြုပြင်မှုများကို commit လုပ်ပါ (`git commit -m 'Add some AmazingFeature'`)
4. Push လုပ်ပါ (`git push origin feature/AmazingFeature`)
5. Pull Request ဖွင့်ပါ

## 📜 လိုင်စင်မူ

MIT License - [LICENSE](LICENSE) file ကိုကြည့်ပါ

## ☎️ ဆက်သွယ်ရန်

Project Maintainer - [Your Name](mailto:your.email@example.com)

---

Made with ❤️ in Myanmar
