/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["var(--montserrat-font)"],
        raleway: ["var(--raleway-font)"],
        noto_sans: ["var(--noto_sans-font)"],
      },
      top: {
        "13rem": "3.3rem",
      },

      fontSize: {
        banner: "50px",
        "13px": "13.68px",
        "22px": "22px",
        "18px": "18px",
        "19px": "19px",
        "20px": "20px",
        "15px": "15px",
        "16px": "16px",
        "22px": "22px",
        "24px": "24px",
        "25px": "25px",
        "35px": "35px",
        "36px": "36px",
        "30px": "30px",
        "28px": "28px",
        "40px": "40px",
        "50px": "50px",
      },
      padding: {
        "95px": "95px",
      },
      colors: {
        "brand-blue": "#61C0CD",
        "brand-blue-light": "#d2f7fc",
        "gray-bg": "#EAEAEA",
        footer: "#171719",
        " dark": "#54595F",
        "footer-link": "#6A6A6D",
        banner: "#171719",
        navDropDown: "#343537",
        navHover: "#212121",
        darkText: "#333",
      },
      maxWidth: {
        "site-full": "1200px",
      },
    },
  },
  plugins: [],
};
