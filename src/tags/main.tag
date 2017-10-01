<main>

    <header></header>
    <content></content>
    <footer></footer>

    <script>
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
    </script>

</main>
