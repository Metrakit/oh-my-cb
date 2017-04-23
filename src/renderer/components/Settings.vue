<template>
    <div class="pane-group pane-form">
        <form>
            <div class="form-group">
                <input type="number" class="form-control" placeholder="Number to save">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Gist API key">
            </div>
            <div class="form-actions">
                <button v-on:click="save()" class="btn btn-large btn-positive">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'Settings',
        data() {
            return {

            }
        },
        methods: {
            save() {
                this.$router.push({
                    name: "home"
                });
            }
        },
        beforeMount() {

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
