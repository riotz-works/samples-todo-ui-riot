<auth class="ui middle aligned center aligned grid">
    <div class="column" style="margin-top:70px; margin-bottom: 30px; max-width:500px;">
        <h2 class="ui header">
            Sign In
        </h2>
        <form class="ui large form">
            <div class="ui segment">
                <div if={ loading } class="ui active dimmer">
                    <div class="ui text loader">Loading</div>
                </div>
                <div class="field">
                    <div class="ui left icon input">
                        <i class="user icon"></i>
                        <input type="text" name="userId" placeholder="User ID" ref="userId">
                    </div>
                </div>
                <div class="field">
                    <div class="ui left icon input">
                        <i class="lock icon"></i>
                        <input type="password" name="password" placeholder="Password" ref="password">
                    </div>
                </div>
                <a class="ui fluid large teal submit button" onclick={ signin }>Sign in</a>
            </div>
            <div class="ui error message"></div>
        </form>
    </div>

    <script>
        var that = this;

        signin() {
            var userId = this.refs.userId.value;
            var password = this.refs.password.value;
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

    </script>
</auth>
