import { client } from "electron-connect";
import { app, BrowserWindow, clipboard, ipcMain, screen, globalShortcut } from "electron";
let electronLocalshortcut = require("electron-localshortcut");

class Main {

    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow;
    static resourcesDir: string;
    static lastText: string;

    static width: number;
    static height: number;

    private static onWindowAllClosed(): void {
        if (process.platform !== "darwin") {
            Main.application.quit();
        }
    }

    private static onClose(): void {
        Main.mainWindow = null;
    }

    private static onReady(): void {
        console.log(Main.width);
        Main.mainWindow = new Main.BrowserWindow({
            width: Main.width,
            height: Main.height,
            show: false,
            frame: false,
            titleBarStyle: "hidden",
            skipTaskbar: true,
            minimizable: false,
            closable: false,
            resizable: (process.env.ELECTRON_ENV !== "production"),
            movable: false
        });
        Main.mainWindow.loadURL(`file://${Main.resourcesDir}/app.html`);
        Main.mainWindow.on("closed", Main.onClose);
        Main.mainWindow.on("move", () => {
            Main.mainWindow.show();
        });

        if (process.env.ELECTRON_ENV === "development") {
            client.create(Main.mainWindow);
        }

        setInterval(() => Main.checkClipboard(), 1000);
        ipcMain.on("copy", (event, arg) => {
            clipboard.writeText(arg);
            Main.mainWindow.hide();
        });

        globalShortcut.register("CommandOrControl+Alt+V", () => {
            if (Main.mainWindow.isVisible()) {
                Main.mainWindow.hide();
            } else {
                Main.moveWindow();
            }
        });

        electronLocalshortcut.register(Main.mainWindow, "Esc", () => {
            Main.mainWindow.hide();
        });

        electronLocalshortcut.register(Main.mainWindow, "Up", () => {
            Main.mainWindow.webContents.send("up-action");
        });

        electronLocalshortcut.register(Main.mainWindow, "Down", () => {
            Main.mainWindow.webContents.send("down-action");
        });

        electronLocalshortcut.register(Main.mainWindow, "Enter", () => {
            Main.mainWindow.webContents.send("enter-action");
        });

    }

    private static moveWindow(): void {
        let cursorPos = screen.getCursorScreenPoint();
        let display = screen.getDisplayNearestPoint(cursorPos);
        let displaySize = display.size;
        let posX = cursorPos.x;
        let posY = cursorPos.y;
        let diffWidth = displaySize.width - posX;
        let diffHeight = displaySize.height - posY;

        if (diffWidth < Main.width) {
            posX = posX - (Main.width - diffWidth);
        }

        if (diffHeight < Main.height) {
            posY = posY - (Main.height - diffHeight);
        }

        Main.mainWindow.setPosition(posX, posY);
    }

    private static checkClipboard(): void {
        let text = clipboard.readText();
        if (Main.lastText !== text) {
            Main.lastText = text;
            Main.mainWindow.webContents.send("add-text", text);
        }
    }

    static main(app: Electron.App, browserWindow: typeof BrowserWindow): void {
        Main.width = 300;
        Main.height = 400;
        Main.resourcesDir = `${__dirname}/../resources`;
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on("window-all-closed", Main.onWindowAllClosed);
        Main.application.on("ready", Main.onReady);
    }

}

if (process.env.ELECTRON_ENV === "development") {
    require("electron-debug")({ showDevTools: "undocked" });
}

Main.main(app, BrowserWindow);
