riot.tag2('auth', '<div class="column" style="margin-top:70px; margin-bottom: 30px; max-width:500px;"> <h2 class="ui header"> Sign In </h2> <form class="ui large form"> <div class="ui segment"> <div if="{loading}" class="ui active dimmer"> <div class="ui text loader">Loading</div> </div> <div class="field"> <div class="ui left icon input"> <i class="user icon"></i> <input type="text" name="userId" placeholder="User ID" ref="userId"> </div> </div> <div class="field"> <div class="ui left icon input"> <i class="lock icon"></i> <input type="password" name="password" placeholder="Password" ref="password"> </div> </div> <a class="ui fluid large teal submit button" onclick="{signin}">Sign in</a> </div> <div class="ui error message"></div> </form> </div>', '', 'class="ui middle aligned center aligned grid"', function(opts) {

       var this$1 = this;
        var that = this;

        var signin = function () {
            var userId = this$1.refs.userId.value;
            var password = this$1.refs.password.value;
            that.loading = true;

            $.ajax({
                type: 'POST',
                url: Config.API_ENDPOINT + '/token',
                headers : { 'Authorization' : userId + ':' + password },
                data: JSON.stringify({})

            }).done(function(res) {
                console.log(res);
                sessionStorage.setItem('token', res.token);
                this.loading = false;
                riot.mount('header');
                location.href = "#todo";

            }).fail(function(err) {
                that.loading = false;
                console.log('Login fail', err);
                that.update();
            });
        }

});

riot.tag2('footer', '<a href="#" class="ui inverted header"> <h4> <i class="checkmark box icon"></i> Sample To-Do App </h4> </a> <div class="ui horizontal inverted small divided link list"> <a class="item" href="#">利用規約</a> <a class="item" href="#">プライバシーポリシー</a> <a class="item" href="#">お問い合わせ</a> </div>', '', 'class="ui inverted attached footer center aligned very padded segment"', function(opts) {
});

riot.tag2('header', '<div class="ui fixed inverted borderless menu"> <a href="#" class="header item"> <h4> <i class="checkmark box icon"></i> Sample To-Do App [ 0.0.1 ] </h4> </a> <div class="right menu"> <div class="header item" if="{user}"> <i class="icon user"></i> {user.userId} </div> <div class="item"> <a if="{user}" class="ui button" onclick="{signout}">Signout</a> <a if="{!user}" href="#signin" class="ui button pink">Sign in</a> </div> </div> </div>', '', 'class="ui grid"', function(opts) {
        var that = this;
        var token = sessionStorage.getItem('token');
            if (token) {
                $.ajax({
                    type: 'GET',
                    url: Config.API_ENDPOINT + '/users/me',
                    headers : {
                        'Authorization' : token
                    }
                }).done(function(res) {
                    console.log(res);
                    that.user = res;
                    that.update();
                }).fail(function(err) {
                    console.log(err);
                });
            }

        var signout = function () {
            sessionStorage.removeItem('token');
            riot.mount('header');
            location.href = '';
        }
});

riot.tag2('home', '<div class="ui center aligned very padded basic segment"> <h1 class="ui icon header"> <i class="checkmark box icon"></i> <div class="content"> Sample To-Do App. </div> </h1> <div class="sub header"> Hello World! </div> </div>', '', 'class="ui fluid very padded basic container segment" style="margin-top:70px;max-width:500px!important;"', function(opts) {
});

riot.tag2('main', '<header></header> <content></content> <footer></footer>', '', '', function(opts) {
        riot.mount('header');
        riot.mount('footer');

        route('/', function() {
             riot.mount('content', 'home');
        });
        route('/signin', function() {
            riot.mount('content', 'auth');
        });
        route('/todo', function() {
            riot.mount('content', 'todo', {
                title: 'To-Do List!',
                items: []
            });
        });
        route.start(true);
});

riot.tag2('todo', '<div class="column" style="margin-top:70px; margin-bottom: 30px; max-width:500px;"> <h3>{opts.title}</h3> <div class="ui segment"> <div if="{loading}" class="ui active inverted dimmer"> <div class="ui text loader">Loading</div> </div> <ul class="todo-ul"> <li class="todo-li" each="{items.filter(whatShow)}"> <label class="{completed: done}"> <input class="todo-input" type="checkbox" checked="{done}" onclick="{parent.toggle}"> {title} </label> </li> </ul> <form onsubmit="{add}"> <input class="todo-input" ref="input" onkeyup="{edit}"> <button disabled="{!text}">Add #{items.filter(whatShow).length + 1}</button> <button type="button" disabled="{items.filter(onlyDone).length == 0}" onclick="{removeAllDone}"> X{items.filter(onlyDone).length} </button> </form> </div> </div>', '', 'class="ui middle aligned center aligned grid"', function(opts) {

       var this$1 = this;
        var that = this;
        that.items = [];
        loadItems();

        var edit = function (e) {
            this$1.text = e.target.value
        }

        var add = function (e) {
            if (this$1.text) {
                this$1.items.push({ title: this$1.text, done: false });
                this$1.text = this$1.refs.input.value = '';
            }
            e.preventDefault();
            updateItems({ items: that.items });
        }

        var removeAllDone = function (e) {
            this$1.items = this$1.items.filter(function(item) {
                return !item.done;
            });
            updateItems({ items: that.items });
        }

        var whatShow = function (item) {
            return !item.hidden;
        }

        var onlyDone = function (item) {
            return item.done;
        }

        var toggle = function (e) {
            var item = e.item;
            item.done = !item.done;
            updateItems({ items: that.items });
        }

        var loadItems = function () {
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

        var updateItems = function (data) {
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

});
