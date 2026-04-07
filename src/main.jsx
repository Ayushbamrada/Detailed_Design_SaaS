import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./app/store";
import App from "./App";
import "./index.css";
import { applyThemeToDocument } from "./utils/theme";

let previousTheme = store.getState().ui.theme;
applyThemeToDocument(previousTheme);
store.subscribe(() => {
  const next = store.getState().ui.theme;
  if (next !== previousTheme) {
    previousTheme = next;
    applyThemeToDocument(next);
  }
});
window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (store.getState().ui.theme === "system") {
      applyThemeToDocument("system");
    }
  });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);