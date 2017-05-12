<template>
<div class="pane-group">
    <div class="pane sidebar">

        <ul class="list-group">
            <li v-on:mouseenter="hoverIndex(index)" v-bind:id="'index-' + index" v-bind:class="{ 'selected': index === indexSelected }" class="list-group-item" v-for="(content, index) in contents" v-on:click="copyToClipboard(content, index)">
                <div v-if="content.type == 'image'" class="media-body">
                    <img style="height: 80px; width: 80px;" v-bind:src="content.data">
                </div>
                <div v-else class="media-body">{{ content.data }}</div>
            </li>
        </ul>

    </div>
</div>
</template>

<script>
const ipcRenderer = require("electron").ipcRenderer;
const Config = require('electron').remote.require("electron-config");
const config = new Config();
const defaultSettings = require("./../settings.json");
import Vue from "vue";
export default {
    name: 'Home',
    data() {
        return {
            contents: Array,
            indexSelected: 0,
            maxLength: 0
        }
    },
    methods: {
        addContent(content) {
            if (this.contents.length >= this.maxLength) {
                this.clean(1);
            }
            this.contents.unshift(content);
            config.set("items", this.contents);
        },
        clean(nbToReduce) {
            let diff = (this.contents.length - this.maxLength) + nbToReduce;
            for (var i = 0; i < diff; i++) {
                Vue.delete(this.contents, (this.contents.length - 1));
            }
            config.set("items", this.contents);
        },
        copyToClipboard(content, index) {
            ipcRenderer.send("copy", content);
            new Notification('Clipboard', {
                body: "Contenu ajouté dans le presse papier !"
            });
        },
        selectIndex(plus) {
            if (plus) {
                if (this.indexSelected < (this.contents.length - 1)) {
                    this.indexSelected++;
                }
            } else {
                if (this.indexSelected > 0) {
                    this.indexSelected--;
                }
            }
            this.moveToIndex();
        },
        hoverIndex(index) {
            this.indexSelected = index;
        },
        moveToIndex() {
            var el = document.getElementById("index-" + this.indexSelected);
            if (el) {
                el.scrollIntoView(true);
            }
        }
    },
    beforeMount() {
        this.maxLength = config.has("number") ? config.get("number") : defaultSettings.number;
        this.indexSelected = 0;
        this.contents = [];

        if (config.has("items") && config.get("items").length) {
            this.contents = config.get("items");
        }

        this.clean(0);

        ipcRenderer.on("add-content", (event, content) => {
            if (content.data && content.data.length && content.data.trim() !== "") {
                this.addContent(content);
            }
        });

        ipcRenderer.on("up-action", (event, arg) => {
            this.selectIndex(false);
        });

        ipcRenderer.on("down-action", (event, arg) => {
            this.selectIndex(true);
        });

        ipcRenderer.on("enter-action", (event, arg) => {
            this.copyToClipboard(this.contents[this.indexSelected], this.indexSelected);
        });

        ipcRenderer.on("move-window", (event, arg) => {
            this.indexSelected = 0;
            this.moveToIndex();
        });

    },
    beforeDestroy() {
        ipcRenderer.removeAllListeners("up-action");
        ipcRenderer.removeAllListeners("down-action");
        ipcRenderer.removeAllListeners("enter-action");
    }
}
</script>

<style lang="sass">
.list-group-item {
    &.selected {
        color: #fff;
        background-color: #116cd6;
    }
    &,
    .media-body {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>
