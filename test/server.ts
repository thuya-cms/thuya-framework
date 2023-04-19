import thuyaApp from "../thuya-app";
import userContentProvider from "./content/user-content-provider";

let app = thuyaApp;

app.addContentProvider(userContentProvider);

app.start();