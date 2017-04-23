<template>
    <div class="window">
        <header class="toolbar toolbar-header">
            <div class="toolbar-actions">
                <router-link to="home">
                <svg v-on:click="goTo('home')" version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                    <title>settings</title>
                    <path d="M14.59 9.535c-0.839-1.454-0.335-3.317 1.127-4.164l-1.572-2.723c-0.449 0.263-0.972 0.414-1.529 0.414-1.68 0-3.042-1.371-3.042-3.062h-3.145c0.004 0.522-0.126 1.051-0.406 1.535-0.839 1.454-2.706 1.948-4.17 1.106l-1.572 2.723c0.453 0.257 0.845 0.634 1.123 1.117 0.838 1.452 0.336 3.311-1.12 4.16l1.572 2.723c0.448-0.261 0.967-0.41 1.522-0.41 1.675 0 3.033 1.362 3.042 3.046h3.145c-0.001-0.517 0.129-1.040 0.406-1.519 0.838-1.452 2.7-1.947 4.163-1.11l1.572-2.723c-0.45-0.257-0.839-0.633-1.116-1.113zM8 11.24c-1.789 0-3.24-1.45-3.24-3.24s1.45-3.24 3.24-3.24c1.789 0 3.24 1.45 3.24 3.24s-1.45 3.24-3.24 3.24z"></path>
                </svg>
            </div>
        </header>

        <div class="window-content">
            <router-view
              class="view"
              keep-alive
              transition
              transition-mode="out-in">
            </router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'App',
        methods: {
            goTo(route) {
                router.push(route);
            }
        }
    }
</script>

<style lang="sass">
    @import "../../styles/photon/photon";
    header .toolbar-actions svg {
        position: relative;
        display: inline-block;
        float: right;
        line-height: 1;
        cursor: pointer;
        path {
            cursor: pointer;
            fill: rgba(51, 51, 51, 0.84);
        }
        &:hover {
            path {
                fill: ligther(rgba(51, 51, 51, 0.84), 10)
            }
        }
    }
</style>
