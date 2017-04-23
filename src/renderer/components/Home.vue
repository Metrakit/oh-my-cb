<template>
    <div class="pane-group">
        <div class="pane sidebar">

            <ul class="list-group">
                <li
                    v-on:mouseenter="hoverIndex(index)"
                    v-bind:id="'index-' + index"
                    v-bind:class="{ 'selected': index === indexSelected }"
                    class="list-group-item"
                    v-for="(text, index) in texts"
                    v-on:click="copyToClipboard(text, index)"
                >
                    <div class="media-body">{{ text }}</div>
                </li>
            </ul>

        </div>
    </div>
</template>

<script>
    const ipcRenderer = require("electron").ipcRenderer;
    import Vue from "vue";
    export default {
        name: 'Home',
        data() {
            return {
                texts: Array,
                indexSelected: 0,
                maxLength: 20
            }
        },
        methods: {
            addText(text) {
                if (this.texts.length >= this.maxLength) {
                    console.log("test");
                    Vue.delete(this.texts, (this.texts.length-1));
                }
                this.texts.unshift(text);
            },
            copyToClipboard(content, index) {
                ipcRenderer.send("copy", content);
                new Notification('Clipboard', {
                    body: "Contenu ajouté dans le presse papier !"
                });
            },
            selectIndex(plus) {
                if (plus) {
                    if (this.indexSelected < (this.texts.length-1)) {
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
                this.moveToIndex();
            },
            moveToIndex() {
                // bug
                // window.location.href = "#index-" + this.indexSelected;
            }
        },
        beforeMount() {
            this.texts = [];
            ipcRenderer.on("add-text", (event, text) => {
                this.addText(text);
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
