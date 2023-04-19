import thuyaApp from "../thuya-app";
import authGuard from "./auth-guard";
import userContentProvider from "./content/user-content-provider";

let app = thuyaApp;

app.getExpressApp().use(authGuard.protect);
app.addContentProvider(userContentProvider);

app.start();