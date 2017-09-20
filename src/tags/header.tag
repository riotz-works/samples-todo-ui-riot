<header class="ui grid">
    <div class="ui fixed inverted borderless menu">
        <a href="#" class="header item">
            <h4>
                <i class="checkmark box icon"></i>
                Sample To-Do App [ 0.0.1 ]
            </h4>
        </a>
        <div class="right menu">
            <div class="header item" if={ user }>
                <i class="icon user"></i>
                { user.userId }
            </div>
            <div class="item">
                <a if={ user } class="ui button" onclick={ signout }>Signout</a>
                <a if={ !user } href="#signin" class="ui button pink">Sign in</a>
            </div>
        </div>
    </div>

    <script>
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

        signout() {
            sessionStorage.removeItem('token');
            riot.mount('header');
            location.href = '';
        }
    </script>
</header>
