<template>
    <div class="pane-group pane-form">
        <form  v-on:submit.prevent="save">
            <div class="form-group" v-bind:class="{ 'error': number > 50 || number < 1 }">
                <label>Total items to save (min: 1, max: 50)</label>
                <input v-model="number" type="number" class="form-control" placeholder="Number to save" min="1" max="50">
            </div>
            <!-- <div class="form-group">
                <input type="text" class="form-control" placeholder="Gist API key">
            </div> -->
            <div class="form-actions">
                <button type="submit" class="btn btn-large btn-positive">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
    const Config = require("electron").remote.require("electron-config");
    const config = new Config();
    const defaultSettings = require("./../settings.json");
    export default {
        name: 'Settings',
        data() {
            return {
                number: 0
            }
        },
        methods: {
            save() {
                config.set("number", this.number);
                this.$router.push({
                    name: "home"
                });
            }
        },
        beforeMount() {
            this.number = config.has("number") ? config.get("number") : defaultSettings.number;
        }
    }
</script>

<style lang="sass">
    .pane-form {
        padding: 15px;
        form {
            width: 100%;
        }
    }
</style>
