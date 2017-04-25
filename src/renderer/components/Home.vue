<template>
<div class="pane-group">
    <div class="pane sidebar">

        <ul class="list-group">
            <li v-on:mouseenter="hoverIndex(index)" v-bind:id="'index-' + index" v-bind:class="{ 'selected': index === indexSelected }" class="list-group-item" v-for="(text, index) in texts" v-on:click="copyToClipboard(text, index)">
                <div class="media-body">{{ text }}</div>
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
console.log(defaultSettings.number);
import Vue from "vue";
export default {
    name: 'Home',
    data() {
        return {
            texts: Array,
            indexSelected: 0,
            maxLength: 0
        }
    },
    methods: {
        addText(text) {
            if (this.texts.length >= this.maxLength) {
                this.clean(1);
            }
            this.texts.unshift(text);
            config.set("items", this.texts);
        },
        clean(nbToReduce) {
            let diff = (this.texts.length - this.maxLength) + nbToReduce;
            for (var i = 0; i < diff; i++) {
                Vue.delete(this.texts, (this.texts.length - 1));
            }
            config.set("items", this.texts);
        },
        copyToClipboard(content, index) {
            ipcRenderer.send("copy", content);
            new Notification('Clipboard', {
                body: "Contenu ajouté dans le presse papier !"
            });
        },
        selectIndex(plus) {
            if (plus) {
                if (this.indexSelected < (this.texts.length - 1)) {
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
            document.getElementById("index-" + this.indexSelected).scrollIntoView(true);
        }
    },
    beforeMount() {
        this.maxLength = config.has("number") ? config.get("number") : defaultSettings.number;
        this.indexSelected = 0;
        this.texts = [];

        if (config.has("items") && config.get("items").length) {
            this.texts = config.get("items");
        }

        this.clean(0);

        ipcRenderer.on("add-text", (event, text) => {
            if (text.length && text.trim() !== "") {
                this.addText(text);
            }
        });

        ipcRenderer.on("up-action", (event, arg) => {
            this.selectIndex(false);
        });

        ipcRenderer.on("down-action", (event, arg) => {
            this.selectIndex(true);
        });

        ipcRenderer.on("enter-action", (event, arg) => {
            this.copyToClipboard(this.texts[this.indexSelected], this.indexSelected);
        });

    }
}
</script>

<style lang="sass">
.list-group-item {
    &.selected,
    &:hover {
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
