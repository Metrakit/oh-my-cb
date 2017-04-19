<template>
    <div class="window">
        <div class="window-content">
            <div class="pane-group">
                <div class="pane sidebar">

                    <ul class="list-group">
                        <li class="list-group-item" v-for="(text, index) in texts" v-on:click="copyToClipboard(text, index)">
                            <div class="media-body">{{ text }}</div>
                        </li>
                    </ul>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
    const ipcRenderer = require("electron").ipcRenderer;
    export default {
        name: 'App',
        data () {
            return {
                texts: Array
            }
        },
        methods: {
            addText(text) {
                this.texts.unshift(text);
            },
            copyToClipboard(content, index) {
                ipcRenderer.send("copy", content);
                new Notification('Clipboard', {
                    body: "Contenu ajouté dans le presse papier !"
                });
            }
        },
        beforeMount () {
            this.texts = [];
            ipcRenderer.on("add-text", (event, text) => {
                this.addText(text);
            });
        }
    }
</script>

<style lang="sass">
    @import "../../styles/photon/photon";
    .list-group-item {
        &:hover {
            color: #fff;
            background-color: #116cd6;
        }
        &,.media-body {
            &:hover {
                cursor: pointer;
            }
        }
    }
</style>
