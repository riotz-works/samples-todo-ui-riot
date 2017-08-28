<todo class="ui middle aligned center aligned grid">
    <div class="column" style="margin-top:70px; margin-bottom: 30px; max-width:500px;">
        <h3>{ opts.title }</h3>
        <div class="ui segment">
            <div if={ loading } class="ui active inverted dimmer">
                <div class="ui text loader">Loading</div>
            </div>
            <ul class="todo-ul">
                <li class ="todo-li" each={ items.filter(whatShow) }>
                    <label class={ completed: done }>
                        <input class="todo-input" type="checkbox" checked={ done } onclick={ parent.toggle }> { title }
                    </label>
                </li>
            </ul>
            <form onsubmit={ add }>
                <input class="todo-input" ref="input" onkeyup={ edit }>
                <button disabled={ !text }>Add #{ items.filter(whatShow).length + 1 }</button>

                <button type="button" disabled={ items.filter(onlyDone).length == 0 } onclick={ removeAllDone }>
                    X{ items.filter(onlyDone).length }
                </button>
            </form>
        </div>
    </div>

    <script>
        var that = this;
        that.items = [];
        loadItems();

        edit(e) {
            this.text = e.target.value
        }

        add(e) {
            if (this.text) {
                this.items.push({ title: this.text, done: false });
                this.text = this.refs.input.value = '';
            }
            e.preventDefault();
            updateItems({ items: that.items });
        }

        removeAllDone(e) {
            this.items = this.items.filter(function(item) {
                return !item.done;
            });
            updateItems({ items: that.items });
        }

        whatShow(item) {
            return !item.hidden;
        }

        onlyDone(item) {
            return item.done;
        }

        toggle(e) {
            var item = e.item;
            item.done = !item.done;
            updateItems({ items: that.items });
        }

        function loadItems() {
            that.loading = true;
            var token = sessionStorage.getItem('token');
            $.ajax({
                type: 'GET',
                url: Config.API_ENDPOINT + '/todos',
                headers : { 'Authorization' : token } ,
            }).done(function(res) {
                that.loading = false;
                that.items = res.items;
                that.update();

            }).fail(function(err) {
                that.loading = false;
                console.log(err);
            });
        }

        function updateItems(data) {
            that.loading = true;
            var token = sessionStorage.getItem('token');
            $.ajax({
                type: 'POST',
                url: Config.API_ENDPOINT + '/todos',
                headers : { 'Authorization' : token },
                data: JSON.stringify(data)
            }).done(function(res) {
                that.loading = false;
                that.update();

            }).fail(function(err) {
                console.log(err);
            });
        }

    </script>
</todo>
