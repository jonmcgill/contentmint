Vue.component('categories', {

    props: ['components'],

    template: '\
        <div :class="container">\
            <button class="category-selected" @click="toggle = !toggle">\
                <span>{{ selected }}</span><i :class="chevron"></i></button>\
            <div class="category-list">\
                <button class="category-option"\
                    @click="select()">All</button>\
                <button class="category-option"\
                    v-for="cat in categories"\
                    @click="select(cat)"\
                    >{{ cat }}</button>\
            </div>\
        </div>',

    data: function(){return{
        toggle: false,
        selected: 'All'
    }},

    methods: {
        select: function(item) {
            this.selected = item || 'All';
            this.toggle = false;
            var filtered = this.components;
            if (this.selected !== 'All') {
                filtered = this.components.filter(function(comp) {
                    return comp.category === item;
                })
            }
            this.$bus.$emit('filteredCategories', filtered);
        }
    },
    computed: {

        container: function() {
            return {
                'category-container': true,
                'active': this.toggle
            } 
        },
        chevron: function() {
            return {
                'fa': true,
                'fa-chevron-left': !this.toggle,
                'fa-chevron-down': this.toggle
            }
        },
        categories: function() {
            var categories = this.components.map(function(comp) {
                return comp.category;
            });
            return categories.filter(function(cat, i) {
                return categories.indexOf(cat) === i;
            }).sort();
        }
    },
    mounted: function() {
        var _this = this;
        this.$bus.$on('closeCategoryList', function() {
            _this.toggle = false;
        })
    }

})