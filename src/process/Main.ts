import { client } from "electron-connect";
import { app, BrowserWindow, clipboard, ipcMain } from "electron";

class Main {

    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    static resourcesDir: string;
    static lastText: string;

    private static onWindowAllClosed(): void {
        if (process.platform !== "darwin") {
            Main.application.quit();
        }
    }

    private static onClose(): void {
        Main.mainWindow = null;
    }

    private static onReady(): void {
        Main.mainWindow = new Main.BrowserWindow({
            width: 300,
            height: 400
        });
        Main.mainWindow.loadURL(`file://${Main.resourcesDir}/app.html`);
        Main.mainWindow.on("closed", Main.onClose);

        if (process.env.ELECTRON_ENV === "development") {
            client.create(Main.mainWindow);
        }
        setInterval(() => Main.checkClipboard(), 1000);
        ipcMain.on("copy", (event, arg) => {
            clipboard.writeText(arg);
        });
    }

    private static checkClipboard(): void {
        let text = clipboard.readText();
        if (Main.lastText !== text) {
            Main.lastText = text;
            Main.mainWindow.webContents.send("add-text", text);
        }
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
        Main.resourcesDir = `${__dirname}/../resources`;
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on("window-all-closed", Main.onWindowAllClosed);
        Main.application.on("ready", Main.onReady);
    }

}

if (process.env.ELECTRON_ENV === "development") {
    require("electron-debug")({ showDevTools: true });
}

Main.main(app, BrowserWindow);
