import { defaultTheme } from "vuepress";

export default {
  lang: "zh-CN",
  title: "💫Viaのblog",
  // description: "这是我的第一个 VuePress 站点",
  head: [["link", { rel: "icon", href: "/babe.png" }]],
  theme: defaultTheme({
    logo: "/babe.png",
    lastUpdated: "上次更新",
    navbar: [
      {
        text: "React🌴",
        children: [
          {
            text: "底层",
            link: "/pages/reactCode",
          },
          {
            text: "其他",
            link: "/pages/react",
          },
        ],
      },
      {
        text: "Basic 🐳",
        children: [
          {
            text: "JS",
            link: "/pages/javascript",
          },
          {
            text: "CSS",
            link: "/pages/css",
          },
          {
            text: "Webpack",
            link: "/pages/webpack",
          },
          {
            text: "Flutter",
            link: "/pages/flutter",
          },
        ],
      },
      {
        text: "Web 🌏",
        children: [
          {
            text: "HTTP",
            link: "/pages/http",
          },
          // {
          //   text: "安全",
          //   link: "/pages/security",
          // },
          {
            text: "浏览器",
            link: "/pages/browser",
          },
        ],
      },
      {
        text: "Node ☁️",
        children: [
          {
            text: "node",
            link: "/pages/node",
          },
          {
            text: "nest",
            link: "/pages/nest",
          },
        ],
      },
      {
        text: "Blog ✍🏻",
        children: [
          // { text: "面试 📖", link: "/pages/interview" },
          { text: "日常记录", link: "/pages/log" },
          { text: "博客", link: "/pages/blog" },
        ],
      },
      // { text: "杂记 🍀", link: "/pages/diary" },
    ],
    search: true,
    sidebar: "auto", // 侧边栏配置
    sidebarDepth: 3, // 侧边栏显示2级
  }),
};
