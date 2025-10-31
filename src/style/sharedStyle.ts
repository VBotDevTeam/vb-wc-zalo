// file: sharedStyle.ts
export const sharedStyle = `
:host {
  font-family: "Be Vietnam Pro",Inter, system-ui, Avenir, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
}

/* Color */
:host {
  --primary: #1666c8;
  --ai-tag-bg: #ffffff;
  --member-bg: #e6f0fa;
  --customer-bg: #f5f7fa;
  --vb-bg: #ffffff;
  --vb-text: #000000;
}

:host(.dark) {
  --primary: #3e87e0;
  --ai-tag-bg: #141414;
  --member-bg: #153b75;
  --customer-bg: #2a3846;
  --vb-bg: #141414;
  --vb-text: #ffffff;
}

/* Scrollbar */
/* Light mode */
:host ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:host ::-webkit-scrollbar-track {
  background: #ffffff;
}

:host ::-webkit-scrollbar-thumb {
  background-color: #555;
  border-radius: 4px;
  border: 2px solid #ffffff;
}

:host {
  scrollbar-width: thin;
  scrollbar-color: #dbdcde #ffffff;
}

/* Dark mode */
:host(.dark) ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:host(.dark) ::-webkit-scrollbar-track {
  background: #141414;
}

:host(.dark) ::-webkit-scrollbar-thumb {
  background-color: #3b3c3f;
  border-radius: 4px;
  border: 2px solid #141414;
}

:host(.dark) {
  scrollbar-width: thin;
  scrollbar-color: #3b3c3f #141414;
}
`
